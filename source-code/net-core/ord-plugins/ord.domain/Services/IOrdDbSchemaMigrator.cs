namespace Ord.Domain.Services
{
    public interface IOrdDbSchemaMigrator
    {
        Task MigrateAsync();
    }
}
