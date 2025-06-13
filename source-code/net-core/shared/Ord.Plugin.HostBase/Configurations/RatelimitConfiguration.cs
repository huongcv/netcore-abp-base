using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Features.RateLimits;
using Ord.Plugin.Core.Features.RateLimits;
using StackExchange.Redis;

namespace Ord.Plugin.HostBase.Configurations
{
    public static class RatelimitConfiguration
    {
        public static IServiceCollection AddRedisRateLimit(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IConnectionMultiplexer>(sp => ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]));
            //// Cấu hình options với validation
            //services.Configure<RateLimitOptions>(options =>
            //{
            //    configuration.GetSection(RateLimitOptions.SectionName);
            //});
            var rateConfig = configuration.GetSection(RateLimitOptions.SectionName).Get<RateLimitOptions>();
            services.AddSingleton<RateLimitOptions>(rateConfig);
            // Đăng ký Rate Limit Store
            services.AddSingleton<IRateLimitStore, RedisRateLimitStore>();

            // Đăng ký middleware
            services.AddScoped<RateLimitMiddleware>();

            return services;
        }
    }
}
