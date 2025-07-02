using System.Threading.Tasks;
using OnlineBanking.Core.Entities;

namespace OnlineBanking.Core.Interfaces
{
    public interface IAuditLogRepository
    {
        Task AddAsync(AuditLog log);
    }
} 