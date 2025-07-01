using OnlineBanking.Core.DTOs;
using OnlineBanking.Core.Entities;
using OnlineBanking.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineBanking.Application.Services
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;
        public ContactService(IContactRepository contactRepository)
        {
            _contactRepository = contactRepository;
        }

        public async Task AddContactAsync(ContactRequest request)
        {
            var contact = new Contact
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Subject = request.Subject,
                Message = request.Message
            };
            await _contactRepository.AddAsync(contact);
        }

        public async Task<IEnumerable<ContactDto>> GetContactsAsync()
        {
            var contacts = await _contactRepository.GetAllAsync();
            return contacts.Select(c => new ContactDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                Subject = c.Subject,
                Message = c.Message,
                CreatedAt = c.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
            });
        }
    }
} 