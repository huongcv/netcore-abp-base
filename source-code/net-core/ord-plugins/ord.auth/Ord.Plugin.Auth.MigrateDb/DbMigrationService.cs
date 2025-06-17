using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Ord.Plugin.Contract;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Ord.PluginZero.DbMigrator
{
    public class DbMigrationService : ITransientDependency
    {
        public ILogger<DbMigrationService> Logger { get; set; }
        private readonly IEnumerable<IOrdPluginDbSchemaMigrator> _dbSchemaMigrators;

        public DbMigrationService(IEnumerable<IOrdPluginDbSchemaMigrator> dbSchemaMigrators)
        {
            _dbSchemaMigrators = dbSchemaMigrators;
            Logger = NullLogger<DbMigrationService>.Instance;
        }

        public async Task MigrateAsync()
        {
            foreach (var migrator in _dbSchemaMigrators)
            {
                try
                {
                    await migrator.MigrateAsync();
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex.Message);
                }

            }
        }
    }
}
