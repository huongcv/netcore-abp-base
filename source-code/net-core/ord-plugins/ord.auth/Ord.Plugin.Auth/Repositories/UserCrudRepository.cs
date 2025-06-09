using Ord.Contract.Entities;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Core.Utils;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Validation;

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

        protected override Task ValidateBeforeCreateAsync(CreateUserDto createInput)
        {
            throw new AbpValidationException("");
            throw new NotImplementedException();
        }

        protected override Task ValidateBeforeUpdateAsync(UpdateUserDto updateInput, UserEntity entityUpdate)
        {
            throw new NotImplementedException();
        }

        protected override Task ValidateBeforeDeleteAsync(UserEntity entityUpdate)
        {
            throw new NotImplementedException();
        }

        
    }
}
