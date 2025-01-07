
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone



    
class Idea(models.Model):
    title = models.CharField(max_length=200)
    patent_number = models.CharField(max_length=100, blank=True, null=True)
    brief_description = models.TextField()
    application_number = models.CharField(max_length=100, blank=True, null=True)
    problem_statement = models.TextField()
    solution = models.TextField()
    visibility = models.CharField(max_length=10, choices=[('public', 'Public'), ('private', 'Private')])
    details = models.TextField(blank=True, null=True)
    fund = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    category = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='idea_photos/', blank=True, null=True)
    video = models.FileField(upload_to='idea_videos/', blank=True, null=True)
    team_info = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Job(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.CharField(max_length=200)  # or TextField()
    salary = models.CharField(max_length=200, default="Not Specified") 
    posted_date = models.DateTimeField(default=timezone.now)
    # Add other fields as needed

    def __str__(self):
        return f"{self.title} at {self.company}"
    
class Project(models.Model):
    company = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    project_type = models.CharField(max_length=100)
    industry = models.CharField(max_length=100)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    timeline = models.DateField()
    location = models.CharField(max_length=200, blank=True, null=True)
    expertise_required = models.TextField()
    payment_terms = models.TextField()
    nda_required = models.BooleanField(default=False)
    confidentiality_required = models.BooleanField(default=False)
    ip_rights_required = models.BooleanField(default=False)
    custom_field = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title




