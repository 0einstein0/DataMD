import re
from django.shortcuts import render
from .forms import ProjectForm
# Create your views here.

from django.http import HttpResponse

APP_NAME = 'annotator'


# dashboard to view work to be done
def dashboard(request):
    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + '/dashboard.html' 
    context = {} # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )

# annotation canvas for bounding boxes, keypoints, classification etc
def canvas(request, project_id):
    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + '/canvas.html' 
    context = {'project_id': project_id} # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )

def create_project(request):
    # --- RENDER VARIABLES ---
    request = request
    template = APP_NAME + '/create_project.html' 
    context = {'form': ProjectForm()} # all the variables you want to pass to context
    # --- --- ---

    return render(
        request, # pass the http request argument
        template, # the template which represents function
        context # a dictionary which will be added to the template context
    )