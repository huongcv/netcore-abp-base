using Ord.Domain.Entities.Auth;
using Ord.Plugin.Auth.Shared.Dtos.Settings;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IBlacklistedCrudRepository : IBasicRepository<BlacklistedEntity, int>
    {
        Task<PagedResultDto<BlacklistedDto>> GetPaged(string name, OrdPagedRequestDto input);
    }
}
