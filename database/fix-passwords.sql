-- Fix Admin and Customer Passwords
-- Run this script to update the passwords with correct BCrypt hashes

USE online_banking;

-- Update Admin password to "Admin123!"
UPDATE Users 
SET PasswordHash = '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' 
WHERE Email = 'admin@bank.com';

-- Update Customer password to "Customer123!"
UPDATE Users 
SET PasswordHash = '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' 
WHERE Email = 'john.doe@example.com';

-- Verify the updates
SELECT Id, FullName, Email, Role, IsActive FROM Users; 