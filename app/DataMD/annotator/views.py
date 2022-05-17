from __future__ import annotations
from datetime import timedelta
from email.mime import image
from pickletools import read_uint1
import re
import PIL
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from pyparsing import anyOpenTag
from .forms import LoginForm, SignUpForm, ProjectForm, AddAnnotatorsForm
from .models import Project, AnnotationType, ProjectInvite, Image, AnnotationClass
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
import pydicom
from django.core.files.storage import FileSystemStorage
import cv2
import keras

# cloud
from google.cloud import storage
#-----


# Create your views here.

APP_NAME = 'annotator'

#####################################
MANAGER = 'manager_user_group'
ANNOTATOR = 'annotator_user_group'
#########
USER_GROUP_INFO = {
    MANAGER: {
        "directory" : "/managers"
    },
    ANNOTATOR: {
        "directory" : "/annotators"
    }
}
######################################

# HELPER/ENCAPSULATOR FUNCTIONS TO AVOID UNREADABLE CODE #
def getUserGroup(request):
    return list(request.user.groups.values_list('name',flat = True))[0] # Return: String

def isManager(user):
    return user.groups.filter(name=MANAGER).exists()

def isAnnotator(user):
    return user.groups.filter(name=ANNOTATOR).exists()

#########################################################

def index(request):
    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + '/landing_page/index.html' 
    context = {} # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )

def login_view(request):
    # dont let a logged in user visit this page
    if request.user.is_authenticated:
        return redirect('dashboard')

    form = LoginForm(request.POST or None)

    if request.method == "POST":

        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")

            try: 
                user = User.objects.get(username=username)
            except:
                messages.error(request, "User does not exist")

            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, "Invalid Credentials")
        else:
            messages.error(request, "Error in Validation")

    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + '/accounts/login.html' 
    context = {"form": form} # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )


def logout_user(request):
    logout(request)
    return redirect('index')

def register_page(request):
    msg = None
    success = False

    if request.method == "POST":
        form = SignUpForm(data=request.POST)
        username = request.POST.get('username')
        email = request.POST.get('email')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        user_group = request.POST.get('user_group')

        user, created = User.objects.get_or_create(
            username = username,
            email = email,
            first_name = first_name,
            last_name = last_name
        )

        user.set_password(form.cleaned_data.get('password1'))
        group = Group.objects.get(name=user_group)
        user.groups.add(group)

        print("created:", str(created), " of user: ", user)

        
    
    form = SignUpForm()
        

    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + '/accounts/register.html' 
    context = {"form": form, "msg": msg, "success": success} # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )



def register_page_old(request):
    page = 'register'
    
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'An error occured during registration')

    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + '/accounts/register.html' 
    context = {'page': page, 
                'form': SignUpForm() } # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )




# dashboard to view work to be done
@login_required
def dashboard(request):
    if request.user.is_staff:
        return redirect('/admin')

    user_group = getUserGroup(request)

    projects = None
    # Retrive from database for context variables
    if user_group == MANAGER:
        projects = Project.objects.filter(manager_id = request.user.id) # get managed projects
        if not projects:
            projects = None
        print(projects) # -- DEBUG
    if user_group == ANNOTATOR:
        projects = Project.objects.filter(annotators = request.user.id)

    print(user_group)
        
    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + USER_GROUP_INFO[user_group]['directory'] + '/dashboard.html' 
    context = { 'projects': projects, 
        'user_group': user_group 
    } # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )

# annotation canvas for bounding boxes, keypoints, classification etc
@login_required
@user_passes_test(isAnnotator)
def canvas(request, project_id):
    image_urls = []
    possible_labels = []
    canvas_page = ''

    # retrive all images that the user is assigned to 
    try:
        project = Project.objects.get(id = project_id)
    except ObjectDoesNotExist:
        return redirect('dashboard')
    
    if project.annotation_type.name == 'CF':
        canvas_page = '/canvas_CF.html'
    else:
        canvas_page = '/canvas_OD.html'

    images = Image.objects.filter(project = project, assigned_annotator = request.user)
    print(images) # -- DEBUG
    annotation_classes = AnnotationClass.objects.filter(project = project)
    print(annotation_classes, " - ", type(annotation_classes)) # -- DEBUG

    client = storage.Client()
    bucket = client.get_bucket('med-images')
    
    #prediction = pred(, images[0].url)

    for x in images:
        image_urls.append(
            bucket
            .get_blob(x.image.name)
            .generate_signed_url(timedelta(3))
        )

    for x in annotation_classes:
        possible_labels.append(x.name)

    print("image_urls :: ", image_urls) # -- DEBUG
    print("possible labels :: ", possible_labels) # -- DEBUG

    print("hmm", project.annotation_type.name) # -- DEBUG
    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + USER_GROUP_INFO[ANNOTATOR]['directory'] + canvas_page 
    context = {'project': project, 
    'images': images, 
    'image_urls': image_urls, 
    'possible_labels': possible_labels,
    'annotation_classes': annotation_classes,
    'username': request.user.username,
    } # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )

