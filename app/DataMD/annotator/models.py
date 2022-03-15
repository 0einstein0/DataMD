import os
from django.db import models
from django.contrib.auth.models import User
from pathlib import Path

# Create your models here.

class AnnotationType(models.Model):
    # Choices
    CLASSIFICATION = 'CF'
    BOUNDING_BOX = 'BB'
    LINE = "LN"
    KEYPOINT = "KP"

    choices = [
        (CLASSIFICATION, "Image Classification"),
        (BOUNDING_BOX, "Bounding Box"),
        (LINE, "Line"),
        (KEYPOINT, "Key Point")
    ]

    # Fields
    name = models.CharField(max_length=200, choices=choices, default=CLASSIFICATION)

    def __str__(self):
        for type in self.choices:
            if type[0] == self.name:
                return type[1]


class Project(models.Model):
    def annotation_path(instance, filename):
        return os.path.join(
        'annotations',
        str(instance.project.id),
        filename
    )
    
    name = models.CharField(max_length = 200)
    description = models.TextField(blank=True)
    annotation = models.FileField(null=True, blank=True, upload_to=annotation_path)
    createdAt = models.DateTimeField(auto_now_add = True)
    config = models.TextField(blank=True) # might switch to JSONField() if deemeded preferable

    # Relationship Fields
    annotation_type = models.ForeignKey(AnnotationType, null=True, on_delete=models.PROTECT) # dont delete type if project exists of said type
    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name="manager", limit_choices_to={'groups__name': 'manager_user_group'})
    annotators = models.ManyToManyField(User, blank=True, related_name="annotators", limit_choices_to={'groups__name': 'annotator_user_group'})
    
    def __str__(self):
        return self.name

class AnnotationClass(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField(blank=True)

    # Relationship Field
    project = models.ForeignKey(Project, on_delete=models.CASCADE) # if Project deleted, class is deleted

    def __str__(self):
        return self.name + " <-- " + self.project.name


class Image(models.Model):
    def image_path(instance, filename):
        return os.path.join(
        'images',
        str(instance.project.id),
        filename
    )

    name = models.CharField(max_length = 200)
    image = models.ImageField(null=True, blank=True, upload_to=image_path)
    # isAnnotated = models.BooleanField(default=False) # probably not needed as one can tell annotation through whether annotation_class is blank or not
    createdAt = models.DateTimeField(auto_now_add = True) 

    # Relationship Field
    project = models.ForeignKey(Project, on_delete=models.CASCADE) # if Project deleted, image is deleted
    annotation_class = models.ForeignKey(AnnotationClass, null=True, blank=True, on_delete=models.SET_NULL) 
    # BUSINESS RULE: annotation class chosen must have the same project as the current Image Instance

    def __str__(self):
        return self.name + " <-- " + self.project.name


class ProjectInvite(models.Model):
    # Choices
    PENDING = 'Pending'
    ACCEPTED = 'Accepted'
    REJECTED = 'Rejected'

    choices = [
        (PENDING, "Pending"),
        (ACCEPTED, "Accepted"),
        (REJECTED, "Rejected")
    ]

    status = models.CharField(max_length=200, choices=choices, default=PENDING)
    project = models.ForeignKey(Project, on_delete=models.CASCADE) # if Project deleted, invite is deleted
    recipient_annotator = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'groups__name': 'annotator_user_group'})

    def __str__(self):
        return self.recipient_annotator.username + " <-- " + self.project.name + " :: " + self.status

    class Meta:
        unique_together = ('project', 'recipient_annotator')


########################################################################################
# updated = models.DateTimeField(auto_now = True) # updated each time saved
# annotation_path = models.CharField(null = True, blank = True, max_length = 500)
