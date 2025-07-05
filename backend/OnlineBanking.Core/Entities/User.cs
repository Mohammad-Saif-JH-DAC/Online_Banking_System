using System.ComponentModel.DataAnnotations;

namespace OnlineBanking.Core.Entities;

public class User
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    [RegularExpression(@"^[A-Za-z\s\-']+$", ErrorMessage = "Full name can only contain letters, spaces, hyphens, and apostrophes")]
    public string FullName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [StringLength(255)]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    [StringLength(20)]
    public string Role { get; set; } = "Customer"; // Admin, Customer
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastLoginAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
} 