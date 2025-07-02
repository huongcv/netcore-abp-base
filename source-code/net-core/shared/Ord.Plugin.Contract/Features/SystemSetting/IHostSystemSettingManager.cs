using Ord.Plugin.Auth.Shared.Dtos;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Contract.Features.SystemSetting
{
    public interface IHostSystemSettingManager<TSettingDto> : IDomainService
    where TSettingDto : class
    {
        Task<TSettingDto> GetSettingAsync();
        Task UpdateSettingAsync(TSettingDto setting);
        TSettingDto GetDefaultValue();
    }
}
