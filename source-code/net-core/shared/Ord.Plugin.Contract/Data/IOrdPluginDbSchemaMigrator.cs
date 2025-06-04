using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract
{
    public interface IOrdPluginDbSchemaMigrator
    {
        Task MigrateAsync();
    }
}
