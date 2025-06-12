using Microsoft.EntityFrameworkCore;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Factories;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Auth.Repositories
{
    public partial class UserRepository(IAppFactory factory)
        : OrdAuthBaseRepository<UserEntity, Guid>(factory), IUserRepository
    {
        public async Task<UserLoginDto?> GetLoginByUserName(string? userName)
        {
            var queryable = await GetUserQueryable();
            var userEntity = await queryable
                .Where(x => x.UserName == userName)
                .FirstOrDefaultAsync();
            return AppFactory.ObjectMap<UserEntity, UserLoginDto>(userEntity);
        }

        #region Update or create

        public async Task IncreaseAccessFailedCount(Guid id)
        {
            await UpdateById(id, user =>
            {
                user.AccessFailedCount = user.AccessFailedCount++;
            });
        }
        public async Task SetLockUser(Guid id, DateTime lockoutEnd)
        {
            await UpdateById(id, user =>
            {
                user.LockoutEnd = lockoutEnd;
            });
        }

        #endregion
    }
}
