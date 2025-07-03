using Microsoft.EntityFrameworkCore;
using Ord.Domain.Enums;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Features.SystemSetting.Dto;
using Ord.Plugin.Contract.Setting;
using Ord.Plugin.Core.Base;
using Volo.Abp.Caching;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Encryption;
namespace Ord.Plugin.Core.Features.SystemSetting.Base
{
    public abstract class SystemSettingManager<TSettingDto> : OrdManagerBase
        where TSettingDto : class
    {
        protected IRepository<SettingEntity> SettingRepository => AppFactory.GetServiceDependency<IRepository<SettingEntity>>();
        protected ISettingSharedManger SettingManger => AppFactory.GetServiceDependency<ISettingSharedManger>();
        protected IStringEncryptionService StringEncryption => AppFactory.GetServiceDependency<IStringEncryptionService>();
        protected IDistributedCache<TSettingDto> CacheService => AppFactory.GetServiceDependency<IDistributedCache<TSettingDto>>();


        protected virtual async Task<TSettingDto> DoGetSettingAsync(Guid? tenantId)
        {

            using (CurrentTenant.Change(tenantId))
            {
                var queryable = await SettingRepository.GetQueryableAsync();
                var prefix = GetPrefixSettingName();
                var entities = await queryable.AsNoTracking()
                    .Where(x => x.Type == SettingType.ForApp)
                    .Where(x => x.Name.StartsWith(prefix))
                    .Select(x => new SystemSettingDto()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        MustEncrypt = x.MustEncrypt,
                        Value = x.Value,
                        IsActived = x.IsActived
                    })
                    .ToListAsync();
                foreach (var entity in entities)
                {
                    if (entity.MustEncrypt == true && !string.IsNullOrEmpty(entity.Value))
                    {
                        try
                        {
                            // giải mã value
                            entity.DecryptValue = StringEncryption.Decrypt(entity.Value);
                        }
                        catch
                        {
                            entity.DecryptValue = null;
                            //
                        }

                    }
                }
                return await ConvertEntitiesToDto(entities);
            }
        }

        protected async Task<string?> GetJObjectValue(Guid id)
        {
            var dataFilter = AppFactory.GetServiceDependency<IDataFilter>();
            using (dataFilter.Disable<IMultiTenant>())
            {
                var queryable = await SettingRepository.GetQueryableAsync();
                return await queryable.Where(x => x.Id == id).Select(x => x.JObjectValue).FirstOrDefaultAsync();
            }
        }

        protected int GetInt(Dictionary<string, string> dict, string keySuffix, int defaultValue)
        {
            var key = $"{GetPrefixSettingName()}.{keySuffix}";
            return dict.TryGetValue(key, out var val) && int.TryParse(val, out var result)
                ? result
                : defaultValue;
        }

        protected bool GetBool(Dictionary<string, string> dict, string keySuffix, bool defaultValue)
        {
            var key = $"{GetPrefixSettingName()}.{keySuffix}";
            return dict.TryGetValue(key, out var val) && bool.TryParse(val, out var result)
                ? result
                : defaultValue;
        }
        protected string GetString(Dictionary<string, string> dict, string keySuffix, string defaultValue = "")
        {
            var key = $"{GetPrefixSettingName()}.{keySuffix}";
            return dict.TryGetValue(key, out var val)
                ? val
                : defaultValue;
        }
        protected SystemSettingDto CreateSetting(string keySuffix, string value, bool mustEncrypt = false)
        {
            return new SystemSettingDto
            {
                Name = $"{GetPrefixSettingName()}.{keySuffix}",
                Value = value,
                MustEncrypt = mustEncrypt,
                IsActived = true
            };
        }
        protected SystemSettingDto CreateJObjectSetting(string jObjectValue)
        {
            return new SystemSettingDto
            {
                Name = $"{GetPrefixSettingName()}",
                JObjectValue = jObjectValue,
                IsActived = true
            };
        }
        protected abstract string GetPrefixSettingName();
        protected abstract Task<TSettingDto> ConvertEntitiesToDto(IEnumerable<SystemSettingDto> settingEntities);
        protected abstract IEnumerable<SystemSettingDto> ConvertDtoToEntities(TSettingDto settingDto);
        public abstract TSettingDto GetDefaultValue();
    }
}
