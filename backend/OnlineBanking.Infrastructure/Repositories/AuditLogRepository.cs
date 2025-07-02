using System.Threading.Tasks;
using OnlineBanking.Core.Entities;
using OnlineBanking.Core.Interfaces;
using OnlineBanking.Infrastructure.Data;

namespace OnlineBanking.Infrastructure.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly ApplicationDbContext _context;
        public AuditLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(AuditLog log)
        {
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
} 