namespace Ord.Plugin.Contract
{
    public interface IOrdPluginDbSchemaMigrator
    {
        Task MigrateAsync();
    }
}
