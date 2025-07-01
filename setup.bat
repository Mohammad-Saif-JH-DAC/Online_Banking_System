@echo off
echo ========================================
echo Online Banking System Setup
echo ========================================
echo.

echo Step 1: Checking prerequisites...
echo.

REM Check if .NET 8 is installed
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: .NET 8 SDK is not installed!
    echo Please install .NET 8 SDK from: https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)
echo ✓ .NET SDK found

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)
echo ✓ npm found

echo.
echo Step 2: Database Setup
echo.
echo IMPORTANT: Make sure MySQL is running and you have created the database!
echo.
echo To create the database, run these commands in MySQL:
echo 1. mysql -u root -p
echo 2. CREATE DATABASE online_banking;
echo 3. USE online_banking;
echo 4. Copy and paste the contents of database/setup.sql
echo.
echo Also, update the password in backend/OnlineBanking.API/appsettings.json
echo.
pause

echo.
echo Step 3: Backend Setup
echo.
cd backend
echo Restoring NuGet packages...
dotnet restore
if %errorlevel% neq 0 (
    echo ERROR: Failed to restore packages!
    pause
    exit /b 1
)

echo Building solution...
dotnet build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo Running database migrations...
cd OnlineBanking.API
dotnet ef database update
if %errorlevel% neq 0 (
    echo WARNING: Database migration failed. This might be expected if database is already set up.
)

echo.
echo Step 4: Frontend Setup
echo.
cd ..\..\frontend
echo Installing npm packages...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install npm packages!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start the backend (in one terminal):
echo    cd backend\OnlineBanking.API
echo    dotnet run
echo.
echo 2. Start the frontend (in another terminal):
echo    cd frontend
echo    npm start
echo.
echo The application will be available at:
echo - Frontend: http://localhost:3000
echo - Backend API: https://localhost:7001
echo - Swagger Docs: https://localhost:7001/swagger
echo.
echo Default accounts:
echo - Admin: admin@bank.com / Admin123!
echo - Customer: john.doe@example.com / Customer123!
echo.
pause