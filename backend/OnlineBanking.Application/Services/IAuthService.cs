using OnlineBanking.Core.DTOs;

namespace OnlineBanking.Application.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<bool> ValidateTokenAsync(string token);
    Task<UserDto?> GetUserFromTokenAsync(string token);
    Task<bool> ChangePasswordAsync(ChangePasswordRequest request);
} 