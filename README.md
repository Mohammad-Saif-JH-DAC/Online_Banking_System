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
- ✅ **Registration Email Notifications** - Welcome emails sent automatically
- ✅ **Security Measures Carousel** - Interactive security tips for customers
- ✅ **Future Endeavours Page** - Roadmap of upcoming features

### Admin Features
- ✅ User Management
- ✅ Account Overview
- ✅ Transaction Monitoring
- ✅ Account Blocking/Unblocking

### User Experience
- ✅ **Always-Accessible Navigation** - About and FutureEndeavour pages available to all users
- ✅ **Modern UI/UX** - Material-UI components with custom styling
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Real-time Notifications** - Customer notifications for transfers and alerts

## 🛠️ Technology Stack

### Backend
- **Framework**: .NET Core 8.0
- **Database**: MySQL 8.0
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Validation**: FluentValidation
- **AutoMapper**: Object Mapping
- **Email Service**: SMTP (Gmail/Outlook support)

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Styling**: Custom CSS with Material-UI theming

## 📋 Prerequisites

- .NET Core 8.0 SDK
- Node.js 18+ and npm
- MySQL 8.0
- Visual Studio 2022 or VS Code
- SMTP email service (Gmail, Outlook, etc.) for registration emails

## 🚀 Quick Start

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE online_banking;
```

### 2. Email Configuration
Update `backend/OnlineBanking.API/appsettings.json` with your SMTP settings:
```json
"Smtp": {
  "Host": "smtp.gmail.com",
  "Port": 587,
  "EnableSsl": true,
  "User": "your-email@gmail.com",
  "Password": "your-app-password"
}
```

### 3. Backend Setup
```bash
cd backend/OnlineBanking.API
dotnet restore
dotnet ef database update
dotnet run
```

### 4. Frontend Setup
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