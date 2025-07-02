using Microsoft.AspNetCore.Mvc;
using OnlineBanking.Core.Interfaces;
using System.Linq;
using System.Threading.Tasks;
using OnlineBanking.Core.Entities;
using OnlineBanking.Core.DTOs;

namespace OnlineBanking.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuditLogRepository _auditLogRepository;
        private readonly IAccountRepository _accountRepository;

        public AdminController(IUserRepository userRepository, IAuditLogRepository auditLogRepository, IAccountRepository accountRepository)
        {
            _userRepository = userRepository;
            _auditLogRepository = auditLogRepository;
            _accountRepository = accountRepository;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userRepository.GetAllAsync();
            var result = users.Select(u => new {
                id = u.Id,
                name = u.FullName,
                accountNumber = u.Accounts != null && u.Accounts.Any() ? u.Accounts.First().AccountNumber : "",
                email = u.Email,
                status = u.IsActive ? "Active" : "Inactive",
                role = u.Role
            }).ToList();
            var activeCustomers = result.Count(u => u.status == "Active" && u.role != "Admin");
            return Ok(new { users = result, activeCustomers });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return NotFound();

            // Allow deletion regardless of accounts/transactions
            await _userRepository.DeleteAsync(user);
            var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            await _auditLogRepository.AddAsync(new AuditLog
            {
                AdminUserId = adminId,
                Action = "DeleteUser",
                TargetUserId = id,
                Details = $"User {id} deleted"
            });
            return NoContent();
        }

        [HttpPatch("users/{id}/block")]
        public async Task<IActionResult> BlockUser(int id, [FromBody] BlockUserRequest request)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return NotFound();
            user.IsActive = !request.Block ? true : false;
            await _userRepository.UpdateAsync(user);
            var adminId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            await _auditLogRepository.AddAsync(new AuditLog
            {
                AdminUserId = adminId,
                Action = request.Block ? "BlockUser" : "UnblockUser",
                TargetUserId = id,
                Details = $"User {id} {(request.Block ? "blocked" : "unblocked")}" 
            });
            var userDto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
            return Ok(userDto);
        }

        [HttpGet("accounts/{userId}")]
        public async Task<IActionResult> GetAccountsForUser(int userId)
        {
            var accounts = await _accountRepository.GetAccountsByUserIdAsync(userId);
            var result = accounts.Select(a => new AccountDto
            {
                Id = a.Id,
                AccountNumber = a.AccountNumber,
                Balance = a.Balance,
                IsActive = a.IsActive,
                CreatedAt = a.CreatedAt,
                LastTransactionAt = a.LastTransactionAt,
                User = a.User == null ? null : new UserDto
                {
                    Id = a.User.Id,
                    FullName = a.User.FullName,
                    Email = a.User.Email,
                    Role = a.User.Role,
                    IsActive = a.User.IsActive,
                    CreatedAt = a.User.CreatedAt
                }
            }).ToList();
            return Ok(result);
        }

        public class BlockUserRequest
        {
            public bool Block { get; set; }
        }
    }
} 