using Microsoft.EntityFrameworkCore;
using OnlineBanking.Core.Entities;
using OnlineBanking.Core.Interfaces;
using OnlineBanking.Infrastructure.Data;

namespace OnlineBanking.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .Include(u => u.Accounts)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        return await _dbSet
            .Include(u => u.Accounts)
            .Where(u => u.IsActive)
            .ToListAsync();
    }

    public async Task<User?> GetUserWithAccountsAsync(int userId)
    {
        return await _dbSet
            .Include(u => u.Accounts)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public override async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _dbSet.Include(u => u.Accounts).ToListAsync();
    }
} 