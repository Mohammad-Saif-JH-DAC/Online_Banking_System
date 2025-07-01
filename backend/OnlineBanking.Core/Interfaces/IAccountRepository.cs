using OnlineBanking.Core.Entities;

namespace OnlineBanking.Core.Interfaces;

public interface IAccountRepository : IRepository<Account>
{
    Task<Account?> GetByAccountNumberAsync(string accountNumber);
    Task<bool> AccountNumberExistsAsync(string accountNumber);
    Task<IEnumerable<Account>> GetAccountsByUserIdAsync(int userId);
    Task<Account?> GetAccountWithTransactionsAsync(int accountId);
    Task<string> GenerateAccountNumberAsync();
    Task<Account?> GetByIdWithUserAsync(int id);
} 