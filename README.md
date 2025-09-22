<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Bcommune - The Future of Networking

A modern React application built with TypeScript, Vite, and Google Gemini AI integration.

View your app in AI Studio: https://ai.studio/apps/drive/1nPT2dwT34imQXlPTyYV_Ybeg36TmHZpt

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)
- Google Gemini API Key

## 📋 Local Development Setup

### Method 1: Traditional Setup

1. **Clone and navigate to the project:**
   ```bash
   cd bcommune
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

### Method 2: Docker Development

1. **Build and run with Docker Compose:**
   ```bash
   # Development mode
   docker-compose --profile dev up --build
   
   # Or run in background
   docker-compose --profile dev up --build -d
   ```

2. **Access the application:**
   Navigate to `http://localhost:3000`

## 🐳 Docker Deployment

### Production Build

1. **Build the Docker image:**
   ```bash
   docker build -t bcommune:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -p 80:80 bcommune:latest
   ```

3. **Access the application:**
   Navigate to `http://localhost`

### Using Docker Compose

```bash
# Production mode
docker-compose --profile prod up --build

# Production with environment variables
docker-compose --profile prod-env up --build
```

## 🔄 CI/CD with GitHub Actions

This project includes a complete CI/CD pipeline that:

- **Tests:** Runs linting and tests on every PR
- **Builds:** Creates optimized Docker images
- **Security:** Scans for vulnerabilities
- **Deploys:** Automatically deploys to staging/production

### Setup GitHub Actions

1. **Add secrets to your GitHub repository:**
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `GITHUB_TOKEN`: Automatically provided by GitHub

2. **The pipeline will automatically:**
   - Run on every push to `main` and `develop` branches
   - Run on every pull request
   - Build and push Docker images to GitHub Container Registry
   - Deploy to staging (develop branch) and production (main branch)

### Manual Deployment

You can also manually trigger deployments by pushing to specific branches:
- `develop` → Deploys to staging
- `main` → Deploys to production

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📁 Project Structure

```
bcommune/
├── components/          # React components
│   ├── ai/             # AI-related components
│   ├── analytics/      # Analytics components
│   ├── common/         # Shared components
│   └── ...
├── views/              # Page components
├── services/           # API services
├── context/            # React context
├── types.ts            # TypeScript definitions
├── constants.ts        # Application constants
├── Dockerfile          # Production Docker image
├── Dockerfile.dev      # Development Docker image
├── docker-compose.yml  # Docker Compose configuration
└── .github/workflows/  # GitHub Actions workflows
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `VITE_APP_TITLE` | Application title | No |

## 🚀 Deployment Options

### Option 1: GitHub Container Registry
The CI/CD pipeline automatically builds and pushes images to GitHub Container Registry.

### Option 2: Docker Hub
Modify the workflow to push to Docker Hub instead.

### Option 3: Cloud Providers
Deploy to AWS ECS, Google Cloud Run, Azure Container Instances, etc.

## 🔒 Security Features

- Vulnerability scanning with Trivy
- Security headers in nginx configuration
- Environment variable protection
- Multi-stage Docker builds for smaller images

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
