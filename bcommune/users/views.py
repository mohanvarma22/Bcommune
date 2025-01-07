from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.decorators import login_required
from .models import Idea, Job, Project, CustomUser
from users.forms import CompanySignupForm, IndividualSignupForm
from django.contrib.auth import logout
from django.http import JsonResponse

def logout_view(request):
    logout(request)
    return redirect('company_login')

def home(request):
    return render(request, 'home.html')

def individual_signup(request):
    if request.method == 'POST':
        form = IndividualSignupForm(request.POST)
        if form.is_valid():
            if form.cleaned_data['password'] != form.cleaned_data['confirm_password']:
                messages.error(request, "Passwords do not match.")
                return redirect('individual_signup')

            if CustomUser.objects.filter(email=form.cleaned_data['email']).exists():
                messages.error(request, "Email already exists.")
                return redirect('individual_signup')

            try:
                user = CustomUser.objects.create_user(
                    username=form.cleaned_data['email'],
                    email=form.cleaned_data['email'],
                    password=form.cleaned_data['password'],
                    first_name=form.cleaned_data['name'],
                    user_type='individual'
                )
                messages.success(request, "Account created successfully!")
                return redirect('individual_login')
            except Exception as e:
                messages.error(request, f"Error creating account: {str(e)}")
                return redirect('individual_signup')
    else:
        form = IndividualSignupForm()
    return render(request, 'individual_signup.html', {'form': form})

def individual_login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None and user.user_type == 'individual':
            login(request, user)
            return redirect('individual_dashboard')
        else:
            messages.error(request, "Invalid credentials or wrong user type.")
            return redirect('individual_login')
    
    return render(request, 'individual_login.html')

@login_required
def individual_dashboard(request):
    if request.user.user_type != 'individual':
        return redirect('individual_login')
    ideas = Idea.objects.all()  # Get all ideas submitted
    jobs = Job.objects.all().order_by('-posted_date')
    return render(request, 'individual_dashboard.html', {'ideas': ideas, 'jobs':jobs})

def company_signup(request):
    if request.method == 'POST':
        form = CompanySignupForm(request.POST)
        if form.is_valid():
            try:
                user = form.save()
                messages.success(request, "Company account created successfully!")
                return redirect('company_login')
            except Exception as e:
                messages.error(request, f"Error creating account: {str(e)}")
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = CompanySignupForm()
    return render(request, 'company_signup.html', {'form': form})

def company_login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None and user.user_type == 'company':
            login(request, user)
            return redirect('company_dashboard')
        else:
            messages.error(request, "Invalid credentials or wrong user type.")
    return render(request, 'company_login.html')


# View for Company Dashboard (requires login)
@login_required
def company_dashboard(request):
    # Here, you can fetch the company's data from the database
    # Example: company = request.user.companyprofile
    if request.user.user_type != 'company':
        return redirect('company_login')
    ideas = Idea.objects.all()  
    return render(request, 'company_dashboard.html',{'ideas':ideas})

def ideaform(request):
    return render(request, 'ideaform.html')

def submit_idea(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        patent_number = request.POST.get('patent_number')
        brief_description = request.POST.get('brief_description')
        application_number = request.POST.get('application_number')
        problem_statement = request.POST.get('problem_statement')
        solution = request.POST.get('solution')
        visibility = request.POST.get('visibility')
        details = request.POST.get('details')
        fund = request.POST.get('fund')
        category = request.POST.get('category')
        photo = request.FILES.get('photo')
        video = request.FILES.get('video')
        team_info = request.POST.get('team_info')

        # Save to database
        idea = Idea(
            title=title,
            patent_number=patent_number,
            brief_description=brief_description,
            application_number=application_number,
            problem_statement=problem_statement,
            solution=solution,
            visibility=visibility,
            details=details,
            fund=fund,
            category=category,
            photo=photo,
            video=video,
            team_info=team_info
        )
        idea.save()

        return JsonResponse({'message': 'Idea submitted successfully!'})

    return JsonResponse({'error': 'Invalid request method!'}, status=400)


def ideas_and_invest(request):
    return render(request, 'ideasandinvest.html')


def myjobs(request):
    # Add any logic to fetch jobs from database if needed
    return render(request, 'myjobs.html')

def post_job(request):
    if request.method == 'POST':
        try:
            # Create new job from form data
            job = Job.objects.create(
                title=request.POST.get('job_title'),
                company=request.POST.get('company_name'),
                location=request.POST.get('job_location'),
                description=request.POST.get('job_description'),
                requirements=request.POST.get('job_type'),  # Added job type
                salary=request.POST.get('salary'),
            )
            return JsonResponse({'status': 'success', 'message': 'Job posted successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return render(request, 'create_job.html')

@login_required
def myprojects(request):
    # Check if the user is a company user
    other_company_projects = Project.objects.exclude(company=request.user).order_by('-created_at')
    
    # Get projects posted by the current company (for portfolio section)
    my_projects = Project.objects.filter(company=request.user).order_by('-created_at')
    
    context = {
        'projects': other_company_projects,
        'my_projects': my_projects
    }
    return render(request, 'myprojects.html', context)
@login_required
def post_project(request):
    if request.method == 'POST':
        # Create new project from form data
        project = Project(
            company=request.user,
            title=request.POST['title'],
            description=request.POST['description'],
            project_type=request.POST['type'],
            industry=request.POST['industry'],
            budget=request.POST['budget'],
            timeline=request.POST['timeline'],
            location=request.POST['location'],
            expertise_required=request.POST['expertise'],
            payment_terms=request.POST['payment-terms'],
        )
        project.save()
        messages.success(request, 'Project posted successfully!')
        return redirect('myprojects')
    
    return render(request, 'myprojectform.html')
    
    
def myprojectform(request):
    return render(request, 'myprojectform.html') 

@login_required
def delete_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id, company=request.user)
        project.delete()
        messages.success(request, 'Project deleted successfully!')
    except Project.DoesNotExist:
        messages.error(request, 'Project not found or you do not have permission to delete it.')
    return redirect('myprojects')

