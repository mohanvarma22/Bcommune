from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

from users.forms import CompanySignupForm
from django.contrib.auth import logout

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
    return render(request, 'individual_dashboard.html')

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
    return render(request, 'company_dashboard.html')