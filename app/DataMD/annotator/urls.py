from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.login_view, name = "login"),
    path('logout/', views.logout_user, name = "logout"),
    path('register/', views.register_page, name = "register"),
    path('auth_rest_pass/', views.filler, name="auth_reset_pass"),
    path('dashboard/', views.dashboard, name = "dashboard"),
    path('playground/object_detection', views.od_playground, name = "od_playground"),
    # MANAGER 
    path('dashboard/create_project/', views.create_project, name="create_project"),
    path('dashboard/manage_project/<str:project_id>', views.manage_project, name="manage_project"),
    path('dashboard/annotator_progress/', views.annotator_progress, name="annotator_progress"),
    # ANNOTATOR
    path('dashboard/project_invites', views.project_invites_page, name="project_invites_page"),
    path('canvas/<str:project_id>/', views.canvas, name = "canvas"),
    # DB APIs FOR AJAX 
    path('ajax/update/labels/classification', views.updateLabelsClassification, name = "update_labels_classification"),
    path('ajax/fetch/labels/classification', views.fetchLabelsClassification, name="fetch_labels_classification"),
    path('ajax/update/labels/object_detection', views.updateLabelsObjectDetection, name="update_labels_object_detection"),
    path('ajax/fetch/labels/object_detection', views.fetchLabelsObjectDetection, name="fetch_labels_object_detection"),
    path('ajax/delete/labels/object_detection', views.deleteLabelsObjectDetection, name="delete_labels_object_detection"),
    path('ajax/fetch/predictions/classification', views.fetchPredictionsClassification, name="fetch_predictions_classification")
]
