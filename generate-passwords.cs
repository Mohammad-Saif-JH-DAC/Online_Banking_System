using System;
using BCrypt.Net;

class Program
{
    static void Main()
    {
        Console.WriteLine("Password Hash Generator for Online Banking System");
        Console.WriteLine("================================================");
        Console.WriteLine();
        
        string adminPassword = "Admin123!";
        string customerPassword = "Customer123!";
        
        string adminHash = BCrypt.HashPassword(adminPassword);
        string customerHash = BCrypt.HashPassword(customerPassword);
        
        Console.WriteLine($"Admin Password: {adminPassword}");
        Console.WriteLine($"Admin Hash: {adminHash}");
        Console.WriteLine();
        Console.WriteLine($"Customer Password: {customerPassword}");
        Console.WriteLine($"Customer Hash: {customerHash}");
        Console.WriteLine();
        Console.WriteLine("SQL Commands to update passwords:");
        Console.WriteLine("=================================");
        Console.WriteLine($"UPDATE Users SET PasswordHash = '{adminHash}' WHERE Email = 'admin@bank.com';");
        Console.WriteLine($"UPDATE Users SET PasswordHash = '{customerHash}' WHERE Email = 'john.doe@example.com';");
        
        Console.WriteLine();
        Console.WriteLine("Press any key to exit...");
        Console.ReadKey();
    }
} 