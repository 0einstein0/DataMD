from django.apps import AppConfig


class AnnotatorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'annotator'

    def ready(self):
        from django.contrib.auth.models import Group
        from .models import AnnotationType

        user_groups = [
            'manager_user_group',
            'annotator_user_group'
        ]

        for group_name in user_groups:
            if (not Group.objects.filter(name=group_name).exists()):
                Group.objects.create(
                    name = group_name
                )
                print(group_name, ' created.')
            else:
                print(group_name, ' exists.')
        
        annotation_types = [
            'CF',
            'BB'
        ]

        for type_name in annotation_types:
            if (not AnnotationType.objects.filter(name=type_name).exists()):
                AnnotationType.objects.create(
                    name = type_name
                )
                print(type_name, ' created.')
            else:
                print(type_name, ' exists.')
        








