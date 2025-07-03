using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Enums;
using Ord.Plugin.Contract.Features.SystemSetting.Dto;
using Ord.Plugin.Contract.Repositories;
using System.Text;

namespace Ord.Plugin.Core.Repositories
{
    public class SettingSharedRepository(IAppFactory appFactory) : DapperDefaultDbRepository(appFactory), ISettingSharedRepository
    {
        private ILogger<SettingSharedRepository> Logger =>
            AppFactory.GetServiceDependency<ILogger<SettingSharedRepository>>();
        private IRepository<SettingEntity> SettingRepository => AppFactory.GetServiceDependency<IRepository<SettingEntity>>();


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

        public async Task<PagedResultDto<SystemSettingDto>> GetPaged(SystemSettingPagedInput input)
        {
            var queryable = await SettingRepository.GetQueryableAsync();
            IMapper mapper = AppFactory.GetServiceDependency<IMapper>();
            queryable = queryable.AsNoTracking()
                .WhereLikeText(input.TextSearch, x => new
                {
                    x.Name
                })
                .WhereIf(input.Type.HasValue, x => x.Type == input.Type)
                .WhereIf(input.IsActived.HasValue, x => x.IsActived == input.IsActived);
            var query = queryable.ProjectTo<SystemSettingDto>(mapper.ConfigurationProvider)
                .OrderBy(x => x.Name);
            var result = await query.GetPagedResultAsync(input);
            if (result.Items?.Any() == true)
            {
                var encodeService = AppFactory.GetServiceDependency<IIdEncoderService<SettingEntity, Guid>>();
                foreach (var item in result.Items)
                {
                    item.EncodedId = encodeService.EncodeId(item.Id);
                }
            }
            return result;
        }
    }
}
