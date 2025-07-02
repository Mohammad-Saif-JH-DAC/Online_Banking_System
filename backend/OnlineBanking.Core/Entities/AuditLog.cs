using System;

namespace OnlineBanking.Core.Entities
{
    public class AuditLog
    {
        public int Id { get; set; }
        public int AdminUserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public int? TargetUserId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string? Details { get; set; }
    }
} 