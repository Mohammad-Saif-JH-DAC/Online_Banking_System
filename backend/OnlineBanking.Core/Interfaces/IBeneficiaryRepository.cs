using OnlineBanking.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlineBanking.Core.Interfaces
{
    public interface IBeneficiaryRepository
    {
        Task AddAsync(Beneficiary beneficiary);
        Task<IEnumerable<Beneficiary>> GetByUserIdAsync(int userId);
        Task DeleteAsync(int beneficiaryId);
        Task DeleteByUserAsync(int beneficiaryId, int userId);
    }
} 