@login_required
@user_passes_test(isManager)
def create_project(request):

    if request.method == 'POST':

        # Create Project Record
        project_instance = Project(
            name = request.POST.get('name'),
            description = request.POST.get('description'),
            annotation_type = AnnotationType.objects.get(id = request.POST.get('annotation_type')),
            manager = request.user
        )

        # Commit Record to DB
        project_instance.save()

        # Create AnnotationClass records
        annotation_classes = request.POST.getlist('class')
        
        for annotation_class in annotation_classes:
            annotation_class_instance = AnnotationClass(name = annotation_class, project=project_instance)
            # Commit Record to DB
            annotation_class_instance.save()

        return redirect('manage_project', project_id = project_instance.id) # redirect to the project's manage page for further configuration

    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + USER_GROUP_INFO[MANAGER]['directory'] + '/create_project.html' 
    context = {'form': ProjectForm()} # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )

@login_required
@user_passes_test(isManager)
def manage_project(request, project_id):
    error_messages = []
    success_messages = []
    warning_messages = []

    project = Project.objects.get(id = project_id)
    pending_invites = ProjectInvite.objects.filter(project = project, status = 'Pending')
    
    # only allow access if they are the manager of this project
    if project.manager != request.user:
        return redirect('dashboard')    

    # handle form input
    if request.method == 'POST':
        print("request.POST :: ", request.POST) # -- DEBUG
        print("request.FILES :: ", request.FILES) # -- DEBUG

        # Check which form was submitted
        if 'editInfoButton' in request.POST:
            project.name = request.POST.get('name')
            project.description = request.POST.get('description')
            project.save()
            success_messages.append('Changes Saved')
        elif 'btn_remove' in request.POST:
            annotator_to_remove = User.objects.get(id = request.POST.get('annotator_id'))
            # remove the accepted invite record, as this should lead to a clean slate :: as if the invite was never sent
            invite_to_remove = ProjectInvite.objects.get(recipient_annotator = annotator_to_remove.id, project = project)
            invite_to_remove.delete()

            # remove the annotator from the project
            project.annotators.remove(annotator_to_remove)
        elif 'uploadImagesToProjectButton' in request.POST:
            images = request.FILES.getlist('images')
            for image in images:
                # TODO: assign each image to an annotator
                # -> get a list of all annotators
                annotators = project.annotators.all()
                
                print("annotators  :: ", annotators) # -- DEBUG
                
                # -> see how much images unannotated does each annotator have and return the annotator with the least
                assigned_annotator = annotators.first()
                print("assigned annotator :: ", assigned_annotator)
                
                for annotator in annotators:
                    count_of_unnanotated_images_of_user = Image.objects.filter(project = project.id, annotation_class = None, assigned_annotator = annotators).count()
                

                print("image ::", image) # -- DEBUG
                print("image content type ::", image.content_type) # -- DEBUG
                if image.content_type == 'image/jpeg' or image.content_type == 'image/png':
                    image_instance = Image(
                        name = image.name,
                        image = image,
                        project = project
                    )
                    #image_instance.save()
                    print('image instance SAVED :: ', image_instance)
                else: 
                    print('ERROR: wRONG FILE TYPE')
                    print('you uploaded ', image.content_type)
                    ds = pydicom.read_file(image) # read dicom image
                    img = ds.pixel_array
                    png = PIL.Image.fromarray(img, 'RGB')
                    #png.save('dicom.png')
                    png.show()
                    print("pixel array :: ", img)

                    # TODO: return error
                
                

        elif 'addAnnotatorsButton' in request.POST:
            for annotator_id in request.POST.getlist('annotators'):
                
                annotator_to_invite = User.objects.get(id = annotator_id)
                
                # ----------------------
                # first make sure the annotator isn't already part of the project, 
                # to avoid error where the accepted invite record has been deleted
                # although this error would only occur if a superuser directly added a user from the admin panel
                # rather than have an invite sent first, or if the invite was deleted from record for any reason
                if project.annotators.filter(id = annotator_to_invite.id ).exists():
                    error_messages.append("@"+ annotator_to_invite.username + " is already an annotator on this project.")
                    break
                # -----------------------


                # Create an Invite
                try:
                    project_invite_instance = ProjectInvite(
                        status = 'Pending',
                        project = project,
                        recipient_annotator = annotator_to_invite
                    )
                    project_invite_instance.save()
                    success_messages.append("Invite sent to @" + annotator_to_invite.username + ".")
                except IntegrityError:
                    # This means that this combination already exists as an invite as its breaking the unique_together constraint for project and recipient_annotator
                    invite = ProjectInvite.objects.get(project = project, recipient_annotator = annotator_to_invite)
                    if invite.status == 'Pending':
                        error_messages.append("@" + annotator_to_invite.username + " has already been sent an invite. Approval Pending.")
                    elif invite.status == 'Rejected':
                        invite.status = 'Pending'
                        invite.save()
                        warning_messages.append("@" + annotator_to_invite.username + " has previously rejected an invite. Invite Resent")
                    elif invite.status == 'Accepted':
                        error_messages.append("@"+ annotator_to_invite.username + " is already an annotator on this project.")

    # Prepare Edit Info Form ----
    editInfoForm = ProjectForm(instance = project)
    editInfoForm.fields['annotation_type'].disabled = True
    annotation_classes = AnnotationClass.objects.filter(project = project)
    print(annotation_classes) # -- DEBUG
    # ---

    # Prepare Add Annotators Form ----
    addAnnotatorsForm = AddAnnotatorsForm()
    # ---

    # Prepare Images ---
    images = Image.objects.filter(project = project)
    print(images) # -- DEBUG
    annotated_images = images.exclude(annotation_class__isnull = True)
    unannotated_images = images.exclude(annotation_class__isnull = False)
    print("annotated: ", annotated_images) # -- DEBUG 
    print("unannotated: ", unannotated_images) # -- DEBUG
    # ---

    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + USER_GROUP_INFO[MANAGER]['directory'] + '/manage_project.html'
    context = { 'project': project, 
        'editInfoForm': editInfoForm, 
        'annotation_classes': annotation_classes,
        'pending_invites': pending_invites,
        'addAnnotatorsForm': addAnnotatorsForm,
        'error_messages': error_messages,
        'success_messages': success_messages,
        'warning_messages': warning_messages,
    } # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )

