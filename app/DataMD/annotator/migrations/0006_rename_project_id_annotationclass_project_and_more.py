# Generated by Django 4.0.2 on 2022-03-10 17:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('annotator', '0005_alter_project_annotator_id_alter_project_manager_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='annotationclass',
            old_name='project_id',
            new_name='project',
        ),
        migrations.RenameField(
            model_name='image',
            old_name='project_id',
            new_name='project',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='annotator_id',
            new_name='annotators',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='manager_id',
            new_name='manager',
        ),
        migrations.RenameField(
            model_name='projectinvite',
            old_name='project_id',
            new_name='project',
        ),
        migrations.RenameField(
            model_name='projectinvite',
            old_name='recipient_annotator_id',
            new_name='recipient_annotator',
        ),
    ]