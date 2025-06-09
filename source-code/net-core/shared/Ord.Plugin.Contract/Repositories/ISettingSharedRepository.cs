using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract.Enums;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Repositories
{
    public interface ISettingSharedRepository : IScopedDependency
    {
        Task<SettingDto?> GetSettingAsync(string name, SettingType type, bool isJsonValue = false);
    }
}