@login_required
@user_passes_test(isAnnotator)
def project_invites_page(request):
    pending_invites = ProjectInvite.objects.filter(recipient_annotator = request.user, status = 'Pending')
    if not pending_invites:
            pending_invites = None

    if request.method == "POST":
        print(request.POST)
        invite_to_handle = ProjectInvite.objects.get(id = request.POST.get('invite_id'))

        if 'btn_accept' in request.POST:
            project_to_accept = Project.objects.get(id = invite_to_handle.project.id)
            project_to_accept.annotators.add(request.user) # add annotator to project
            invite_to_handle.status = 'Accepted'
            
            # commit changes to db
            invite_to_handle.save()
            project_to_accept.save()

        elif 'btn_reject' in request.POST:
            invite_to_handle.status = 'Rejected'
            invite_to_handle.save()

    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + USER_GROUP_INFO[ANNOTATOR]['directory'] + '/project_invites.html' 
    context = {'pending_invites': pending_invites} # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )

def filler(request):
    return render(request)
#####################################################
def login_page(request):
    page = 'login' # for the context to know the calling function

    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == "POST":
        username = request.POST.get('username').lower()
        password = request.POST.get('password')

        try: 
            user = User.objects.get(username=username)
        except:
            messages.error(request, "User does not exist")

        user = authenticate(request, username = username, password = password)

        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Username/Password incorrect")

    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + '/login_register.html' 
    context = {'page': page} # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )

def pred(model_path,img_path):   
        img = cv2.imread(img_path)   
        model = keras.models.load_model(model_path)          
        if img is None and model is None:
            return('Something is wrong')
        else:        
            img = cv2.resize(img,(300,300),3)
            img = img.reshape(1,300,300,3)
            return model.predict(img)


# AJAX VIEWS
def updateLabelsClassification(request):
    image_id = request.GET['image_id']
    annotation_class_id = request.GET['annotation_class_id']

    if annotation_class_id != 'None':
        # get annotation_class db record object
        annotation_class = AnnotationClass.objects.get(id = annotation_class_id)
         # get image db record object
        image = Image.objects.get(id = image_id) 
        # get the project
        project = image.project

        print("request.GET :: ", request.GET) # -- DEBUG
        print("image :: ", image) # -- DEBUG
        print("annotation_class :: ", annotation_class) # -- DEBUG

        with project.annotation.open('a') as f:
            f.write(str(image.image.name) + "," + str(annotation_class.name) + "\n")

    return HttpResponse(request.GET)

def fetchLabelIfExists(request):
    
    pass