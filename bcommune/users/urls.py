from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('individual/login/', views.individual_login, name='individual_login'),
    path('individual/signup/', views.individual_signup, name='individual_signup'),
    path('individual/dashboard/', views.individual_dashboard, name='individual_dashboard'),
    path('company/login/', views.company_login, name='company_login'),
    path('company/signup/', views.company_signup, name='company_signup'),
    path('company/dashboard/', views.company_dashboard, name='company_dashboard'),
    path('logout/', views.logout_view, name='logout'),
]
