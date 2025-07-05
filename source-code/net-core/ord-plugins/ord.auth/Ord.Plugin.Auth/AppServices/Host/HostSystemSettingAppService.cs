using Microsoft.AspNetCore.Mvc;
using Ord.Domain.Entities.Auth;
using Ord.Domain.Enums;
using Ord.Plugin.Auth.Shared.Dtos.Settings;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.SystemSetting;
using Ord.Plugin.Contract.Features.SystemSetting.Dto;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Services;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices.Host
{
    [OrdAuth]
    public class HostSystemSettingAppService : SettingAppService
    {

        protected override string GetBasePermissionName()
        {
            AppFactory.CheckHostUser();
            return "System.HostSetting";
        }

        protected override SettingType GetSettingType()
        {
            return SettingType.ForApp;
        }

        public async Task<CommonResultDto<PasswordConfigDto>> GetPasswordConfig()
        {
            await CheckPermissionForOperation(CrudOperationType.Base);
            var setting = await GetSettingAsync<PasswordConfigDto>();
            return CommonResultDto<PasswordConfigDto>.Ok(setting);
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> UpdatePasswordConfig(PasswordConfigDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.Base);
            await UpdateSettingAsync(input);
            return CommonResultDto<bool>.Ok(true);
        }
        public async Task<CommonResultDto<SmtpMailingDto>> GetMailingSmtp()
        {
            await CheckPermissionForOperation(CrudOperationType.Base);
            var setting = await GetSettingAsync<SmtpMailingDto>();
            if (!string.IsNullOrEmpty(setting.Password))
            {
                setting.Password = "********";
            }
            return CommonResultDto<SmtpMailingDto>.Ok(setting);
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> UpdateMailingSmtpConfig(SmtpMailingDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.Base);
            await UpdateSettingAsync(input);
            return CommonResultDto<bool>.Ok(true);
        }

        #region Password black listed
        [HttpPost]
        public async Task<CommonResultDto<PagedResultDto<BlacklistedDto>>> GetPasswordBlacklisted(OrdPagedRequestDto input)
        {
            var repos = AppFactory.GetServiceDependency<IBlacklistedCrudRepository>();
            var paged = await repos.GetPaged("WEAK_PASSWORD", input);
            return CommonResultDto<PagedResultDto<BlacklistedDto>>.Ok(paged);
        }

        public async Task<CommonResultDto<int>> RemovePasswordBlacklisted(MultiEncodedIdDto input)
        {
            var repos = AppFactory.GetServiceDependency<IBlacklistedCrudRepository>();
            var idEncode = AppFactory.GetServiceDependency<IIdEncoderService<BlacklistedEntity, int>>();
            var ids = input.EncodedIds.Select(x => idEncode.DecodeId(x));
            await repos.DeleteManyAsync(ids);
            return CommonResultDto<int>.Ok(ids.Count());
        }
        public async Task<CommonResultDto<int>> InsertPasswordBlacklisted(InsertBulkBlacklistedDto input)
        {
            var repos = AppFactory.GetServiceDependency<IBlacklistedCrudRepository>();
            await repos.InsertBulk("WEAK_PASSWORD", input.Values);
            return CommonResultDto<int>.Ok(input.Values.Count);
        }
        public async Task<CommonResultDto<bool>> UpdatePasswordBlacklisted(UpdateBlacklistedDto input)
        {
            var repos = AppFactory.GetServiceDependency<IBlacklistedCrudRepository>();
            var idEncode = AppFactory.GetServiceDependency<IIdEncoderService<BlacklistedEntity, int>>();
            var id = idEncode.DecodeId(input.EncodedId);
            var entity = await repos.FindAsync(id);
            entity.Value = input.Value;
            await repos.UpdateAsync(entity);
            return CommonResultDto<bool>.Ok(true);
        }
        #endregion

        protected Task<TDto> GetSettingAsync<TDto>()
        where TDto : class
        {
            var service = AppFactory.GetServiceDependency<IHostSystemSettingManager<TDto>>();
            return service.GetSettingAsync();
        }
        protected Task UpdateSettingAsync<TDto>(TDto input)
            where TDto : class
        {
            var service = AppFactory.GetServiceDependency<IHostSystemSettingManager<TDto>>();
            return service.UpdateSettingAsync(input);
        }
    }
}
