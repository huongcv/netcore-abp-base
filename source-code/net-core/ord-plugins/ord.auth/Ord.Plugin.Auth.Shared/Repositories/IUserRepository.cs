using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Dtos;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IUserRepository : IBasicRepository<UserEntity, Guid>
    {
        Task<UserLoginDto?> GetLoginByUserName(string? userName);

        Task IncreaseAccessFailedCount(Guid id);
        Task SetLockUser(Guid id, DateTime lockoutEnd);
    }
}
