using Ord.Plugin.Auth.Shared.Dtos.Settings;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IBlacklistedCrudRepository : IScopedDependency
    {
        Task<PagedResultDto<BlacklistedDto>> GetPaged(string name, OrdPagedRequestDto input);
    }
}
