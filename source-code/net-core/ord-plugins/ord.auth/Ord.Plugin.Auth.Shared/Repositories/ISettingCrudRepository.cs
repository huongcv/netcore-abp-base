using Ord.Plugin.Auth.Shared.Dtos.Settings;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Data;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface ISettingCrudRepository : IOrdCrudRepository<SettingEntity, Guid, SettingPagedInput, SettingPagedDto, SettingDetailDto, CreateSettingDto, UpdateSettingDto>
    {
    }
}
