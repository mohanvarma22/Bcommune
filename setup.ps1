# Bcommune Setup Script for Windows
Write-Host "🚀 Setting up Bcommune application..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Create .env.local if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ .env.local created! Please edit it and add your GEMINI_API_KEY" -ForegroundColor Green
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup complete! Next steps:" -ForegroundColor Green
Write-Host "1. Edit .env.local and add your GEMINI_API_KEY" -ForegroundColor Cyan
Write-Host "2. Run: npm run dev" -ForegroundColor Cyan
Write-Host "3. Open http://localhost:5173 in your browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "🐳 For Docker setup, run:" -ForegroundColor Yellow
Write-Host "   docker-compose --profile dev up --build" -ForegroundColor Cyan
