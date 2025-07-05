using System.ComponentModel.DataAnnotations;

namespace OnlineBanking.Core.DTOs
{
    public class ContactRequest
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [RegularExpression(@"^[A-Za-z\s\-']+$", ErrorMessage = "Name can only contain letters, spaces, hyphens, and apostrophes")]
        public string Name { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^[789]\d{9}$", ErrorMessage = "Please enter a valid 10-digit number starting with 7, 8 or 9")]
        public string Phone { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Subject is required")]
        [StringLength(200, ErrorMessage = "Subject cannot exceed 200 characters")]
        public string Subject { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Message is required")]
        [StringLength(500, MinimumLength = 20, ErrorMessage = "Message must be between 20 and 500 characters")]
        public string Message { get; set; } = string.Empty;
    }

    public class ContactDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }
} 