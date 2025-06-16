using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Base;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Core.Services
{
    /// <summary>
    /// Base class cho các CRUD App Services
    /// </summary>
    /// <typeparam name="TEntity">Entity type</typeparam>
    /// <typeparam name="TKey">Primary key type</typeparam>
    /// <typeparam name="TGetPagedInputDto">Input DTO cho phân trang</typeparam>
    /// <typeparam name="TGetPagedItemDto">Item DTO cho danh sách phân trang</typeparam>
    /// <typeparam name="TGetByIdDto">DTO cho chi tiết entity</typeparam>
    /// <typeparam name="TCreateInputDto">DTO cho tạo mới</typeparam>
    /// <typeparam name="TUpdateInputDto">DTO cho cập nhật</typeparam>
    [OrdAuth]
    public abstract partial class OrdCrudAppService<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto, TUpdateInputDto>
        : OrdAppServiceBase
        where TEntity : class, IEntity<TKey>
        where TGetPagedInputDto : PagedAndSortedResultRequestDto
        where TGetPagedItemDto : class, IHasEncodedId, IEntityDto<TKey>
        where TGetByIdDto : class
        where TCreateInputDto : class
        where TUpdateInputDto : class, IHasEncodedId
    {
        #region Services & Repositories

        /// <summary>
        /// Repository chính cho CRUD operations
        /// </summary>
        protected abstract IOrdCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto, TUpdateInputDto> CrudRepository { get; }

        /// <summary>
        /// Id encoder service để encode/decode ID
        /// </summary>
        protected IIdEncoderService<TEntity, TKey> IdEncoderService =>
            AppFactory.GetServiceDependency<IIdEncoderService<TEntity, TKey>>();

        #endregion

        protected override string GetBasePermissionName()
        {
            return typeof(TEntity).Name;
        }

        #region Helper Methods

        /// <summary>
        /// Convert encoded ID sang TKey
        /// </summary>
        protected TKey ConvertEncodeId(string encodedId)
        {
            return IdEncoderService.DecodeId(encodedId);
        }

        #endregion
    }

    /// <summary>
    /// Enum định nghĩa các loại CRUD operations
    /// </summary>
    public enum CrudOperationType
    {
        Base,
        Create,
        Read,
        GetPaged,
        GetDetail,
        Update,
        Delete
    }
}