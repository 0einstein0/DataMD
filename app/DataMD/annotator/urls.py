from  django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name = "dashboard"),
    path('canvas/<str:project_id>/', views.canvas, name = "canvas"),
    path('dashboard/create_project/', views.create_project, name="create_project")
]
