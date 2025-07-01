Write-Host "========================================" -ForegroundColor Green
Write-Host "Online Banking System Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check if .NET 8 is installed
try {
    $dotnetVersion = dotnet --version
    Write-Host "✓ .NET SDK found: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: .NET 8 SDK is not installed!" -ForegroundColor Red
    Write-Host "Please install .NET 8 SDK from: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not installed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Database Setup" -ForegroundColor Yellow
Write-Host ""
Write-Host "Attempting to automatically create the database and import schema..." -ForegroundColor Cyan

$mysqlExe = "mysql"
try {
    & $mysqlExe -u root -pcdac -e "CREATE DATABASE IF NOT EXISTS online_banking;"
    Write-Host "[OK] Database 'online_banking' ensured." -ForegroundColor Green
    Get-Content "..\database\setup.sql" | & $mysqlExe -u root -pcdac online_banking
    Write-Host "[OK] Database schema and sample data imported from setup.sql." -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Could not create database or import schema. Please check MySQL installation and credentials." -ForegroundColor Red
}
Write-Host ""

Write-Host "Step 3: Backend Setup" -ForegroundColor Yellow
Write-Host ""

# Navigate to backend directory
Set-Location backend

Write-Host "Restoring NuGet packages..." -ForegroundColor White
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to restore packages!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Building solution..." -ForegroundColor White
dotnet build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Running database migrations..." -ForegroundColor White
Set-Location OnlineBanking.API
dotnet ef database update
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Database migration failed. This might be expected if database is already set up." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 4: Frontend Setup" -ForegroundColor Yellow
Write-Host ""

# Navigate to frontend directory
Set-Location ..\..\frontend

Write-Host "Installing npm packages..." -ForegroundColor White
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install npm packages!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor White
Write-Host ""
Write-Host "1. Start the backend (in one terminal):" -ForegroundColor Cyan
Write-Host "   cd backend\OnlineBanking.API" -ForegroundColor White
Write-Host "   dotnet run" -ForegroundColor White
Write-Host ""
Write-Host "2. Start the frontend (in another terminal):" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor White
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "- Backend API: https://localhost:7001" -ForegroundColor Green
Write-Host "- Swagger Docs: https://localhost:7001/swagger" -ForegroundColor Green
Write-Host ""
Write-Host "Default accounts:" -ForegroundColor White
Write-Host "- Admin: admin@bank.com / Admin123!" -ForegroundColor Yellow
Write-Host "- Customer: john.doe@example.com / Customer123!" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"