-- Online Banking System Database Setup
-- MySQL 8.0

-- Create database
CREATE DATABASE IF NOT EXISTS online_banking;
USE online_banking;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL DEFAULT 'Customer',
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    LastLoginAt DATETIME NULL
);

-- Accounts table
CREATE TABLE IF NOT EXISTS Accounts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    AccountNumber VARCHAR(20) NOT NULL UNIQUE,
    Balance DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    LastTransactionAt DATETIME NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS Transactions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FromAccountId INT NULL,
    ToAccountId INT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Type VARCHAR(20) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Completed',
    Description TEXT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FromAccountId) REFERENCES Accounts(Id) ON DELETE RESTRICT,
    FOREIGN KEY (ToAccountId) REFERENCES Accounts(Id) ON DELETE RESTRICT
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON Users(Email);
CREATE INDEX idx_accounts_userid ON Accounts(UserId);
CREATE INDEX idx_accounts_accountnumber ON Accounts(AccountNumber);
CREATE INDEX idx_transactions_fromaccount ON Transactions(FromAccountId);
CREATE INDEX idx_transactions_toaccount ON Transactions(ToAccountId);
CREATE INDEX idx_transactions_createdat ON Transactions(CreatedAt);

-- Insert default admin user (password: Admin123!)
INSERT INTO Users (Id, FullName, Email, PasswordHash, Role, IsActive, CreatedAt) VALUES 
(1, 'Admin User', 'admin@bank.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', TRUE, NOW())
ON DUPLICATE KEY UPDATE Id = Id;

-- Insert default admin account
INSERT INTO Accounts (Id, UserId, AccountNumber, Balance, IsActive, CreatedAt) VALUES 
(1, 1, '1000000001', 10000.00, TRUE, NOW())
ON DUPLICATE KEY UPDATE Id = Id;

-- Create a sample customer user (password: Customer123!)
INSERT INTO Users (FullName, Email, PasswordHash, Role, IsActive, CreatedAt) VALUES 
('John Doe', 'john.doe@example.com', '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer', TRUE, NOW());

-- Create a sample customer account
INSERT INTO Accounts (UserId, AccountNumber, Balance, IsActive, CreatedAt) VALUES 
(2, '1000000002', 5000.00, TRUE, NOW());

-- Insert sample transactions
INSERT INTO Transactions (FromAccountId, ToAccountId, Amount, Type, Status, Description, CreatedAt) VALUES 
(NULL, 1, 10000.00, 'Deposit', 'Completed', 'Initial deposit', NOW()),
(NULL, 2, 5000.00, 'Deposit', 'Completed', 'Initial deposit', NOW()),
(1, 2, 1000.00, 'Transfer', 'Completed', 'Sample transfer', NOW());

-- Update account balances to reflect transactions
UPDATE Accounts SET Balance = 9000.00, LastTransactionAt = NOW() WHERE Id = 1;
UPDATE Accounts SET Balance = 6000.00, LastTransactionAt = NOW() WHERE Id = 2; 


CREATE TABLE `beneficiaries` (
  `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `UserId` INT NOT NULL,
  `Name` VARCHAR(255) NOT NULL,
  `AccountNumber` VARCHAR(255) NOT NULL,
  `CreatedAt` DATETIME NOT NULL,
  FOREIGN KEY (`UserId`) REFERENCES `users`(`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Contacts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Subject VARCHAR(255) NOT NULL,
    Message TEXT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS AuditLogs (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    AdminUserId INT NOT NULL,
    Action VARCHAR(100) NOT NULL,
    TargetUserId INT,
    Timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Details TEXT,
    FOREIGN KEY (AdminUserId) REFERENCES Users(Id),
    FOREIGN KEY (TargetUserId) REFERENCES Users(Id)
);


ALTER TABLE AuditLogs DROP FOREIGN KEY auditlogs_ibfk_2;

ALTER TABLE AuditLogs
  ADD CONSTRAINT auditlogs_ibfk_2
  FOREIGN KEY (TargetUserId) REFERENCES Users(Id)
  ON DELETE SET NULL;

  ALTER TABLE transactions DROP FOREIGN KEY transactions_ibfk_1;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_ibfk_1
  FOREIGN KEY (FromAccountId) REFERENCES accounts(Id)
  ON DELETE CASCADE;

ALTER TABLE transactions DROP FOREIGN KEY transactions_ibfk_1;
ALTER TABLE transactions DROP FOREIGN KEY transactions_ibfk_2;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_ibfk_1
  FOREIGN KEY (FromAccountId) REFERENCES accounts(Id)
  ON DELETE SET NULL;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_ibfk_2
  FOREIGN KEY (ToAccountId) REFERENCES accounts(Id)
  ON DELETE SET NULL;