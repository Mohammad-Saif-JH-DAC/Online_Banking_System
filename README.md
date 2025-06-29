# Online Banking System

A comprehensive online banking system built with .NET Core Web API, React frontend, and MySQL database.

## 🏗️ Project Structure

```
Online Banking 2/
├── backend/                 # .NET Core Web API
│   ├── OnlineBanking.API/   # Web API project
│   ├── OnlineBanking.Core/  # Domain models and interfaces
│   ├── OnlineBanking.Infrastructure/ # Data access and external services
│   └── OnlineBanking.Application/ # Business logic and services
├── frontend/                # React TypeScript application
│   ├── src/
│   ├── public/
│   └── package.json
├── database/                # Database scripts and migrations
└── docs/                    # Documentation
```

## 🚀 Features

### Core Functionalities
- ✅ User Authentication (Register/Login)
- ✅ Role-based Access (Admin/Customer)
- ✅ Account Dashboard
- ✅ Deposit/Withdraw Operations
- ✅ Money Transfer
- ✅ Transaction History
- ✅ Account Management

### Admin Features
- ✅ User Management
- ✅ Account Overview
- ✅ Transaction Monitoring
- ✅ Account Blocking/Unblocking

## 🛠️ Technology Stack

### Backend
- **Framework**: .NET Core 8.0
- **Database**: MySQL 8.0
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Validation**: FluentValidation
- **AutoMapper**: Object Mapping

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **Routing**: React Router
- **Form Handling**: React Hook Form

## 📋 Prerequisites

- .NET Core 8.0 SDK
- Node.js 18+ and npm
- MySQL 8.0
- Visual Studio 2022 or VS Code

## 🚀 Quick Start

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE online_banking;
```

### 2. Backend Setup
```bash
cd backend/OnlineBanking.API
dotnet restore
dotnet ef database update
dotnet run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔐 Default Admin Account
- **Email**: admin@bank.com
- **Password**: Admin123!

## 📝 API Documentation
The API documentation is available at `/swagger` when running the backend.

## 🧪 Testing
```bash
# Backend Tests
cd backend
dotnet test

# Frontend Tests
cd frontend
npm test
```

## 📦 Deployment
Detailed deployment instructions are available in the `docs/` folder.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is licensed under the MIT License. 