from django.contrib import admin

# Register your models here.
from .models import *

class AddIDAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

admin.site.register(AnnotationType)
admin.site.register(Project)
admin.site.register(Image, AddIDAdmin)
admin.site.register(AnnotationClass, AddIDAdmin)
admin.site.register(ProjectInvite)


