using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Ord.Domain.Services;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Ord.EfCore.Default.MigrateDb;

public class DbMigratorHostedService : IHostedService
{
    private readonly ILogger<DbMigratorHostedService> _logger;
    private readonly IEnumerable<IOrdDbSchemaMigrator> _dbSchemaMigrators;
    private readonly IHostApplicationLifetime _hostApplicationLifetime;

    public DbMigratorHostedService(
        ILogger<DbMigratorHostedService> logger,
        IEnumerable<IOrdDbSchemaMigrator> dbSchemaMigrators,
        IHostApplicationLifetime hostApplicationLifetime)
    {
        _logger = logger;
        _dbSchemaMigrators = dbSchemaMigrators;
        _hostApplicationLifetime = hostApplicationLifetime;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await MigrateAsync();
        // Tắt ứng dụng sau khi migrate xong
        _hostApplicationLifetime.StopApplication();
    }
    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
    protected async Task MigrateAsync()
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
}
