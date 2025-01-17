# Generated by Django 5.1.4 on 2025-01-07 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='is_company',
        ),
        migrations.AddField(
            model_name='customuser',
            name='bcommune_profile',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='company_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='company_size',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='company_type',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='company_website',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='designation',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='industry',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='phone_number',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='user_type',
            field=models.CharField(choices=[('individual', 'Individual'), ('company', 'Company')], default='individual', max_length=10),
            preserve_default=False,
        ),
    ]
