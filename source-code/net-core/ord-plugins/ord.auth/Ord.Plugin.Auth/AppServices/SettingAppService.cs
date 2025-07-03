using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Ord.Domain.Enums;
using Ord.Plugin.Auth.Shared.Dtos.Settings;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Services;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Security.Encryption;
using Volo.Abp.Validation;

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
        private IStringEncryptionService EncryptionService =>
            AppFactory.GetServiceDependency<IStringEncryptionService>();
        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.Setting";
        }

        public override Task<CommonResultDto<PagedResultDto<SettingPagedDto>>> GetPaged(SettingPagedInput input)
        {
            input.Type = GetSettingType();
            input.IsStatic = false;
            return base.GetPaged(input);
        }

        public override async Task<CommonResultDto<SettingDetailDto>> GetById(EncodedIdDto input)
        {
            var dto = await base.GetById(input);
            if (dto.IsSuccessful && dto.Data != null)
            {
                if (!string.IsNullOrEmpty(dto.Data.JObjectValue))
                {
                    dto.Data.UsingJson = true;
                    dto.Data.Value = dto.Data.JObjectValue;
                }
                if (dto.Data.MustEncrypt == true)
                {
                    dto.Data.Value = EncryptionService.Decrypt(dto.Data.Value);
                }
            }


            return dto;
        }

        public override Task<CommonResultDto<SettingDetailDto>> CreateAsync(CreateSettingDto input)
        {
            input.Type = GetSettingType();
            ConvertJsonValue(input);
            return base.CreateAsync(input);
        }

        public override Task<CommonResultDto<SettingDetailDto>> UpdateAsync(UpdateSettingDto input)
        {
            input.Type = GetSettingType();
            ConvertJsonValue(input);
            return base.UpdateAsync(input);
        }

        protected void ConvertJsonValue(SettingCrudBase input)
        {
            if (input.UsingJson)
            {
                try
                {
                    var objectValue = JsonConvert.DeserializeObject(input.Value);
                }
                catch
                {
                    throw new AbpValidationException("Giá trị không phải json");
                }

                input.JObjectValue = input.Value;
                input.Value = null;
                input.MustEncrypt = false;
            }
        }
        protected abstract SettingType GetSettingType();
    }
}
