using Microsoft.Extensions.Logging;
using Ord.Domain.Entities.MasterData;
using Ord.EfCore.Default.MigrateDb.Base;
using Ord.EfCore.Default.MigrateDb.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ord.Domain.Consts;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Ord.EfCore.Default.MigrateDb.Services
{
    public class RoleTemplateSeeder : SeedDataBaseService
    {
        protected override async Task SeedAsync(DbContextMigrate dbContext)
        {
            Logger.LogInformation("####################### Start Role Template Seeding ########################");

            var templates = new List<(string Code, string Name)>
            {
                (RoleCodeTemplateConst.TenantUser, "[Tenant] Vai trò mẫu của người dùng"),
                (RoleCodeTemplateConst.TenantAdmin, "[Tenant] Vai trò mẫu của quản trị admin")
            };

            foreach (var (code, name) in templates)
            {
                await AddRoleIfNotExists(dbContext, code, name);
            }

            Logger.LogInformation("####################### End Role Template Seeding ##########################");
        }

        private async Task AddRoleIfNotExists(DbContextMigrate dbContext, string code, string name)
        {
            if (!await dbContext.Roles.AnyAsync(r => r.Code == code))
            {
                await dbContext.Roles.AddAsync(new RoleEntity
                {
                    Code = code,
                    Name = name,
                    IsActived = true,
                    IsTemplate = true,
                    IsDeleted = false
                });

                await dbContext.SaveChangesAsync();
                Logger.LogInformation($"Added role template: {code} - {name}");
            }
            else
            {
                Logger.LogInformation($"Role template already exists: {code}");
            }
        }
    }
}