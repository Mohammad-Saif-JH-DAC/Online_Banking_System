using Microsoft.EntityFrameworkCore;
using OnlineBanking.Core.Entities;
using OnlineBanking.Core.Interfaces;
using OnlineBanking.Infrastructure.Data;

namespace OnlineBanking.Infrastructure.Repositories;

public class TransactionRepository : Repository<Transaction>, ITransactionRepository
{
    public TransactionRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Transaction>> GetTransactionsByAccountIdAsync(int accountId)
    {
        return await _dbSet
            .Include(t => t.FromAccount)
            .Include(t => t.ToAccount)
            .Where(t => t.FromAccountId == accountId || t.ToAccountId == accountId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetTransactionsByUserIdAsync(int userId)
    {
        return await _dbSet
            .Include(t => t.FromAccount)
                .ThenInclude(a => a!.User)
            .Include(t => t.ToAccount)
                .ThenInclude(a => a!.User)
            .Where(t => t.FromAccount!.UserId == userId || t.ToAccount!.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Transaction>> GetRecentTransactionsAsync(int accountId, int count = 10)
    {
        return await _dbSet
            .Include(t => t.FromAccount)
            .Include(t => t.ToAccount)
            .Where(t => t.FromAccountId == accountId || t.ToAccountId == accountId)
            .OrderByDescending(t => t.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<decimal> GetAccountBalanceAsync(int accountId)
    {
        var account = await _context.Accounts.FindAsync(accountId);
        return account?.Balance ?? 0;
    }
} 