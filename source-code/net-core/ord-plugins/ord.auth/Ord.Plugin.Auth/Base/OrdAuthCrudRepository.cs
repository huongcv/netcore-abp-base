using Ord.Plugin.Auth.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Data;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.EntityFrameworkCore;

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

    }
}
