# Online Banking System - Quick Start Guide

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **.NET Core 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+ and npm** - [Download here](https://nodejs.org/)
- **MySQL 8.0** - [Download here](https://dev.mysql.com/downloads/mysql/)

## 📋 Quick Setup Steps

### 1. Database Setup

1. **Start MySQL** and ensure it's running
2. **Create the database**:
   ```sql
   mysql -u root -p
   CREATE DATABASE online_banking;
   USE online_banking;
   ```
3. **Run the setup script**:
   ```bash
   mysql -u root -p online_banking < database/setup.sql
   ```

### 2. Update Database Connection

1. Open `backend/OnlineBanking.API/appsettings.json`
2. Update the password in the connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=online_banking;User=root;Password=YOUR_MYSQL_PASSWORD;"
   }
   ```

### 3. Automated Setup (Recommended)

Run the setup script to automatically configure everything:

**Windows (Command Prompt):**
```bash
setup.bat
```

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

### 4. Manual Setup (Alternative)

If you prefer to set up manually:

#### Backend Setup:
```bash
cd backend
dotnet restore
dotnet build
cd OnlineBanking.API
dotnet ef database update
dotnet run
```

#### Frontend Setup:
```bash
cd frontend
npm install
npm start
```

## 🎯 Starting the Application

### Option 1: Automated Start
```bash
start-app.bat
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend/OnlineBanking.API
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## 🌐 Access Points

Once running, you can access:

- **Frontend Application**: http://localhost:3000
- **Backend API**: https://localhost:7001
- **API Documentation**: https://localhost:7001/swagger

## 👤 Default Accounts

The system comes with pre-configured accounts:

### Admin Account
- **Email**: admin@bank.com
- **Password**: Admin123!
- **Role**: Admin

### Customer Account
- **Email**: john.doe@example.com
- **Password**: Customer123!
- **Role**: Customer

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Ensure MySQL is running
   - Verify the password in `appsettings.json`
   - Check if database `online_banking` exists

2. **Port Already in Use**
   - Backend: Change port in `launchSettings.json`
   - Frontend: Use `npm start -- --port 3001`

3. **CORS Issues**
   - Ensure backend is running on https://localhost:7001
   - Check CORS configuration in `Program.cs`

4. **Build Errors**
   - Run `dotnet clean` and `dotnet restore`
   - Ensure .NET 8 SDK is installed

### Getting Help

If you encounter issues:
1. Check console output for error messages
2. Verify all prerequisites are installed
3. Ensure all services are running
4. Check browser developer console for frontend errors

## 📁 Project Structure

```
Online_Banking_System/
├── backend/                 # .NET Core Web API
│   ├── OnlineBanking.API/   # Web API project
│   ├── OnlineBanking.Core/  # Domain models
│   ├── OnlineBanking.Infrastructure/ # Data access
│   └── OnlineBanking.Application/ # Business logic
├── frontend/                # React application
├── database/                # Database scripts
└── docs/                    # Documentation
```

## 🎉 You're Ready!

Once everything is set up, you can:
- Register new accounts
- Perform banking operations (deposit, withdraw, transfer)
- View transaction history
- Manage accounts (Admin only)

Happy banking! 🏦