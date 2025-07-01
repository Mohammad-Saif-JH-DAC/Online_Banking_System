using OnlineBanking.Core.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlineBanking.Application.Services
{
    public interface IContactService
    {
        Task AddContactAsync(ContactRequest request);
        Task<IEnumerable<ContactDto>> GetContactsAsync();
    }
} 