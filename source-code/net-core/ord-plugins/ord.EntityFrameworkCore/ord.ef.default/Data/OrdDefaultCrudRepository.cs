using Ord.EfCore.Default.EntityFrameworkCore;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Validation;

namespace Ord.EfCore.Default.Data
{
    public abstract class OrdDefaultCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto>(IAppFactory appFactory) :
        OrdCrudRepository<OrdDefaultDbContext, TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto>(appFactory) where TEntity : class, IEntity<TKey>
        where TGetPagedInputDto : PagedAndSortedResultRequestDto
        where TGetPagedItemDto : class, IHasEncodedId, IEntityDto<TKey>
        where TGetByIdDto : class, IEntityDto<TKey>
        where TCreateInputDto : class
        where TUpdateInputDto : class, IHasEncodedId
    {

        protected void ThrowValidationEx(string key, params object[] formatArgs)
        {
            throw new AbpValidationException(AppFactory.GetLocalizedMessage(key, formatArgs));
        }
        protected void ThrowEntityUsed(params object[] formatArgs)
        {
            // Gộp tên entity với các tham số khác
            var args = new object[] { GetEntityNameLocalized() }.Concat(formatArgs).ToArray();
            ThrowValidationEx("message.crud.not_delete_entity_used", args);
        }

        /// <summary>
        /// Lấy tên entity từ resource i18n dạng `entity.name.[EntityName]`.
        /// </summary>
        protected string GetEntityNameLocalized()
        {
            return AppFactory.GetLocalizedMessage("entity.name." + typeof(TEntity).Name);
        }
    }
}
