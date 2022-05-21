from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import AnnotationType, Project, ProjectInvite, Image

class LoginForm(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": "Username",
                "class": "form-control"
            }
        ))
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "placeholder": "Password",
                "class": "form-control"
            }
        ))

# class RegisterForm(UserCreationForm):
#     MANAGER = "manager_user_group"
#     ANNOTATOR = "annotator_user_group"

#     USER_GROUP_CHOICES = [
#         (MANAGER, "Manager"),
#         (ANNOTATOR, "Annotator")
#     ]

#     email = forms.EmailField(required = True)
#     user_group = forms.CharField(choices = USER_GROUP_CHOICES)

#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password1', 'password2']

class SignUpForm(UserCreationForm):
    MANAGER = "manager_user_group"
    ANNOTATOR = "annotator_user_group"

    USER_GROUP_CHOICES = [
        (MANAGER, "Manager"),
        (ANNOTATOR, "Annotator")
    ]

    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": "Username",
                "class": "form-control"
            }
        ))
    
    first_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": "First Name",
                "class": "form-control"
            }
        ))
    
    last_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": "Last Name",
                "class": "form-control"
            }
        ))

    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": "Username",
                "class": "form-control"
            }
        ))
    
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                "placeholder": "Email",
                "class": "form-control"
            }
        ))
    password1 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "placeholder": "Password",
                "class": "form-control"
            }
        ))
    password2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "placeholder": "Password check",
                "class": "form-control"
            }
        ))

    user_group = forms.ChoiceField(label = 'Account Type', widget=forms.Select(
        attrs={
                "class": "form-control"
            }
    ), choices=USER_GROUP_CHOICES)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'user_group', 'first_name', 'last_name')

class ProjectForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(ProjectForm, self).__init__(*args, **kwargs)

        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
        
        self.fields['description'].widget.attrs['rows'] = '7'
        self.fields['description'].widget.attrs['placeholder'] = 'Project Description'

        self.fields['name'].widget.attrs['placeholder'] = 'Project Name'

    class Meta:
        model = Project
        fields = ['name', 'description', 'annotation_type', 'machine_learning_model']


class AddAnnotationClassesForm(forms.Form):
    classfield = forms.CharField()

    def __init__(self, *args, **kwargs):
        super(AddAnnotationClassesForm, self).__init__(*args, **kwargs)
        self.fields['classfield'].widget.attrs['class'] = 'form-control'

class AddAnnotatorsForm(forms.Form):
    annotators = forms.ModelChoiceField(label = 'Annotators to Invite', widget=forms.SelectMultiple, queryset=User.objects.filter(groups__name='annotator_user_group'))
    # TODO: MAKE A PROPER ASYNC SEARCH, NOT THIS SEARCHABLE SELECT BOX WORK AROUND

    def __init__(self, *args, **kwargs):
        super(AddAnnotatorsForm, self).__init__(*args, **kwargs)
        self.fields['annotators'].widget.attrs['class'] = 'select2-multiple'
        self.fields['annotators'].empty_label = None

