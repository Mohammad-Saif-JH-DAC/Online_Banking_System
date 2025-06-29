using Microsoft.AspNetCore.Mvc;
using OnlineBanking.Application.Services;
using OnlineBanking.Core.DTOs;

namespace OnlineBanking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // Log the registration attempt
            Console.WriteLine($"Registration attempt - Email: {request.Email}, Role: {request.Role}");
            
            var response = await _authService.RegisterAsync(request);
            
            // Log successful registration
            Console.WriteLine($"Registration successful - Email: {request.Email}, Role: {response.User.Role}");
            
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine($"Registration failed - Email: {request.Email}, Error: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Registration error - Email: {request.Email}, Error: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [HttpPost("validate")]
    public async Task<ActionResult> ValidateToken([FromBody] string token)
    {
        try
        {
            var isValid = await _authService.ValidateTokenAsync(token);
            if (isValid)
            {
                var user = await _authService.GetUserFromTokenAsync(token);
                return Ok(new { isValid = true, user });
            }
            return Ok(new { isValid = false });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Token validation error: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred while validating token" });
        }
    }
} 