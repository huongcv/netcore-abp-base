using Ord.Plugin.Contract.Features.AuditTrail;

namespace Ord
{
    public interface IOperationContextService
    {
        OperationContext CreateContext(string operationType, string entityName, object entityId = null);
        Task LogOperationAsync(OperationContext context, bool success, string error = null);
    }
}
