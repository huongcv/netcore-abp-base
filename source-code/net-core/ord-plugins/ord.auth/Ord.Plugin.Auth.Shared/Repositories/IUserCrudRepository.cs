using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract.Data;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IUserCrudRepository : IOrdCrudRepository<UserEntity, Guid, UserPagedInput, UserPagedDto, UserDetailDto, CreateUserDto, UpdateUserDto>
    {
    }
}
