from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(AnnotationType)
admin.site.register(Project)
admin.site.register(Image)
admin.site.register(AnnotationClass)
admin.site.register(ProjectInvite)


