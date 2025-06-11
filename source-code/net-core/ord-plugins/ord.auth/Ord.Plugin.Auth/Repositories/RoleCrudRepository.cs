using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Auth.Repositories
{
    public class RoleCrudRepository(IDbContextProvider<OrdPluginAuthDbContext> dbContextProvider)
        : OrdAuthCrudRepository<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto>(dbContextProvider),
            IRoleCrudRepository
    {
        protected IRepository<PermissionGrantEntity, long> PermissionGrantRepository =>
            AppFactory.GetServiceDependency<IRepository<PermissionGrantEntity, long>>();
        protected IRepository<UserRoleEntity, int> UserRoleRepository =>
            AppFactory.GetServiceDependency<IRepository<UserRoleEntity, int>>();
        protected override async Task<IQueryable<RoleEntity>> GetPagedQueryableAsync(IQueryable<RoleEntity> queryable, RolePagedInput input)
        {
            queryable = queryable.WhereLikeText(input.TextSearch, x => new
            {
                x.Name,
                x.Code
            })
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

        public async Task ClearAllPermission(Guid roleId)
        {
            await PermissionGrantRepository.DeleteAsync(
                x => x.ProviderName == PermissionGrantProviderName.Role && x.ProviderId == roleId);
        }

        public async Task AssignPermissionsToRoleAsync(Guid roleId, IEnumerable<string> listOfPermission)
        {
            var existingPermissions = await (await GetRolePermissionGrantsQueryableAsync(roleId))
                .Select(x => new { x.Id, x.PermissionName })
                .ToListAsync();

            var permissionsToDelete = existingPermissions
                .Where(x => !listOfPermission.Contains(x.PermissionName))
                .Select(x => x.Id)
                .ToList();

            if (permissionsToDelete.Count != 0)
            {
                await PermissionGrantRepository.DeleteAsync(
                    x => permissionsToDelete.Contains(x.Id));
            }

            var existingPermissionNames = existingPermissions.Select(x => x.PermissionName).ToHashSet();
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

        public async Task<List<string>> GetRolePermissionGrants(Guid roleId)
        {
            var queryable = await GetRolePermissionGrantsQueryableAsync(roleId);
            return await queryable.Select(x => x.PermissionName).ToListAsync();
        }

        private async Task<bool> IsCodeUniqueAsync(string code, Guid? excludeId = null)
        {
            var queryable = await GetQueryableAsync();
            var query = queryable.AsNoTracking()
                .Where(x => x.Code == code);

            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return !await query.AnyAsync();
        }
        /// <summary>
        /// Kiểm tra Role có đang được sử dụng hay không (có user nào được assign role này không)
        /// </summary>
        /// <param name="roleId">ID của Role cần kiểm tra</param>
        /// <returns>True nếu Role đang được sử dụng, False nếu không</returns>
        private async Task<bool> IsRoleInUseAsync(Guid roleId)
        {
            var queryable = await UserRoleRepository.GetQueryableAsync();
            var query = queryable.AsNoTracking()
                .Where(x => x.RoleId == roleId);
            return await query.AnyAsync();

        }
        /// <summary>
        /// Lấy queryable cho các permission grants của một role cụ thể
        /// </summary>
        /// <param name="roleId">ID của Role</param>
        /// <returns>IQueryable của PermissionGrantEntity cho role đó</returns>
        public async Task<IQueryable<PermissionGrantEntity>> GetRolePermissionGrantsQueryableAsync(Guid roleId)
        {
            var queryable = await PermissionGrantRepository.GetQueryableAsync();
            return queryable.AsNoTracking()
                .Where(x => x.ProviderName == PermissionGrantProviderName.Role && x.ProviderId == roleId);
        }

        public async Task<IEnumerable<RolePagedDto>> GetListComboOptions(bool includeUnActive = false)
        {
            return await GetListAsDtoAsync<RolePagedDto>(x => x.IsActived == true || includeUnActive,
                x => new RolePagedDto()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code,
                    IsActived = x.IsActived
                }, true);
        }
    }
}
