using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Ord.EfCore.Default.MigrateDb.Data
{
    public class DbContextFactory : IDesignTimeDbContextFactory<DbContextMigrate>
    {
        public DbContextMigrate CreateDbContext(string[] args)
        {
            var configuration = BuildConfiguration();
            var conn = configuration.GetConnectionString("Default");
            var builder = new DbContextOptionsBuilder<DbContextMigrate>()
                .UseMySql(configuration.GetConnectionString("Default"), MySqlServerVersion.LatestSupportedServerVersion);

            return new DbContextMigrate(builder.Options);
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
