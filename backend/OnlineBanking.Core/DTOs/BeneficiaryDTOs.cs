namespace OnlineBanking.Core.DTOs
{
    public class AddBeneficiaryRequest
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
    }

    public class BeneficiaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }
} 