using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Ord.Plugin.Contract.Enums;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Contract.Setting;
using Ord.Plugin.Core.Data;
using System.Text;
using Volo.Abp.Caching;
using Volo.Abp.Domain.Repositories.Dapper;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Setting
{
    public class SettingSharedManger(
        IDistributedCache<string> cache,
        IAppFactory appFactory,
        IDbContextProvider<OrdPluginCoreDbContext> dbContextProvider,
        ILogger<SettingSharedManger> logger)
        : DapperRepository<OrdPluginCoreDbContext>(dbContextProvider), ISettingSharedManger
    {
        protected ISettingSharedRepository SettingRepos => appFactory.GetServiceDependency<ISettingSharedRepository>();
        private bool _isJsonValue = false;


        public Task<T> GetForApp<T>(string nameSetting, T defaultValue = default)
        {
            return GetForLevel(nameSetting, SettingType.ForApp, defaultValue);
        }

        public Task<T> GetForTenant<T>(string nameSetting, T defaultValue = default)
        {
            return GetForLevel(nameSetting, SettingType.ForTenant, defaultValue);
        }

        public Task<T> GetForTenantJsonValue<T>(string nameSetting, T defaultValue = default)
        {
            _isJsonValue = true;
            return GetForTenant(nameSetting, defaultValue);
        }

        public Task<T> GetForUser<T>(string nameSetting, T defaultValue = default)
        {
            return GetForLevel(nameSetting, SettingType.ForUser, defaultValue);
        }

        public async Task<T> GetCommonLevel<T>(string nameSetting, SettingType minLevelType = SettingType.ForUser, T defaultValue = default)
        {
            var types = new List<SettingType>()
            {
                SettingType.ForUser,
                SettingType.ForTenant,
                SettingType.ForApp
            };
            var valueSetting = string.Empty;
            foreach (var type in types)
            {
                if (type > minLevelType)
                {
                    continue;
                }
                valueSetting = await GetValueSetting(nameSetting, type);
                if (!string.IsNullOrEmpty(valueSetting))
                {
                    break;
                }
            }
            return (T)ConvertValue(valueSetting, defaultValue);
        }
        protected async Task<T> GetForLevel<T>(string nameSetting, SettingType type, T defaultValue = default)
        {
            var valueSetting = await GetValueSetting(nameSetting, type);
            return (T)ConvertValue(valueSetting, defaultValue);
        }
        protected async Task<string> GetValueSetting(string nameSetting, SettingType type)
        {
            var keyCache = new StringBuilder($@"Setting:Type_{type}:Name_{nameSetting}_{_isJsonValue}");
            if (type == SettingType.ForTenant)
            {
                keyCache.Append($"Tenant_{appFactory.CurrentTenantId}");
            }
            if (type == SettingType.ForUser)
            {
                keyCache.Append($"User_{appFactory.CurrentUserId}");
            }
            var settingValue = await cache.GetOrAddAsync(keyCache.ToString(), async () => await DoGetValueSettingAsync(nameSetting, type));
            // lấy mặc định trong Configuration json
            if (string.IsNullOrEmpty(settingValue) && type == SettingType.ForApp)
            {
                try
                {
                    return appFactory.Configuration[nameSetting];
                }
                catch
                {
                    return string.Empty;
                }
            }
            return settingValue;
        }

        protected async Task<string> DoGetValueSettingAsync(string nameSetting, SettingType type)
        {
            var settingDto = await SettingRepos.GetSettingAsync(nameSetting, type, _isJsonValue);
            if (settingDto == null)
            {
                return string.Empty;
            }
            if (settingDto?.MustEncrypt == true)
            {
                try
                {
                    return appFactory.StringEncryption.Decrypt(settingDto?.Value);
                }
                catch
                {
                    return settingDto?.Value;
                }
            }
            return settingDto?.Value;
        }
        private T ConvertValue<T>(string value, T defaultValue = default(T))
        {
            if (string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }
            try
            {
                var targetType = typeof(T);
                var underlyingType = Nullable.GetUnderlyingType(targetType) ?? targetType;

                return underlyingType.Name switch
                {
                    nameof(Int32) => (T)(object)int.Parse(value),
                    nameof(Boolean) => (T)(object)bool.Parse(value),
                    nameof(Int64) => (T)(object)long.Parse(value),
                    nameof(Single) => (T)(object)float.Parse(value),
                    nameof(Double) => (T)(object)double.Parse(value),
                    nameof(Decimal) => (T)(object)decimal.Parse(value),
                    nameof(String) => (T)(object)value,
                    _ => JsonConvert.DeserializeObject<T>(value) ?? defaultValue
                };
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to convert setting value '{Value}' to type {Type}, returning default", value, typeof(T).Name);
                return defaultValue;
            }
        }


    }
}
