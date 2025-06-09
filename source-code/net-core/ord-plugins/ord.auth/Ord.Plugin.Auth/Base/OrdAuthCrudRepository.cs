using Microsoft.Extensions.Localization;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Data;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Validation;

namespace Ord.Plugin.Auth.Base
{
    public abstract class OrdAuthCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto>(IDbContextProvider<OrdPluginAuthDbContext> dbContextProvider) :
        OrdCrudRepository<OrdPluginAuthDbContext, TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto>(dbContextProvider) where TEntity : class, IEntity<TKey>
        where TGetPagedInputDto : PagedAndSortedResultRequestDto
        where TGetPagedItemDto : class, IHasEncodedId, IEntityDto<TKey>
        where TGetByIdDto : class
        where TCreateInputDto : class
        where TUpdateInputDto : class, IHasEncodedId
    {
        public IStringLocalizer<OrdAuthResource> L =>
            AppFactory.GetServiceDependency<IStringLocalizer<OrdAuthResource>>();

        protected void ThrowValidationEx(string key, params object[] formatArgs)
        {
            throw new AbpValidationException(L.GetLocalizedMessage(key, formatArgs));
        }
    }
}
