@echo off
title Online Banking System - Startup
color 0A

echo.
echo ========================================
echo    ONLINE BANKING SYSTEM STARTUP
echo ========================================
echo.

REM Check if backend directory exists
if not exist "backend\OnlineBanking.API" (
    echo ERROR: Backend directory not found!
    echo Please make sure you're in the correct project directory.
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "frontend" (
    echo ERROR: Frontend directory not found!
    echo Please make sure you're in the correct project directory.
    pause
    exit /b 1
)

echo [1/4] Checking prerequisites...
echo.

REM Check if .NET is installed
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: .NET Core is not installed or not in PATH!
    echo Please install .NET Core 8.0 from: https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/4] Starting Backend API...
echo.
echo Starting backend on http://localhost:5000
echo Swagger UI: http://localhost:5000/swagger
echo.

REM Start backend in a new window
start "Backend API" cmd /k "cd /d %~dp0backend\OnlineBanking.API && dotnet run"

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

echo [3/4] Starting Frontend...
echo.
echo Starting frontend on http://localhost:3000
echo.

REM Check if node_modules exists in frontend
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd /d "%~dp0frontend"
    npm install
    cd /d "%~dp0"
)

REM Start frontend in a new window
start "Frontend React" cmd /k "cd /d %~dp0frontend && npm start"

echo [4/4] Services are starting...
echo.
echo ========================================
echo           SERVICES STARTED
echo ========================================
echo.
echo Frontend:    http://localhost:3000
echo Backend API: http://localhost:5000
echo Swagger UI:  http://localhost:5000/swagger
echo.
echo Default Accounts:
echo - Admin:    admin@bank.com / Admin123!
echo - Customer: john.doe@example.com / Customer123!
echo.
echo ========================================
echo.
echo The application will open in your browser shortly.
echo To stop the services, close the command windows that opened.
echo.
pause 