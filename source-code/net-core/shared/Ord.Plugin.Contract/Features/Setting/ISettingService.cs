using Ord.Plugin.Contract.Enums;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Setting
{
    public interface ISettingService : IScopedDependency
    {
        Task<T> GetForApp<T>(string nameSetting, T defaultValue = default);
        Task<T> GetForTenant<T>(string nameSetting, T defaultValue = default);
        Task<T> GetForTenantJsonValue<T>(string nameSetting, T defaultValue = default);
        Task<T> GetForUser<T>(string nameSetting, T defaultValue = default);
        /// <summary>
        /// Ưu tiên lấy setting theo cấp user -> tenant -> app -> setting.json
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="nameSetting"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        Task<T> GetCommonLevel<T>(string nameSetting, SettingType minLevelType = SettingType.ForUser, T defaultValue = default);

    }
}
