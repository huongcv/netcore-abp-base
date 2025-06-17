using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ord.Domain.Services;
using Ord.EfCore.Default.MigrateDb.Data;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Services;

namespace Ord.EfCore.Default.MigrateDb.Base
{
    public abstract class SeedDataBaseService : DomainService, IOrdDbSchemaMigrator, ITransientDependency
    {
        private ILogger<SeedDataBaseService> Logger =>
            LazyServiceProvider.LazyGetRequiredService<ILogger<SeedDataBaseService>>();
        public async Task MigrateAsync()
        {
            await using var dbContext = LazyServiceProvider.GetRequiredService<DbContextMigrate>();
            await dbContext.Database.MigrateAsync();
            await SeedAsync(dbContext);
        }

        protected abstract Task SeedAsync(DbContextMigrate dbContext);
    }
}
