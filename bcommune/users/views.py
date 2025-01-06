from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .models import Idea, Job
from users.forms import CompanySignupForm
from django.contrib.auth import logout
from django.http import JsonResponse

def logout_view(request):
    logout(request)
    return redirect('company_login')

def home(request):
    return render(request, 'home.html')

def individual_login(request):
    if request.method == 'POST':
        username = request.POST['email']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('individual_dashboard')
        else:
            messages.error(request, "Invalid email or password.")
            return redirect('individual_login')

    return render(request, 'individual_login.html')

def individual_signup(request):
    if request.method == 'POST':
        username = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']

        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return redirect('individual_signup')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Email already exists.")
            return redirect('individual_signup')

        # Create a new user
        User.objects.create_user(username=username, password=password)
        messages.success(request, "Account created successfully!")
        return redirect('individual_login')

    return render(request, 'individual_signup.html')

@login_required
def individual_dashboard(request):
    ideas = Idea.objects.all()  # Get all ideas submitted
    jobs = Job.objects.all().order_by('-posted_date')
    return render(request, 'individual_dashboard.html', {'ideas': ideas, 'jobs':jobs})

def company_login(request):
    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        
        # Authenticate the user
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)  # Login the user
            return redirect('company_dashboard')  # Redirect to dashboard on success
        else:
            return render(request, 'company_login.html', {'error': 'Invalid login credentials'})
    
    return render(request, 'company_login.html')

# View for Company Signup
def company_signup(request):
    if request.method == "POST":
        form = CompanySignupForm(request.POST)
        if form.is_valid():
            form.save()  # Save the new company user
            return redirect('company_login')  # Redirect to login after signup
    else:
        form = CompanySignupForm()

    return render(request, 'company_signup.html', {'form': form})

# View for Company Dashboard (requires login)
@login_required
def company_dashboard(request):
    # Here, you can fetch the company's data from the database
    # Example: company = request.user.companyprofile
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