using Microsoft.EntityFrameworkCore;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Util;
using Ord.Plugin.Contract.Exceptions;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Auth.Repositories
{
    public class UserCrudRepository(IDbContextProvider<OrdPluginAuthDbContext> dbContextProvider)
        : OrdAuthCrudRepository<UserEntity, Guid, UserPagedInput, UserPagedDto, UserDetailDto, CreateUserDto, UpdateUserDto>(dbContextProvider),
            IUserCrudRepository
    {
        protected override async Task<IQueryable<UserEntity>> GetPagedQueryableAsync(IQueryable<UserEntity> queryable,
            UserPagedInput input)
        {
            queryable = queryable.WhereLikeText(input.TextSearch, x => new
            {
                x.UserName,
                x.PhoneNumber,
                x.Email,
            })
                .WhereIf(input.IsActived.HasValue, x => x.IsActived == input.IsActived);
            return queryable;
        }

        protected override async Task ValidateBeforeCreateAsync(CreateUserDto createInput)
        {
            var isUserNameUnique = await IsUserNameUniqueAsync(createInput.UserName);
            if (!isUserNameUnique)
            {
                ThrowValidationEx("username_already_exists", createInput.UserName);
            }
        }

        protected override async Task<UserEntity> MapToCreateEntityAsync(CreateUserDto createInput)
        {
            var entity = AppFactory.ObjectMap<CreateUserDto, UserEntity>(createInput);
            entity.PasswordHash = UserUtil.HashPassword(entity, createInput.Password);
            return entity;
        }

        protected override async Task ValidateBeforeUpdateAsync(UpdateUserDto updateInput, UserEntity entityUpdate)
        {

        }

        protected override async Task<UserEntity> MapToUpdateEntityAsync(UpdateUserDto updateInput, UserEntity entity)
        {
            await base.MapToUpdateEntityAsync(updateInput, entity);
            // must change pwd
            if (!string.IsNullOrEmpty(updateInput.Password))
            {
                entity.PasswordHash = UserUtil.HashPassword(entity, updateInput.Password);
            }

            return entity;
        }

        protected override async Task ValidateBeforeDeleteAsync(UserEntity entityDelete)
        {
            if (!AppFactory.CurrentTenantId.HasValue && entityDelete.UserName?.Equals("admin", StringComparison.OrdinalIgnoreCase) == true)
            {
                ThrowValidationEx("cannot_delete_admin_system");
            }
        }
        // kiểm trả quyền xem dữ liệu
        protected override async Task CheckPermissionViewEntity(UserEntity entity)
        {
            if (AppFactory.CurrentTenantId.HasValue && !AppFactory.CurrentTenantId.Value.Equals(entity.TenantId))
            {
                throw new NotAccessPermissionException();
            }
        }

        // Additional helper methods for specific validations
        private async Task<bool> IsUserNameUniqueAsync(string userName, Guid? excludeId = null)
        {
            var queryable = await GetQueryableAsync();
            var query = queryable.AsNoTracking()
                .Where(x => x.UserName == userName);

            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return !await query.AnyAsync();
        }

        public async Task<IEnumerable<UserPagedDto>> GetListComboOptions(bool includeUnActive = false)
        {
            return await GetListAsDtoAsync<UserPagedDto>(x => x.IsActived == true || includeUnActive,
                x => new UserPagedDto()
                {
                    Id = x.Id,
                    Name = x.Name,
                    PhoneNumber = x.PhoneNumber,
                    Email = x.Email,
                    UserName = x.UserName,
                    IsActived = x.IsActived,
                }, true);
        }

        public async Task<IEnumerable<Guid>> GetListRoleAssigned(Guid id)
        {
            var userRoleQuery = await GetEntityQueryable<UserRoleEntity>(true);
            return await userRoleQuery.Where(x => x.UserId == id).Select(x => x.RoleId).ToListAsync();
        }

        public async Task GrantPermissionForUser(Guid userId, string permissionName, bool isGranted)
        {
            await InsertOrUpdateAsync<PermissionUserEntity>(
                x => x.UserId == userId && x.PermissionName == permissionName,
                () => new PermissionUserEntity()
                {
                    UserId = userId,
                    PermissionName = permissionName,
                    IsGrant = isGranted
                },
                existing =>
                {
                    existing.IsGrant = isGranted;
                }
            );
        }
    }
}
