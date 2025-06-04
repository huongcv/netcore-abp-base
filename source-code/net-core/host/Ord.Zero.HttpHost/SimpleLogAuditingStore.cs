using Volo.Abp.Auditing;
using Volo.Abp.DependencyInjection;

namespace Ord.Pos.HttpHost
{
    public class OrdSimpleLogAuditingStore : IAuditingStore, ITransientDependency
    {

        public OrdSimpleLogAuditingStore()
        {

        }

        public Task SaveAsync(AuditLogInfo auditInfo)
        {
            // Logger.LogInformation(auditInfo.ToString());
            return Task.FromResult(0);
        }
    }
}
