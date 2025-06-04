using Dapper;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract.Enums;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Setting;
using Ord.Plugin.Core.Data;
using System.Text;
using Volo.Abp.Caching;
using Volo.Abp.Domain.Repositories.Dapper;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Setting
{
    public class SettingService : DapperRepository<OrdPluginCoreDbContext>, ISettingService
    {
        private readonly IDistributedCache<string> _cache;
        private readonly IAppFactory _appFactory;
        private readonly ILogger<SettingService> _logger;
        private bool _isJsonValue = false;
      

        public SettingService(IDistributedCache<string> cache,
            IAppFactory appFactory,
            IDbContextProvider<OrdPluginCoreDbContext> dbContextProvider, 
            ILogger<SettingService> logger) : base(dbContextProvider)
        {
            _cache = cache;
            _appFactory = appFactory;
            _logger = logger;
        }

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
                keyCache.Append($"Tenant_{_appFactory.CurrentTenantId}");
            }
            if (type == SettingType.ForUser)
            {
                keyCache.Append($"User_{_appFactory.CurrentUserId}");
            }
            var settingValue = await _cache.GetOrAddAsync(keyCache.ToString(), async () =>
            {
                var sql = new StringBuilder($@"SELECT {(_isJsonValue==true? "JObjectValue" : "Value")} as Value,MustEncrypt from settings where IsDeleted = 0 and Type = @Type and IsActived = 1 ");
                sql.Append(" and Name = @Name ");
                if (type == SettingType.ForTenant)
                {
                    sql.Append(" and TenantId = @TenantId ");
                }
                if (type == SettingType.ForUser)
                {
                    sql.Append(" and UserId = @UserId ");
                }
                var connection = await GetDbConnectionAsync();
                var transaction = await GetDbTransactionAsync();
                var settingDto = await connection.QueryFirstOrDefaultAsync<SettingDto>(sql.ToString(), new
                {
                    Name = nameSetting,
                    Type = type,
                    TenantId = _appFactory.CurrentTenantId,
                    UserId = _appFactory.CurrentUserId
                }, transaction: transaction);
                if (settingDto == null)
                {
                    return string.Empty;
                }
                if (settingDto?.MustEncrypt == true)
                {
                    try
                    {
                        return _appFactory.StringEncryption.Decrypt(settingDto?.Value);
                    }
                    catch
                    {
                        return settingDto?.Value;
                    }
                }
                return settingDto?.Value;
            });
            // lấy mặc định trong Configuration json
            if (string.IsNullOrEmpty(settingValue) && type == SettingType.ForApp)
            {
                try
                {
                    return _appFactory.Configuration[nameSetting];
                }
                catch
                {
                    return string.Empty;
                }
            }
            return settingValue;
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
                _logger.LogWarning(ex, "Failed to convert setting value '{Value}' to type {Type}, returning default", value, typeof(T).Name);
                return defaultValue;
            }
        }

        
    }
}
