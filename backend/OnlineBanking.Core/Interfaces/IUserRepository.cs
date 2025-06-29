using OnlineBanking.Core.Entities;

namespace OnlineBanking.Core.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task<IEnumerable<User>> GetActiveUsersAsync();
    Task<User?> GetUserWithAccountsAsync(int userId);
} 