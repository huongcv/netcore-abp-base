using Microsoft.Extensions.Logging;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract.Enums;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Core.Data;
using System.Text;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Repositories
{
    public class SettingSharedRepository(IDbContextProvider<OrdPluginCoreDbContext> dbContextProvider)
        : DapperDefaultDbContext(dbContextProvider), ISettingSharedRepository
    {
        private ILogger<SettingSharedRepository> Logger =>
            AppFactory.GetServiceDependency<ILogger<SettingSharedRepository>>();
        public async Task<SettingDto?> GetSettingAsync(string name, SettingType type, bool isJsonValue = false)
        {
            var sql = new StringBuilder($@"SELECT {(isJsonValue ? "JObjectValue" : "Value")} as Value, MustEncrypt 
                                         FROM settings 
                                         WHERE IsDeleted = 0 
                                           AND Type = @Type 
                                           AND IsActived = 1 
                                           AND Name = @Name");

            var parameters = new
            {
                Name = name,
                Type = type,
                TenantId = AppFactory.CurrentTenantId,
                UserId = AppFactory.CurrentUserId,
            };

            if (type == SettingType.ForTenant)
            {
                sql.Append(" AND TenantId = @TenantId");
            }

            if (type == SettingType.ForUser)
            {
                sql.Append(" AND UserId = @UserId");
            }

            try
            {
                return await QueryFirstOrDefaultAsync<SettingDto>(sql.ToString(), parameters);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error retrieving setting {Name} for type {Type}", name, type);
                throw;
            }
        }
    }
}
