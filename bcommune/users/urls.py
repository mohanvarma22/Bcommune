from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
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
    path('ideaform/', views.ideaform, name='ideaform'),
    path('submit_idea/', views.submit_idea, name='submit_idea'),
    path('individual/dashboard/ideasandinvest/', views.ideas_and_invest, name='ideasandinvest'),
    path('company/dashboard/myjobs/', views.myjobs, name='myjobs'),
    path('company/dashboard/myjobs/post/', views.post_job, name='post_job'),
    path('company/dashboard/myprojects/', views.myprojects, name='myprojects'),
    path('company/dashboard/myprojects/post_project/', views.myprojectform, name='myprojectform'),
    path('company/dashboard/myjobs/post/create-job/', views.post_job, name='create_job'),
    path('company/dashboard/myprojects/post_project/submit/', views.post_project, name='post_project'),
    path('delete-project/<int:project_id>/', views.delete_project, name='delete_project'),
    path('company/dashboard/myprojects/edit/<int:project_id>/', views.edit_project, name='edit_project'),

]

if settings.DEBUG:

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)