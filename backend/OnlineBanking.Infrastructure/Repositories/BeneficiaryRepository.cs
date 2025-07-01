using OnlineBanking.Core.Entities;
using OnlineBanking.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineBanking.Infrastructure.Data;

namespace OnlineBanking.Infrastructure.Repositories
{
    public class BeneficiaryRepository : IBeneficiaryRepository
    {
        private readonly ApplicationDbContext _context;
        public BeneficiaryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Beneficiary beneficiary)
        {
            try
            {
                _context.Beneficiaries.Add(beneficiary);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Rethrow for service layer to handle
                throw;
            }
        }

        public async Task<IEnumerable<Beneficiary>> GetByUserIdAsync(int userId)
        {
            return await _context.Beneficiaries.Where(b => b.UserId == userId).ToListAsync();
        }

        public async Task DeleteAsync(int beneficiaryId)
        {
            var beneficiary = await _context.Beneficiaries.FindAsync(beneficiaryId);
            if (beneficiary != null)
            {
                _context.Beneficiaries.Remove(beneficiary);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteByUserAsync(int beneficiaryId, int userId)
        {
            var beneficiary = await _context.Beneficiaries.FirstOrDefaultAsync(b => b.Id == beneficiaryId && b.UserId == userId);
            if (beneficiary != null)
            {
                _context.Beneficiaries.Remove(beneficiary);
                await _context.SaveChangesAsync();
            }
        }
    }
} 