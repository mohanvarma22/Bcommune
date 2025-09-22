#!/bin/bash

# Bcommune Setup Script for Unix-like systems
echo "🚀 Setting up Bcommune application..."

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
else
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm version: $NPM_VERSION"
else
    echo "❌ npm is not available"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created! Please edit it and add your GEMINI_API_KEY"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Edit .env.local and add your GEMINI_API_KEY"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "🐳 For Docker setup, run:"
echo "   docker-compose --profile dev up --build"
