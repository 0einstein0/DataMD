# Generated by Django 4.0.2 on 2022-03-10 12:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('annotator', '0004_remove_project_annotation_file_path_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='annotator_id',
            field=models.ManyToManyField(blank=True, limit_choices_to={'groups__name': 'annotator_user_group'}, related_name='annotators', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='project',
            name='manager_id',
            field=models.ForeignKey(limit_choices_to={'groups__name': 'manager_user_group'}, on_delete=django.db.models.deletion.CASCADE, related_name='manager', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='projectinvite',
            name='recipient_annotator_id',
            field=models.ForeignKey(limit_choices_to={'groups__name': 'annotator_user_group'}, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
