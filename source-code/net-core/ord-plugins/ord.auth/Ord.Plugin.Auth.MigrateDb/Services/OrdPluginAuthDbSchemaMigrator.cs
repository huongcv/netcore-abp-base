using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.MigrateDb.Data;
using Ord.Plugin.Contract;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;

namespace Ord.Plugin.Auth.MigrateDb.Services
{
    public class OrdPluginAuthDbSchemaMigrator : IOrdPluginDbSchemaMigrator, ITransientDependency
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IGuidGenerator _guidGenerator;
        public ILogger<OrdPluginAuthDbSchemaMigrator> Logger { get; set; }
        public OrdPluginAuthDbSchemaMigrator(IServiceProvider serviceProvider,
            IGuidGenerator guidGenerator)
        {
            _serviceProvider = serviceProvider;
            _guidGenerator = guidGenerator;
            Logger = NullLogger<OrdPluginAuthDbSchemaMigrator>.Instance;
        }

        public async Task MigrateAsync()
        {
            Logger.LogInformation("[Plugin auth] Started database migrations ...");
            await using var dbContext = _serviceProvider
                .GetRequiredService<OrdPluginAuthDbContextMigrate>();
            await dbContext.Database.MigrateAsync();
            await SeedAsync(dbContext);
            Logger.LogInformation("[Plugin auth] Successfully completed host database migrations");
        }
        protected async Task SeedAsync(OrdPluginAuthDbContextMigrate dbContext)
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
        private async Task CreateUserIfNull(OrdPluginAuthDbContextMigrate dbContext, string userName, string name, string level)
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

        private async Task CreateTriggerLastModificationTime(OrdPluginAuthDbContextMigrate dbContext,string tableName)
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

    }
}
