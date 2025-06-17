using Volo.Abp.DependencyInjection;

namespace Ord.Domain.Services
{
    public interface IOrdDbSchemaMigrator : ITransientDependency
    {
        Task MigrateAsync();
    }
}
