using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using OnlineBanking.Application.Services;
using OnlineBanking.Core.DTOs;
using OnlineBanking.Core.Entities;
using OnlineBanking.Core.Interfaces;
using System.Security.Cryptography;
using BCrypt.Net;
using AutoMapper;

namespace OnlineBanking.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IAccountRepository accountRepository, IMapper mapper, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _accountRepository = accountRepository;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        const string AdminSecretKey = "cdac123";
        // Check if user already exists
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        // Validate role
        if (request.Role != "Admin" && request.Role != "Customer")
        {
            throw new InvalidOperationException("Invalid role. Must be either 'Admin' or 'Customer'.");
        }

        // Additional validation for admin registration
        if (request.Role == "Admin")
        {
            if (string.IsNullOrWhiteSpace(request.SecretKey) || request.SecretKey != AdminSecretKey)
            {
                throw new InvalidOperationException("Invalid or missing admin secret key.");
            }
            Console.WriteLine($"Admin registration attempt for email: {request.Email}");
        }

        // Create new user
        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role, // This will be "Admin" or "Customer" based on selection
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        // Log the registration for debugging
        Console.WriteLine($"User registered successfully: {user.Email} with role: {user.Role}");

        // Create default account for the user (only for customers)
        if (request.Role == "Customer")
        {
            var account = new Account
            {
                AccountNumber = GenerateAccountNumber(),
                Balance = 0,
                UserId = user.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _accountRepository.AddAsync(account);
        }

        // Generate JWT token
        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            User = _mapper.Map<UserDto>(user)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Invalid email or password.");
        }

        if (!user.IsActive)
        {
            throw new InvalidOperationException("Account is deactivated.");
        }

        // Update last login time
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            User = _mapper.Map<UserDto>(user)
        };
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured"));
            
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<UserDto?> GetUserFromTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured"));
            
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);
            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdClaim, out int userId))
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user != null)
                {
                    return new UserDto
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email,
                        Role = user.Role,
                        IsActive = user.IsActive,
                        CreatedAt = user.CreatedAt
                    };
                }
            }

            return null;
        }
        catch
        {
            return null;
        }
    }

    private string GenerateAccountNumber()
    {
        var random = new Random();
        return random.Next(100000000, 999999999).ToString();
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "your-secret-key-here"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    public async Task<bool> ChangePasswordAsync(ChangePasswordRequest request)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null)
            throw new InvalidOperationException("User not found.");
        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            throw new InvalidOperationException("Current password is incorrect.");
        if (request.NewPassword != request.ConfirmPassword)
            throw new InvalidOperationException("New passwords do not match.");
        if (request.NewPassword.Length < 6)
            throw new InvalidOperationException("Password must be at least 6 characters long.");
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _userRepository.UpdateAsync(user);
        return true;
    }
} 