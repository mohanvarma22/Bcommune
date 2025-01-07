from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class CompanySignupForm(UserCreationForm):
    INDUSTRY_CHOICES = [
        ('Agriculture', 'Agriculture'),
        ('Automotive', 'Automotive'),
        ('Banking', 'Banking'),
        ('Construction', 'Construction'),
        ('Consumer Goods', 'Consumer Goods'),
        ('Education', 'Education'),
        ('Energy', 'Energy'),
        ('Entertainment', 'Entertainment'),
        ('Finance', 'Finance'),
        ('Healthcare', 'Healthcare'),
        ('Hospitality', 'Hospitality'),
        ('Information Technology', 'Information Technology'),
        ('Insurance', 'Insurance'),
        ('Logistics', 'Logistics'),
        ('Manufacturing', 'Manufacturing'),
        ('Media', 'Media'),
        ('Pharmaceuticals', 'Pharmaceuticals'),
        ('Real Estate', 'Real Estate'),
        ('Retail', 'Retail'),
        ('Telecommunications', 'Telecommunications'),
        ('Transportation', 'Transportation'),
        ('Utilities', 'Utilities'),
        ('Other', 'Other'),
    ]

    COMPANY_SIZE_CHOICES = [
        ('1-10', '1-10'),
        ('11-50', '11-50'),
        ('51-200', '51-200'),
        ('201-500', '201-500'),
        ('501-1000', '501-1000'),
        ('1000+', '1000+'),
    ]

    company_name = forms.CharField(max_length=255, widget=forms.TextInput(attrs={'class': 'form-control'}))
    company_website = forms.URLField(max_length=200, widget=forms.URLInput(attrs={'class': 'form-control'}))
    industry = forms.ChoiceField(choices=INDUSTRY_CHOICES, widget=forms.Select(attrs={'class': 'form-control'}))
    company_size = forms.ChoiceField(choices=COMPANY_SIZE_CHOICES, widget=forms.Select(attrs={'class': 'form-control'}))
    company_type = forms.CharField(max_length=255, widget=forms.TextInput(attrs={'class': 'form-control'}))
    person_name = forms.CharField(max_length=255, widget=forms.TextInput(attrs={'class': 'form-control'}))
    designation = forms.CharField(max_length=255, widget=forms.TextInput(attrs={'class': 'form-control'}))
    company_mail = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}))
    phone_number = forms.CharField(max_length=15, widget=forms.TextInput(attrs={'class': 'form-control', 'pattern': '[0-9]{10}'}))
    bcommune_profile = forms.URLField(widget=forms.URLInput(attrs={'class': 'form-control'}))
    is_company = forms.BooleanField(initial=True, widget=forms.HiddenInput())
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2', 'company_name', 'company_website', 'industry', 
                 'company_size', 'company_type', 'person_name', 'designation', 'company_mail', 
                 'phone_number', 'bcommune_profile']
        
    def save(self, commit=True):
        user = super().save(commit=False)
        user.username = self.cleaned_data['company_mail']  # Set username as company_mail
        user.is_company = self.cleaned_data['is_company']
        if commit:
            user.save()
        return user
    
