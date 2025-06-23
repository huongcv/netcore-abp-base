using Ord.Plugin.Auth.Shared.Entities;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IUserPermissionGrantedRepository : IBasicRepository<PermissionUserEntity, Guid>
    {
        Task<int> InsertMany(IEnumerable<PermissionUserEntity> entities);
        Task DeleteByUserId(Guid userId);
    }
}
