using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Contract;
using Serilog.Core;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Guids;

namespace Ord.PluginZero.HttpHost
{
    public class SeedDataStartupTask : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IGuidGenerator _guidGenerator;

        public SeedDataStartupTask(IServiceProvider serviceProvider, IGuidGenerator guidGenerator)
        {
            _serviceProvider = serviceProvider;
            _guidGenerator = guidGenerator;
        }

        public SeedDataStartupTask()
        {
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("[Plugin auth] Started database migrations ...");
            await MigrateAsync();
        }
        public async Task MigrateAsync()
        {
            Console.WriteLine("[Plugin auth] Started database migrations ...");
            await using var dbContext = _serviceProvider
                .GetRequiredService<OrdPluginAuthDbContext>();
            await dbContext.Database.MigrateAsync();
            await SeedAsync(dbContext);
            Console.WriteLine("[Plugin auth] Successfully completed host database migrations\"");
            //Logger.LogInformation("[Plugin auth] Successfully completed host database migrations");
        }
        protected async Task SeedAsync(OrdPluginAuthDbContext dbContext)
        {
            await CreateUserIfNull(dbContext, "admin", "admin", "sa");
            await CreateUserIfNull(dbContext, "user", "user", "user");
            var triggerTableLastModificationTime = new List<string>()
            {
                "system_product","system_product_unit","stock_inventory_line_details","system_partner"
            };
            foreach (var tbl in triggerTableLastModificationTime)
            {
                await CreateTriggerLastModificationTime(dbContext, tbl);
            }

        }
        private async Task CreateUserIfNull(OrdPluginAuthDbContext dbContext, string userName, string name, string level)
        {
            try
            {
                var user = await dbContext.Users.FirstOrDefaultAsync(x => x.UserName == userName);
                if (user == null)
                {
                    user = new UserEntity(_guidGenerator.Create())
                    {
                        UserName = userName,
                        Name = name,
                        IsActived = true,
                        IsDeleted = false,
                        Level = level,
                        // 123qwe
                        PasswordHash =
                            "AQAAAAIAAYagAAAAEBL+sT9/Vo+Iw6aCTh/AtUFat1NK+8uvteElL+E1fvUsNnARPujsJxapMZAFe6Xe/w==",
                        IsLockoutEnabled = level != "sa"
                    };
                    await dbContext.Users.AddAsync(user);
                    await dbContext.SaveChangesAsync();
                }
            }
            catch
            {

            }
        }

        private async Task CreateTriggerLastModificationTime(OrdPluginAuthDbContext dbContext, string tableName)
        {
            try
            {
                await dbContext.Database.ExecuteSqlAsync($@"
                CREATE TRIGGER {tableName}_before_insert
                BEFORE INSERT ON {tableName}
                FOR EACH ROW
                BEGIN
                SET NEW.LastModificationTime = NOW();
                END;
                ");
            }
            catch
            {

            }
            try
            {
                await dbContext.Database.ExecuteSqlAsync($@"
                    CREATE TRIGGER {tableName}_before_update
                    BEFORE UPDATE ON {tableName}
                    FOR EACH ROW
                    BEGIN
                    SET NEW.LastModificationTime = NOW();
                    END;
                ");
            }
            catch
            {

            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
