using OnlineBanking.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlineBanking.Core.Interfaces
{
    public interface IContactRepository
    {
        Task AddAsync(Contact contact);
        Task<IEnumerable<Contact>> GetAllAsync();
    }
} 