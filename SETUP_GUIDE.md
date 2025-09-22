# 🚀 Complete Setup Guide for Bcommune

This guide will walk you through setting up the Bcommune application locally, containerizing it with Docker, and implementing CI/CD with GitHub Actions.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Docker** (optional) - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)
- **Google Gemini API Key** - [Get one here](https://makersuite.google.com/app/apikey)

## 🎯 Step-by-Step Setup

### Step 1: Local Development Setup

#### Option A: Quick Setup (Windows)
```powershell
# Run the setup script
.\setup.ps1
```

#### Option B: Quick Setup (Mac/Linux)
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

#### Option C: Manual Setup
```bash
# 1. Navigate to project directory
cd bcommune

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit .env.local and add your API key
# GEMINI_API_KEY=your_actual_api_key_here

# 5. Start development server
npm run dev
```

### Step 2: Verify Local Setup

1. **Open your browser** and navigate to `http://localhost:5173`
2. **Check the console** for any errors
3. **Test the application** functionality

### Step 3: Docker Setup

#### Development with Docker
```bash
# Build and run development container
docker-compose --profile dev up --build

# Access at http://localhost:3000
```

#### Production with Docker
```bash
# Build production image
docker build -t bcommune:latest .

# Run production container
docker run -p 80:80 bcommune:latest

# Access at http://localhost
```

#### Using Docker Compose for Production
```bash
# Production mode
docker-compose --profile prod up --build

# Production with environment variables
docker-compose --profile prod-env up --build
```

### Step 4: GitHub Actions CI/CD Setup

#### 4.1: Create GitHub Repository
1. **Create a new repository** on GitHub
2. **Push your code** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with Docker and CI/CD setup"
   git branch -M main
   git remote add origin https://github.com/yourusername/bcommune.git
   git push -u origin main
   ```

#### 4.2: Configure GitHub Secrets
1. **Go to your repository** → Settings → Secrets and variables → Actions
2. **Add the following secrets:**
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `GITHUB_TOKEN`: Automatically provided by GitHub

#### 4.3: Set Up Branch Protection (Optional)
1. **Go to Settings** → Branches
2. **Add rule** for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date

#### 4.4: Test the CI/CD Pipeline
1. **Create a feature branch:**
   ```bash
   git checkout -b feature/test-ci
   git push origin feature/test-ci
   ```

2. **Create a pull request** to `main` branch
3. **Check the Actions tab** to see the pipeline running
4. **Merge the PR** to trigger deployment

## 🔧 Available Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Docker
```bash
# Development
docker-compose --profile dev up --build

# Production
docker-compose --profile prod up --build

# Build only
docker build -t bcommune:latest .
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push and create PR
git push origin feature/your-feature-name
```

## 🚀 Deployment Options

### Option 1: GitHub Container Registry (Recommended)
- **Automatic**: Images are built and pushed automatically
- **Access**: `ghcr.io/yourusername/bcommune:latest`
- **Cost**: Free for public repositories

### Option 2: Docker Hub
Modify `.github/workflows/ci-cd.yml`:
```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

### Option 3: Cloud Deployment
Deploy to:
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Heroku Container Registry**

## 🔒 Security Features

- ✅ **Vulnerability scanning** with Trivy
- ✅ **Security headers** in nginx
- ✅ **Environment variable protection**
- ✅ **Multi-stage Docker builds**
- ✅ **Dependency scanning**

## 📊 Monitoring & Logs

### GitHub Actions
- **View logs**: Repository → Actions tab
- **Debug failures**: Click on failed job → View logs

### Docker Logs
```bash
# View container logs
docker logs <container_id>

# Follow logs in real-time
docker logs -f <container_id>
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. PowerShell Execution Policy (Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. Port Already in Use
```bash
# Find process using port 5173
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

#### 3. Docker Build Fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t bcommune:latest .
```

#### 4. Environment Variables Not Working
- Ensure `.env.local` exists and has correct format
- Restart development server after changes
- Check variable names match exactly

## 📞 Support

If you encounter issues:

1. **Check the logs** in GitHub Actions
2. **Verify environment variables** are set correctly
3. **Ensure all prerequisites** are installed
4. **Check Docker** is running (if using Docker)
5. **Review the README.md** for additional information

## 🎉 Success!

Once everything is set up, you should have:

- ✅ **Local development** environment running
- ✅ **Docker containers** for development and production
- ✅ **CI/CD pipeline** with GitHub Actions
- ✅ **Automated testing** and deployment
- ✅ **Security scanning** and monitoring

Your Bcommune application is now ready for development and deployment! 🚀
