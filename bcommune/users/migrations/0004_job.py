# Generated by Django 5.1.4 on 2025-01-04 10:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('company', models.CharField(max_length=200)),
                ('location', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('requirements', models.TextField()),
                ('posted_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
