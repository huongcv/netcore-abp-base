using Microsoft.AspNetCore.Mvc;
using Ord.Domain.Enums;
using Ord.Plugin.Auth.Shared.Dtos.Settings;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Services;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    [NonController]
    public abstract class SettingAppService : OrdCrudAppService<SettingEntity, Guid, SettingPagedInput, SettingPagedDto, SettingDetailDto, CreateSettingDto, UpdateSettingDto>
    {
        protected override
            IOrdCrudRepository<SettingEntity, Guid, SettingPagedInput, SettingPagedDto, SettingDetailDto,
                CreateSettingDto, UpdateSettingDto> CrudRepository
            => AppFactory.GetServiceDependency<ISettingCrudRepository>();
        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.Setting";
        }

        public override Task<CommonResultDto<PagedResultDto<SettingPagedDto>>> GetPaged(SettingPagedInput input)
        {
            input.Type = GetSettingType();
            return base.GetPaged(input);
        }

        public override Task<CommonResultDto<SettingDetailDto>> CreateAsync(CreateSettingDto input)
        {
            input.Type = GetSettingType();
            return base.CreateAsync(input);
        }

        public override Task<CommonResultDto<SettingDetailDto>> UpdateAsync(UpdateSettingDto input)
        {
            input.Type = GetSettingType();
            return base.UpdateAsync(input);
        }

        protected abstract SettingType GetSettingType();
    }
}
