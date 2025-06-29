using OnlineBanking.Core.Entities;

namespace OnlineBanking.Core.Interfaces;

public interface ITransactionRepository : IRepository<Transaction>
{
    Task<IEnumerable<Transaction>> GetTransactionsByAccountIdAsync(int accountId);
    Task<IEnumerable<Transaction>> GetTransactionsByUserIdAsync(int userId);
    Task<IEnumerable<Transaction>> GetRecentTransactionsAsync(int accountId, int count = 10);
    Task<decimal> GetAccountBalanceAsync(int accountId);
} 