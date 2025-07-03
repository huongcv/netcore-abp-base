using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.SystemSetting;
using Ord.Plugin.Contract.Features.SystemSetting.Dto;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Services;

namespace Ord.Plugin.Auth.AppServices.Host
{
    [OrdAuth]
    public class HostSystemSettingAppService : OrdAppServiceBase
    {

        protected override string GetBasePermissionName()
        {
            AppFactory.CheckHostUser();
            return "AuthPlugin.HostSystemSetting";
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
