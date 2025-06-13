using Dapper;
using kp.Dapper.Handlers;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Core.Data;
using Volo.Abp.EntityFrameworkCore.DependencyInjection;

namespace Ord.Plugin.Core.Configurations
{
    public static class DatabaseConfiguration
    {
        public static void AddDatabaseServices(this IServiceCollection services)
        {
            // Configure ABP DbContext
            services.AddAbpDbContext<OrdPluginCoreDbContext>(options =>
            {
                options.AddDefaultRepositories(includeAllEntities: true);
                RegisterCustomRepositories(options);
            });

            // Configure Dapper
            ConfigureDapperTypeHandlers();

            // Configure database connection resilience
            ConfigureDatabaseResilience(services);
        }
        private static void RegisterCustomRepositories(IAbpDbContextRegistrationOptionsBuilder options)
        {
           
        }

        private static void ConfigureDapperTypeHandlers()
        {
            // Register Dapper type handlers for better type mapping
            SqlMapper.AddTypeHandler(new SqlDateOnlyTypeHandler());
            SqlMapper.AddTypeHandler(new SqlTimeOnlyTypeHandler());

            // Configure Dapper settings
            //SqlMapper.Settings.CommandTimeout = 30; // 30 seconds timeout
        }

        private static void ConfigureDatabaseResilience(IServiceCollection services)
        {
            // Add database health checks
            //services.AddHealthChecks()
            //    .AddDbContextCheck<OrdPluginCoreDbContext>("database");

            // Configure connection resilience policies
            // This can be extended with Polly for retry policies
        }
    }
}
