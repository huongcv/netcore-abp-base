using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Core.Utils;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Auth.Repositories
{
    public class RoleCrudRepository(IDbContextProvider<OrdPluginAuthDbContext> dbContextProvider)
        : OrdAuthCrudRepository<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto>(dbContextProvider),
            IRoleCrudRepository
    {
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

        protected override Task ValidateBeforeCreateAsync(CreateRoleDto createInput)
        {
            throw new NotImplementedException();
        }

        protected override Task ValidateBeforeUpdateAsync(UpdateRoleDto updateInput, RoleEntity entityUpdate)
        {
            throw new NotImplementedException();
        }

        protected override Task ValidateBeforeDeleteAsync(RoleEntity entityDelete)
        {
            throw new NotImplementedException();
        }
    }
}
