using Microsoft.Extensions.Configuration;
using Ord.Plugin.Contract.Factories;
using StackExchange.Redis;
using Volo.Abp.Application.Services;
using Volo.Abp.Security.Encryption;

namespace Ord.Plugin.HostBase.AppServices
{
    [OrdAuth("SuperAdmin")]
    public class SysToolAppService(IConfiguration configuration, IAppFactory appFactory) : ApplicationService
    {
        public  Task SyncTemplatesToMinioAsync()
        {
            return appFactory.GetServiceDependency<TemplateSyncService>().SyncTemplatesToMinioAsync();
        }
        public async Task ClearAllCacheInRedis()
        {
            var connectionMultiplexer = await ConnectionMultiplexer.ConnectAsync(configuration["Redis:Configuration"],
                x =>
                {
                    x.AllowAdmin = true;
                });
            var servers = connectionMultiplexer.GetServers();
            if (servers != null)
            {
                foreach (var server in servers)
                {
                    await server.FlushAllDatabasesAsync();
                }
            }
        }

        public string GetEncrypted(string value)
        {
            return appFactory.GetServiceDependency<IStringEncryptionService>().Encrypt(value);
        }
    }
}
