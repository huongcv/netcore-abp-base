using Microsoft.EntityFrameworkCore;
using Ord.Domain.Enums;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Features.SystemSetting;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Core.Features.SystemSetting.Base
{
    public abstract class HostSystemSettingManager<TSettingDto> : SystemSettingManager<TSettingDto>, IHostSystemSettingManager<TSettingDto>
        where TSettingDto : class
    {

        public virtual Task<TSettingDto> GetSettingAsync()
        {
            var keyCache = GetKeyCache();
            return CacheService.GetOrAddAsync(keyCache, () => DoGetSettingAsync(null, SettingType.ForApp));

        }
        public virtual async Task UpdateSettingAsync(TSettingDto setting)
        {
            AppFactory.RemoveRedisCacheContainKey(GetKeyCache());
            var dtos = ConvertDtoToEntities(setting);
            foreach (var dto in dtos)
            {
                if (dto.MustEncrypt == true && !string.IsNullOrEmpty(dto.Value))
                {
                    dto.Value = StringEncryption.Encrypt(dto.Value);
                }
            }
            using (CurrentTenant.Change(null))
            {
                var queryable = await SettingRepository.GetQueryableAsync();
                var prefix = GetPrefixSettingName();

                var entities = await queryable
                    .Where(x => x.Type == SettingType.ForApp)
                    .Where(x => x.Name.StartsWith(prefix))
                    .ToListAsync();

                foreach (var dto in dtos)
                {
                    var entity = entities?.FirstOrDefault(x => x.Name == dto.Name);
                    if (entity != null)
                    {
                        // Update existing
                        entity.Type = SettingType.ForApp;
                        entity.MustEncrypt = dto.MustEncrypt;
                        entity.Value = dto.Value;
                        entity.IsActived = dto.IsActived;
                        entity.JObjectValue = dto.JObjectValue;
                        entity.IsStatic = true;

                        await SettingRepository.UpdateAsync(entity, autoSave: false);
                    }
                    else
                    {
                        // Insert new
                        var newEntity = new SettingEntity()
                        {
                            Name = dto.Name,
                            Type = SettingType.ForApp,
                            MustEncrypt = dto.MustEncrypt,
                            Value = dto.Value,
                            IsActived = dto.IsActived,
                            JObjectValue = dto.JObjectValue,
                            IsStatic = true
                        };

                        await SettingRepository.InsertAsync(newEntity, autoSave: false);
                    }
                }
            }
        }

        protected string GetKeyCache()
        {
            return "HostSystemSetting:" + GetPrefixSettingName().Replace(":", "_");
        }
    }
}
