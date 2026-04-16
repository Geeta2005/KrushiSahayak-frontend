# KrushiSahayak Deployment Script for Windows/PowerShell
# Usage: .\deploy.ps1 -Platform render|docker|local

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("render", "docker", "local", "build")]
    [string]$Platform
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "KrushiSahayak Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

switch ($Platform) {
    "render" {
        Write-Host "`nPreparing for Render deployment..." -ForegroundColor Yellow
        
        # Check if render.yaml exists
        if (Test-Path "render.yaml") {
            Write-Host "✓ render.yaml found" -ForegroundColor Green
        } else {
            Write-Host "✗ render.yaml not found" -ForegroundColor Red
            exit 1
        }
        
        # Verify backend .env.example exists
        if (Test-Path "backend/.env.example") {
            Write-Host "✓ backend/.env.example found" -ForegroundColor Green
            Write-Host "`n⚠ IMPORTANT: Set these environment variables in Render dashboard:" -ForegroundColor Yellow
            Write-Host "   - MONGODB_URI (your MongoDB Atlas connection string)" -ForegroundColor White
            Write-Host "   - JWT_SECRET (generate a strong secret)" -ForegroundColor White
            Write-Host "   - FRONTEND_URL (your frontend URL after deployment)" -ForegroundColor White
        }
        
        Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Push code to GitHub" -ForegroundColor White
        Write-Host "   2. Go to https://render.com and create a Blueprint" -ForegroundColor White
        Write-Host "   3. Connect your GitHub repository" -ForegroundColor White
        Write-Host "   4. Render will automatically detect render.yaml" -ForegroundColor White
        Write-Host "   5. Set the required environment variables in dashboard" -ForegroundColor White
    }
    
    "docker" {
        Write-Host "`nBuilding and running with Docker Compose..." -ForegroundColor Yellow
        
        # Check if Docker is installed
        $dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
        if (-not $dockerInstalled) {
            Write-Host "✗ Docker is not installed" -ForegroundColor Red
            Write-Host "   Install Docker from: https://docs.docker.com/get-docker/" -ForegroundColor White
            exit 1
        }
        
        # Check if .env file exists
        if (Test-Path ".env") {
            Write-Host "✓ .env file found" -ForegroundColor Green
        } else {
            Write-Host "⚠ .env file not found" -ForegroundColor Yellow
            Write-Host "   Creating from template..." -ForegroundColor White
            @"
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/KrushiSahayak
JWT_SECRET=change-this-to-a-super-secret-key-minimum-32-characters
FRONTEND_URL=http://localhost
"@ | Out-File -FilePath ".env" -Encoding utf8
            Write-Host "✓ Created .env file. Please update with your values!" -ForegroundColor Green
        }
        
        # Build and run
        Write-Host "`n🐳 Building Docker images..." -ForegroundColor Cyan
        docker-compose build --no-cache
        
        Write-Host "`n🚀 Starting containers..." -ForegroundColor Cyan
        docker-compose up -d
        
        Write-Host "`n✓ Deployment complete!" -ForegroundColor Green
        Write-Host "   Frontend: http://localhost" -ForegroundColor White
        Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
        Write-Host "   Health Check: http://localhost:5000/health" -ForegroundColor White
        Write-Host "`n📋 To stop: docker-compose down" -ForegroundColor Cyan
    }
    
    "local" {
        Write-Host "`nStarting local production build..." -ForegroundColor Yellow
        
        # Install dependencies
        Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Cyan
        Set-Location backend
        npm install
        
        Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Cyan
        Set-Location ..
        npm install
        
        # Build frontend
        Write-Host "`n🔨 Building frontend..." -ForegroundColor Cyan
        npm run build
        
        Write-Host "`n✓ Build complete!" -ForegroundColor Green
        Write-Host "`n📋 To start production server:" -ForegroundColor Cyan
        Write-Host "   1. cd backend" -ForegroundColor White
        Write-Host "   2. npm start" -ForegroundColor White
        Write-Host "   3. Serve the dist/ folder with nginx or any static server" -ForegroundColor White
    }
    
    "build" {
        Write-Host "`nBuilding frontend for deployment..." -ForegroundColor Yellow
        
        # Check if VITE_API_URL is set
        if ($env:VITE_API_URL) {
            Write-Host "✓ VITE_API_URL is set: $env:VITE_API_URL" -ForegroundColor Green
        } else {
            Write-Host "⚠ VITE_API_URL not set" -ForegroundColor Yellow
            Write-Host "   Using default proxy configuration from vite.config.ts" -ForegroundColor White
        }
        
        # Build
        npm install
        npm run build
        
        Write-Host "`n✓ Build complete! Files in dist/ folder" -ForegroundColor Green
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
