using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineBanking.Core.Entities;

public class Transaction
{
    public int Id { get; set; }
    
    public int? FromAccountId { get; set; }
    
    public int? ToAccountId { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Type { get; set; } = string.Empty; // Deposit, Withdraw, Transfer
    
    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "Completed"; // Pending, Completed, Failed
    
    public string? Description { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Account? FromAccount { get; set; }
    public virtual Account? ToAccount { get; set; }
} 