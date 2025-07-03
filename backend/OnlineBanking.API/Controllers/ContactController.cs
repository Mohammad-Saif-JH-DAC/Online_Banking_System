using Microsoft.AspNetCore.Mvc;
using OnlineBanking.Application.Services;
using OnlineBanking.Core.DTOs;
using System.Threading.Tasks;

namespace OnlineBanking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;
        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ContactRequest request)
        {
            await _contactService.AddContactAsync(request);
            return Ok(new { message = "Message sent successfully!" });
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var contacts = await _contactService.GetContactsAsync();
            return Ok(contacts);
        }
    }
} 