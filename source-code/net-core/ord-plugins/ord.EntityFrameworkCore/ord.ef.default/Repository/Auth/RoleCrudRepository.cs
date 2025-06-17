using Microsoft.EntityFrameworkCore;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Roles;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Auth.Repositories
{
    public partial class RoleCrudRepository(IAppFactory factory)
        : OrdDefaultCrudRepository<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto>(factory),
            IRoleCrudRepository
    {
        protected IRepository<PermissionGrantEntity, long> PermissionGrantRepository =>
            AppFactory.GetServiceDependency<IRepository<PermissionGrantEntity, long>>();

        protected IRepository<UserRoleEntity, int> UserRoleRepository =>
            AppFactory.GetServiceDependency<IRepository<UserRoleEntity, int>>();

        #region CRUD Overrides

        protected override async Task<IQueryable<RoleEntity>> GetPagedQueryableAsync(IQueryable<RoleEntity> queryable, RolePagedInput input)
        {
            queryable = queryable.WhereLikeText(input.TextSearch, x => new { x.Name, x.Code })
                                 .WhereIf(input.IsActived.HasValue, x => x.IsActived == input.IsActived);
            return queryable;
        }

        protected override async Task ValidateBeforeCreateAsync(CreateRoleDto createInput)
        {
            var isCodeUnique = await IsCodeUniqueAsync(createInput.Code);
            if (!isCodeUnique)
            {
                ThrowValidationEx("role_code_already_exists", createInput.Code);
            }
        }

        protected override async Task ValidateBeforeUpdateAsync(UpdateRoleDto updateInput, RoleEntity entityUpdate)
        {
            var isCodeUnique = await IsCodeUniqueAsync(updateInput.Code, entityUpdate.Id);
            if (!isCodeUnique)
            {
                ThrowValidationEx("role_code_already_exists", updateInput.Code);
            }
        }

        protected override async Task ValidateBeforeDeleteAsync(RoleEntity entityDelete)
        {
            var isInUse = await IsRoleInUseAsync(entityDelete.Id);
            if (isInUse)
            {
                ThrowValidationEx("role_is_in_use", entityDelete.Name);
            }
        }

        #endregion

        #region Get Methods

        public async Task<IEnumerable<RolePagedDto>> GetListComboOptions(bool includeUnActive = false)
        {
            return await GetListAsDtoAsync<RolePagedDto>(
                x => x.IsActived == true || includeUnActive,
                x => new RolePagedDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code,
                    IsActived = x.IsActived
                },
                true);
        }

        public async Task<List<string>> GetRolePermissionGrants(Guid roleId)
        {
            var queryable = await GetRolePermissionGrantsQueryableAsync(roleId);
            return await queryable.Select(x => x.PermissionName).ToListAsync();
        }

        /// <summary>
        /// Lấy queryable cho các permission grants của một role cụ thể
        /// </summary>
        public async Task<IQueryable<PermissionGrantEntity>> GetRolePermissionGrantsQueryableAsync(Guid roleId)
        {
            var queryable = await PermissionGrantRepository.GetQueryableAsync();
            return queryable.AsNoTracking()
                            .Where(x => x.ProviderName == PermissionGrantProviderName.Role && x.ProviderId == roleId);
        }

        #endregion

        #region Insert/Update Methods

        public async Task AssignPermissionsToRoleAsync(Guid roleId, IEnumerable<string> listOfPermission)
        {
            listOfPermission = listOfPermission.Distinct();
            var existingPermissions = await (await GetRolePermissionGrantsQueryableAsync(roleId))
                .Select(x => new { x.Id, x.PermissionName })
                .ToListAsync();

            var permissionsToDelete = existingPermissions
                .Where(x => !listOfPermission.Contains(x.PermissionName))
                .Select(x => x.Id)
                .ToList();

            if (permissionsToDelete.Count != 0)
            {
                await PermissionGrantRepository.DeleteAsync(x => permissionsToDelete.Contains(x.Id));
            }

            var existingPermissionNames = existingPermissions.Select(x => x.PermissionName).Distinct().ToHashSet();

            var newEntities = listOfPermission
                .Where(permission => !existingPermissionNames.Contains(permission))
                .Select(permission => new PermissionGrantEntity
                {
                    PermissionName = permission,
                    ProviderId = roleId,
                    ProviderName = PermissionGrantProviderName.Role,
                    TenantId = AppFactory.CurrentTenantId
                })
                .ToList();

            if (newEntities.Any(x => x.PermissionName.Contains("ReportShop")))
            {
                newEntities.Add(new PermissionGrantEntity
                {
                    PermissionName = "ReportShop",
                    ProviderId = roleId,
                    ProviderName = PermissionGrantProviderName.Role,
                    TenantId = AppFactory.CurrentTenantId
                });
            }

            if (newEntities.Count != 0)
            {
                await PermissionGrantRepository.InsertManyAsync(newEntities);
            }
        }

        #endregion

        #region Delete Methods

        public async Task ClearAllPermission(Guid roleId)
        {
            await PermissionGrantRepository.DeleteAsync(
                x => x.ProviderName == PermissionGrantProviderName.Role && x.ProviderId == roleId);
        }

        #endregion

        #region Private Helpers

        private async Task<bool> IsCodeUniqueAsync(string code, Guid? excludeId = null)
        {
            var queryable = await GetQueryableAsync();
            var query = queryable.AsNoTracking().Where(x => x.Code == code);

            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return !await query.AnyAsync();
        }

        /// <summary>
        /// Kiểm tra Role có đang được sử dụng (bởi user) không
        /// </summary>
        private async Task<bool> IsRoleInUseAsync(Guid roleId)
        {
            var queryable = await UserRoleRepository.GetQueryableAsync();
            return await queryable.AsNoTracking()
                                  .AnyAsync(x => x.RoleId == roleId);
        }

        #endregion

        #region User Management

        public async Task<PagedResultDto<UserInRoleDto>> GetUsersInRoleAsync(Guid roleId, GetUsersInRoleInput input)
        {
            var userQueryable = await GetEntityQueryable<UserEntity>();
            var userRoleQueryable = await GetEntityQueryable<UserRoleEntity>();
            userQueryable = userQueryable.WhereLikeText(input.TextSearch, x => new
            {
                x.UserName,
                x.Name,
                x.Email,
                x.PhoneNumber
            }).WhereIf(input.IsActived.HasValue, x => x.IsActived == input.IsActived);
            // Join Users với UserRoles để lấy users thuộc role cụ thể
            var query = from user in userQueryable
                        join userRole in userRoleQueryable on user.Id equals userRole.UserId
                        where userRole.RoleId == roleId
                        select new UserInRoleDto()
                        {
                            UserId = user.Id,
                            TenantId = user.TenantId,
                            UserName = user.UserName,
                            Name = user.Name,
                            Email = user.Email,
                            PhoneNumber = user.PhoneNumber,
                            IsActived = user.IsActived,
                            AssignedDate = userRole.CreationTime
                        };
            query = query.OrderByDescending(u => u.AssignedDate);
            var encodeSer = AppFactory.GetServiceDependency<IIdEncoderService<UserEntity, Guid>>();
            return await QueryPagedResultAsync(query,input, async (user) =>
            {
                user.UserEncodedId = encodeSer.EncodeId(user.UserId);
            });
        }



        #endregion

       
    }
}
