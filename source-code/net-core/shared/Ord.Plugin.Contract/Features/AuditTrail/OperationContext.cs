namespace Ord.Plugin.Contract.Features.AuditTrail
{
    public class OperationContext
    {
        public string? OperationType { get; set; } // CREATE, UPDATE, DELETE
        public string? EntityName { get; set; }
        public object? EntityId { get; set; }
        public Guid? UserId { get; set; }
        public Guid? TenantId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public Dictionary<string, object> Metadata { get; set; } = new();
    }
}
