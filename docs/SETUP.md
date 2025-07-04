# Online Banking System - Setup Guide

This guide will help you set up and run the Online Banking System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **.NET Core 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+ and npm** - [Download here](https://nodejs.org/)
- **MySQL 8.0** - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Visual Studio 2022** or **VS Code** - [Download here](https://visualstudio.microsoft.com/)
- **SMTP Email Service** - Gmail, Outlook, or any SMTP provider for registration emails

## Database Setup

### 1. Install MySQL
1. Download and install MySQL 8.0
2. During installation, set a root password (remember this for later)
3. Ensure MySQL service is running

### 2. Create Database
1. Open MySQL Command Line Client or MySQL Workbench
2. Run the database setup script:
   ```bash
   mysql -u root -p < database/setup.sql
   ```
   Or copy and paste the contents of `database/setup.sql` into your MySQL client.

### 3. Update Connection String
1. Open `backend/OnlineBanking.API/appsettings.json`
2. Update the connection string with your MySQL credentials:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=online_banking;User=root;Password=YOUR_PASSWORD;"
   }
   ```

## Email Service Configuration

### 1. Configure SMTP Settings
1. Open `backend/OnlineBanking.API/appsettings.json`
2. Update the SMTP section with your email credentials:
   ```json
   "Smtp": {
     "Host": "smtp.gmail.com",
     "Port": 587,
     "EnableSsl": true,
     "User": "your-email@gmail.com",
     "Password": "your-app-password"
   }
   ```

### 2. Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → App Passwords
   - Select "Mail" and your device
   - Use the generated password in the SMTP configuration
3. Use your full Gmail address as the "User" field

### 3. Alternative Email Providers
- **Outlook/Hotmail**: Use `smtp-mail.outlook.com` with port 587
- **Yahoo**: Use `smtp.mail.yahoo.com` with port 587
- **Custom SMTP**: Use your provider's SMTP settings

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Restore Dependencies
```bash
dotnet restore
```

### 3. Build the Solution
```bash
dotnet build
```

### 4. Run Database Migrations
```bash
cd OnlineBanking.API
dotnet ef database update
```

### 5. Start the API
```bash
dotnet run
```

The API will be available at:
- **API**: https://localhost:7001
- **Swagger Documentation**: https://localhost:7001/swagger

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
```

The React application will be available at:
- **Frontend**: http://localhost:3000

## Default Accounts

The system comes with pre-configured accounts for testing:

### Admin Account
- **Email**: admin@bank.com
- **Password**: Admin123!
- **Role**: Admin

### Sample Customer Account
- **Email**: john.doe@example.com
- **Password**: Customer123!
- **Role**: Customer

## Testing the Application

### 1. Access the Application
1. Open your browser and go to http://localhost:3000
2. You'll be redirected to the login page

### 2. Login
1. Use one of the default accounts above
2. Click "Sign In"
3. You'll be redirected to the dashboard

### 3. Test Banking Operations
1. **View Account Summary**: See your account balance and recent transactions
2. **Deposit Money**: Click "Deposit" and enter an amount
3. **Withdraw Money**: Click "Withdraw" and enter an amount (ensure sufficient balance)
4. **Transfer Money**: Click "Transfer" and enter recipient account number and amount

### 4. Test New Features
1. **Registration Email**: Register a new user and check the email inbox
2. **Security Carousel**: View the auto-advancing security tips in the customer dashboard
3. **Future Endeavours**: Click "FutureEndeavour" in the navigation to see upcoming features
4. **Always-Accessible Pages**: Test "About" and "FutureEndeavour" pages without logging in

### 5. API Testing
1. Go to https://localhost:7001/swagger
2. Use the interactive API documentation to test endpoints
3. Use the "Authorize" button to add your JWT token

## Project Structure

```
Online Banking 2/
├── backend/                          # .NET Core Backend
│   ├── OnlineBanking.API/           # Web API Project
│   ├── OnlineBanking.Core/          # Domain Models & Interfaces
│   ├── OnlineBanking.Infrastructure/ # Data Access Layer
│   ├── OnlineBanking.Application/   # Business Logic Layer
│   │   └── Services/
│   │       ├── AuthService.cs       # Authentication & Registration
│   │       ├── EmailService.cs      # Email sending functionality
│   │       └── BankingService.cs    # Banking operations
│   └── OnlineBanking.sln            # Solution File
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable Components
│   │   ├── pages/                   # Page Components
│   │   │   ├── FutureEndeavour.js   # Future features roadmap
│   │   │   ├── CustomerDashboard.js # Customer dashboard with carousel
│   │   │   └── Navigation.js        # Updated navigation
│   │   ├── contexts/                # React Contexts
│   │   └── App.js                   # Main App Component
│   └── package.json
├── database/                         # Database Scripts
│   └── setup.sql                    # Database Setup Script
└── docs/                            # Documentation
    └── SETUP.md                     # This File
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
- Ensure MySQL is running
- Verify connection string in `appsettings.json`
- Check if database `online_banking` exists

#### 2. Email Service Issues
- Verify SMTP credentials in `appsettings.json`
- For Gmail: Use App Password, not regular password
- Check if your email provider allows SMTP access
- Ensure port 587 is not blocked by firewall

#### 3. Port Already in Use
- Backend: Change port in `launchSettings.json`
- Frontend: Use `npm start -- --port 3001`

#### 4. CORS Issues
- Ensure backend is running on https://localhost:7001
- Check CORS configuration in `Program.cs`

#### 5. JWT Token Issues
- Verify JWT configuration in `appsettings.json`
- Ensure token is being sent in Authorization header

#### 6. User Deletion Error
If you encounter foreign key constraint errors when deleting users:
```sql
ALTER TABLE auditlogs MODIFY COLUMN TargetUserId INT NULL;
```

### Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Verify all prerequisites are installed correctly
3. Ensure all services are running
4. Check the browser's developer console for frontend errors
5. Verify email configuration if registration emails are not being sent

## Development

### Adding New Features

1. **Backend**: Add new entities in `Core`, repositories in `Infrastructure`, services in `Application`, and controllers in `API`
2. **Frontend**: Add new components in `src/components` and pages in `src/pages`

### Database Changes

1. Modify entities in `Core/Entities`
2. Update `ApplicationDbContext` in `Infrastructure/Data`
3. Create and run migrations:
   ```bash
   dotnet ef migrations add MigrationName
   dotnet ef database update
   ```

### Email Service Customization

1. Modify `EmailService.cs` to change email templates
2. Update SMTP settings in `appsettings.json`
3. Test email sending with registration

## Security Notes

- Change default passwords in production
- Use strong JWT keys
- Enable HTTPS in production
- Use App Passwords for email services
- Regularly update dependencies

## Production Deployment

For production deployment:

1. Use a production database (not local MySQL)
2. Configure proper CORS policies
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Set up proper logging and monitoring
6. Configure backup strategies
7. Implement proper security measures 