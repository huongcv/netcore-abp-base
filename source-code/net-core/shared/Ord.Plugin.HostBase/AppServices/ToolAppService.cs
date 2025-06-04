using Microsoft.Extensions.Configuration;
using Ord.Plugin.Contract.Factories;
using StackExchange.Redis;
using Volo.Abp.Application.Services;
using Volo.Abp.Security.Encryption;

namespace Ord.Plugin.HostBase.AppServices
{
    [OrdAuth("SuperAdmin")]
    public class ToolAppService : ApplicationService
    {
        private readonly IConfiguration _configuration;
        private readonly IAppFactory _appFactory;

        public ToolAppService(IConfiguration configuration, IAppFactory appFactory)
        {
            _configuration = configuration;
            _appFactory = appFactory;
        }
        public async Task ClearAllCacheInRedis()
        {
            var connectionMultiplexer = await ConnectionMultiplexer.ConnectAsync(_configuration["Redis:Configuration"],
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
            return _appFactory.GetServiceDependency<IStringEncryptionService>().Encrypt(value);
        }
    }
}
