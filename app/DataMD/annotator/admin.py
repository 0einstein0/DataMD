from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Team)
admin.site.register(Project)
admin.site.register(Image)
admin.site.register(AnnotatorProject)
admin.site.register(AnnotatorTeam)
admin.site.register(ManagerTeam)
