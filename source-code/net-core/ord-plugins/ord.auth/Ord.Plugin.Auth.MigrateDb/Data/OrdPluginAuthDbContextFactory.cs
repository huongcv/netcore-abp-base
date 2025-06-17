using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Ord.Plugin.Auth.MigrateDb.Data
{
    public class OrdPluginAuthDbContextFactory : IDesignTimeDbContextFactory<OrdPluginAuthDbContextMigrate>
    {
        public OrdPluginAuthDbContextMigrate CreateDbContext(string[] args)
        {
            var configuration = BuildConfiguration();

            var builder = new DbContextOptionsBuilder<OrdPluginAuthDbContextMigrate>()
                .UseMySql(configuration.GetConnectionString("Default"), MySqlServerVersion.LatestSupportedServerVersion);

            return new OrdPluginAuthDbContextMigrate(builder.Options);
        }
        private static IConfigurationRoot BuildConfiguration()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false);

            return builder.Build();
        }
    }
}
