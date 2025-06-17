using Ord.Plugin.Auth.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Data;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Validation;

namespace Ord.Plugin.Auth.Base
{
    public abstract class OrdAuthCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto>(IAppFactory appFactory) :
        OrdCrudRepository<OrdDefaultDbContext, TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto>(appFactory) where TEntity : class, IEntity<TKey>
        where TGetPagedInputDto : PagedAndSortedResultRequestDto
        where TGetPagedItemDto : class, IHasEncodedId, IEntityDto<TKey>
        where TGetByIdDto : class
        where TCreateInputDto : class
        where TUpdateInputDto : class, IHasEncodedId
    {

        protected void ThrowValidationEx(string key, params object[] formatArgs)
        {
            throw new AbpValidationException(AppFactory.GetLocalizedMessage(key, formatArgs));
        }
    }
}
