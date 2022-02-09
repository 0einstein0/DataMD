from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Team(models.Model):
    name = models.CharField(max_length = 200)
    description = models.TextField(null = True, blank = True)

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length = 200)
    project_type = models.CharField(max_length = 25) #classification, bounding box, keypoint

    # Relationship Field
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE) # if team is deleted, project is deleted

    def __str__(self):
        return self.name
class Image(models.Model):
    name = models.CharField(max_length = 200)
    image_path = models.CharField(max_length = 500)
    annotation_path = models.CharField(null = True, blank = True, max_length = 500)
    updated = models.DateTimeField(auto_now = True) # updated each time saved
    created = models.DateTimeField(auto_now_add = True)

    # Relationship Field
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE) # if Project deleted, image is deleted

    def __str__(self):
        return self.name

# class ProjectSettings(model.Models): # Store all settings for a project such as active learning type etc

# Relationship Tables

class AnnotatorProject(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.user_id.username + " annotating " + self.project_id.name

class AnnotatorTeam(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE)

    def __str__(self):
        return self.user_id.username + " part of " + self.team_id.name


class ManagerTeam(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE)

    def __str__(self):
        return self.user_id.username + " manages " + self.team_id.name
