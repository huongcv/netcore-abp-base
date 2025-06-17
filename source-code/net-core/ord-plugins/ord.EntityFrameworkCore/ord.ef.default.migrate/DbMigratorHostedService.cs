using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Ord.EfCore.Default.MigrateDb;

public class DbMigratorHostedService : IHostedService
{
    private readonly ILogger<DbMigratorHostedService> _logger;
    private readonly IEnumerable<IOrdPluginDbSchemaMigrator> _dbSchemaMigrators;


    public DbMigratorHostedService(
        ILogger<DbMigratorHostedService> logger, 
        IEnumerable<IOrdPluginDbSchemaMigrator> dbSchemaMigrators)
    {
        _logger = logger;
        _dbSchemaMigrators = dbSchemaMigrators;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await MigrateAsync();
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
                _logger.LogError(ex.Message);
            }

        }
    }
    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
