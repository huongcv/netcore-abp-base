﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ord.Contract.Entities;
using Ord.Domain.Services;
using Ord.EfCore.Default.MigrateDb.Data;
using System;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Ord.EfCore.Default.MigrateDb.Services
{
    public class DbSchemaMigrator : IOrdDbSchemaMigrator, ITransientDependency
    {
        private readonly IServiceProvider _serviceProvider;
        public ILogger<DbSchemaMigrator> Logger { get;  }
        public DbSchemaMigrator(IServiceProvider serviceProvider,
            ILogger<DbSchemaMigrator> logger)
        {
            _serviceProvider = serviceProvider;
            Logger = logger;
        }

        public async Task MigrateAsync()
        {
            Logger.LogInformation("[Plugin auth] Started database migrations ...");
            await using var dbContext = _serviceProvider
                .GetRequiredService<DbContextMigrate>();
            await dbContext.Database.MigrateAsync();
            await SeedAsync(dbContext);
            Logger.LogInformation("[Plugin auth] Successfully completed host database migrations");
        }
        protected async Task SeedAsync(DbContextMigrate dbContext)
        {
            await CreateUserIfNull(dbContext, "admin", "admin", "sa");
            await CreateUserIfNull(dbContext, "user", "user", "user");
        }
        private async Task CreateUserIfNull(DbContextMigrate dbContext, string userName, string name, string level)
        {
            try
            {
                var user = await dbContext.Users.FirstOrDefaultAsync(x => x.UserName == userName);
                if (user == null)
                {
                    user = new UserEntity(Guid.NewGuid())
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

        private async Task CreateTriggerLastModificationTime(DbContextMigrate dbContext,string tableName)
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
