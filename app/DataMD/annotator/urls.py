from  django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.login_view, name = "login"),
    path('logout/', views.logout_user, name = "logout"),
    path('register/', views.register_page, name = "register"),
    path('auth_rest_pass/', views.filler, name="auth_reset_pass"),
    path('dashboard/', views.dashboard, name = "dashboard"),
    path('canvas/<str:project_id>/', views.canvas, name = "canvas"),
    # MANAGER 
    path('dashboard/create_project/', views.create_project, name="create_project"),
    path('dashboard/manage_project/<str:project_id>', views.manage_project, name="manage_project"),
    path('dashboard/annotator_progress/', views.filler, name="annotator_progress"),
    # ANNOTATOR
    path('dashboard/project_invites', views.project_invites_page, name="project_invites_page")
    #path('dashboard/edit_project/<str:pk>/', views.edit_project, name="edit_project")
]
