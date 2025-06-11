using System.Text;
using Ord.Plugin.Contract.Factories;
using StackExchange.Redis;

namespace Ord.Plugin.Core.Utils
{
    public static class AppFactoryCachingUtil
    {
        public static async Task ClearCacheUser(this IAppFactory factory, Guid? userId = null)
        {
            if (userId == null)
            {
                userId = factory.CurrentUserId;
            }

            try
            {
                await RemoveRedisCacheContainKey(factory, userId.ToString());
            }
            catch
            {

            }

        }
        public static async Task ClearAllCacheInRedis(this IAppFactory factory)
        {
            try
            {
                await using var connectionMultiplexer = await ConnectionMultiplexer.ConnectAsync(
                    factory.Configuration["Redis:Configuration"],
                    x => { x.AllowAdmin = true; });
                var servers = connectionMultiplexer.GetServers();
                if (servers != null)
                {
                    foreach (var server in servers)
                    {
                        await server.FlushAllDatabasesAsync();
                    }
                }
            }
            catch
            {
                //
            }

        }

        public static async Task RemoveRedisCacheContainKey(this IAppFactory factory, string pattern)
        {
            try
            {
                var redisEnabled = factory.Configuration["Redis:IsEnabled"];
                if (string.IsNullOrEmpty(redisEnabled) || bool.Parse(redisEnabled))
                {
                    await using var connectionMultiplexer = await ConnectionMultiplexer.ConnectAsync(
                        factory.Configuration["Redis:Configuration"],
                        x => { x.AllowAdmin = true; });
                    var db = connectionMultiplexer.GetDatabase();
                    var servers = connectionMultiplexer.GetServers();
                    if (servers != null)
                    {
                        foreach (var server in servers)
                        {
                            var keys = server.KeysAsync(-1, $"*{pattern}*", 1000);
                            await foreach (var key in keys)
                            {
                                await db.KeyDeleteAsync(key);
                            }
                            var keyEndWith = server.KeysAsync(-1, $"*{pattern}", 1000);
                            await foreach (var key in keyEndWith)
                            {
                                await db.KeyDeleteAsync(key);
                            }
                        }
                    }
                }
            }
            catch
            {
                //
            }
        }

        public static string BuilderUserKeyCache(this IAppFactory factory, Guid? userId, params string[] partKeys)
        {
            var builderStr = new StringBuilder($"user:{userId}:");
            if (partKeys?.Any() == true)
            {
                foreach (var part in partKeys)
                {
                    builderStr.Append(part + ":");
                }
            }

            return builderStr.ToString();
        }

        public static string BuilderCurrentUserKeyCache(this IAppFactory factory, params string[] partKeys)
        {
            return BuilderUserKeyCache(factory, factory.CurrentUserId, partKeys);
        }
    }
}
