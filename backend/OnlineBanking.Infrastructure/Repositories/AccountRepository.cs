using Microsoft.EntityFrameworkCore;
using OnlineBanking.Core.Entities;
using OnlineBanking.Core.Interfaces;
using OnlineBanking.Infrastructure.Data;

namespace OnlineBanking.Infrastructure.Repositories;

public class AccountRepository : Repository<Account>, IAccountRepository
{
    public AccountRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Account?> GetByAccountNumberAsync(string accountNumber)
    {
        return await _dbSet
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber);
    }

    public async Task<bool> AccountNumberExistsAsync(string accountNumber)
    {
        return await _dbSet.AnyAsync(a => a.AccountNumber == accountNumber);
    }

    public async Task<IEnumerable<Account>> GetAccountsByUserIdAsync(int userId)
    {
        return await _dbSet
            .Include(a => a.User)
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }

    public async Task<Account?> GetAccountWithTransactionsAsync(int accountId)
    {
        return await _dbSet
            .Include(a => a.User)
            .Include(a => a.FromTransactions)
            .Include(a => a.ToTransactions)
            .FirstOrDefaultAsync(a => a.Id == accountId);
    }

    public async Task<string> GenerateAccountNumberAsync()
    {
        var random = new Random();
        string accountNumber;
        do
        {
            // Generate a 10-digit number safely
            accountNumber = random.Next(100000000, 999999999).ToString() + random.Next(0, 9).ToString();
        } while (await AccountNumberExistsAsync(accountNumber));
        return accountNumber;
    }
} 