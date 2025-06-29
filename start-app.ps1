# Online Banking System - Startup Script
# This script starts both the backend API and frontend React application

Write-Host "🚀 Starting Online Banking System..." -ForegroundColor Green
Write-Host ""

# Get the current directory
$projectRoot = Get-Location
$backendPath = Join-Path $projectRoot "backend\OnlineBanking.API"
$frontendPath = Join-Path $projectRoot "frontend"

# Check if directories exist
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend directory not found: $backendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Frontend directory not found: $frontendPath" -ForegroundColor Red
    exit 1
}

# Function to start backend
function Start-Backend {
    Write-Host "🔧 Starting Backend API..." -ForegroundColor Yellow
    Set-Location $backendPath
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run" -WindowStyle Normal
    Start-Sleep -Seconds 3
    Write-Host "✅ Backend API started on http://localhost:5000" -ForegroundColor Green
    Write-Host "📚 Swagger UI: http://localhost:5000/swagger" -ForegroundColor Cyan
}

# Function to start frontend
function Start-Frontend {
    Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
    Set-Location $frontendPath
    
    # Check if node_modules exists, if not install dependencies
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal
    Start-Sleep -Seconds 5
    Write-Host "✅ Frontend started on http://localhost:3000" -ForegroundColor Green
}

# Function to check if ports are available
function Test-Port {
    param($port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if ports are already in use
Write-Host "🔍 Checking port availability..." -ForegroundColor Yellow

if (Test-Port 5000) {
    Write-Host "⚠️  Port 5000 is already in use. Backend might already be running." -ForegroundColor Yellow
}

if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use. Frontend might already be running." -ForegroundColor Yellow
}

Write-Host ""

# Start both services
try {
    Start-Backend
    Start-Sleep -Seconds 2
    Start-Frontend
    
    Write-Host ""
    Write-Host "🎉 Online Banking System is starting up!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "📚 API Documentation: http://localhost:5000/swagger" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⏳ Please wait a few moments for both services to fully start..." -ForegroundColor Yellow
    Write-Host "🛑 To stop all services, close the PowerShell windows that opened." -ForegroundColor Red
    
} catch {
    Write-Host "❌ Error starting services: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Keep the main window open
Write-Host ""
Write-Host "Press any key to exit this script (services will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 