# Generated by Django 4.0.2 on 2022-02-20 21:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('annotator', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectinvite',
            name='project_id',
            field=models.ForeignKey(default=1645390925.032339, on_delete=django.db.models.deletion.CASCADE, to='annotator.project'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='projectinvite',
            name='recipient_annotator_id',
            field=models.ForeignKey(default=1.0, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
