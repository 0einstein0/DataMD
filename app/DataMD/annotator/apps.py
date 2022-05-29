from django.apps import AppConfig


class AnnotatorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'annotator'

    def ready(self):
        from django.contrib.auth.models import Group

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

                


