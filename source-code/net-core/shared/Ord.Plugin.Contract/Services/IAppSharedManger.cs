using Ord.Plugin.Contract.Dtos;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Services
{
    public interface IAppSharedManger : IScopedDependency
    {
        Task<UserInformationDto?> GetUserCurrentAsync();
        Task<UserInformationDto?> GetUserAsync(Guid userId);
    }
}
