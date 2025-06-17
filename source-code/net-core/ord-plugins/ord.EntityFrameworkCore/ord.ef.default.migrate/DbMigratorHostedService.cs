using Microsoft.Extensions.DependencyInjection;
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
    private readonly IHostApplicationLifetime _hostApplicationLifetime;
    private readonly IServiceProvider _serviceProvider;

    public DbMigratorHostedService(
        ILogger<DbMigratorHostedService> logger,
        IHostApplicationLifetime hostApplicationLifetime,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _hostApplicationLifetime = hostApplicationLifetime;
        _serviceProvider = serviceProvider;
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
        var dbSchemaMigrators = _serviceProvider.GetRequiredService<IEnumerable<IOrdDbSchemaMigrator>>();

        foreach (var migrator in dbSchemaMigrators)
        {
            try
            {
                await migrator.MigrateAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thực hiện migration: {Message}", ex.Message);
            }
        }
    }
}