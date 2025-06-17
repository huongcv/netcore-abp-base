using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Utils;
using Syncfusion.DocIO.DLS;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Auditing;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Data
{
    /// <summary>
    /// Repository cơ sở cho các operations CRUD với hỗ trợ DTO mapping và validation
    /// Phần này chứa các thao tác đọc dữ liệu
    /// </summary>
    /// <typeparam name="TDbContext">Loại DbContext</typeparam>
    /// <typeparam name="TEntity">Loại Entity</typeparam>
    /// <typeparam name="TKey">Loại khóa chính</typeparam>
    /// <typeparam name="TGetPagedItemDto">DTO cho danh sách phân trang</typeparam>
    /// <typeparam name="TGetByIdDto">DTO cho chi tiết entity</typeparam>
    /// <typeparam name="TCreateInputDto">DTO cho tạo mới</typeparam>
    /// <typeparam name="TUpdateInputDto">DTO cho cập nhật</typeparam>
    public abstract partial class OrdCrudRepository<TDbContext, TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto>(IAppFactory factory)
        : OrdEfCoreRepository<TDbContext, TEntity, TKey>(factory), IOrdCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
            TUpdateInputDto>
        where TDbContext : IEfCoreDbContext
        where TEntity : class, IEntity<TKey>
        where TGetPagedInputDto : PagedAndSortedResultRequestDto
        where TGetPagedItemDto : class
        where TGetByIdDto : class, IEntityDto<TKey>
        where TCreateInputDto : class
        where TUpdateInputDto : class, IHasEncodedId
    {
        #region Properties và Services

        protected IIdEncoderService<TEntity, TKey> IdEncoderService =>
            AppFactory.GetServiceDependency<IIdEncoderService<TEntity, TKey>>();

        protected IDataFilter DataFilter => AppFactory.GetServiceDependency<IDataFilter>();
        protected IMapper Mapper => AppFactory.GetServiceDependency<IMapper>();

        #endregion

        #region Abstract Methods - Must be implemented by derived classes

        /// <summary>
        /// Tạo queryable cho danh sách phân trang
        /// </summary>
        /// <param name="queryable">Queryable gốc của entity</param>
        protected abstract Task<IQueryable<TEntity>> GetPagedQueryableAsync(IQueryable<TEntity> queryable, TGetPagedInputDto input);

        #endregion

        #region Virtual Methods - Can be overridden by derived classes

        /// <summary>
        /// Map từ Entity sang GetByIdDto
        /// </summary>
        /// <param name="entity">Entity cần map</param>
        /// <returns>DTO đã được map</returns>
        protected virtual Task<TGetByIdDto> MapToGetByIdDtoAsync(TEntity entity)
        {
            return Task.FromResult(ObjectMap<TEntity, TGetByIdDto>(entity));
        }

        /// <summary>
        /// Áp dụng sorting cho queryable
        /// </summary>
        /// <param name="queryable">Queryable gốc</param>
        /// <param name="input">Tham số đầu vào</param>
        /// <returns>Queryable đã được sort</returns>
        protected virtual Task<IQueryable<TGetPagedItemDto>> ApplySortingAsync(IQueryable<TGetPagedItemDto> queryable, TGetPagedInputDto input)
        {
            // Base implementation - derived classes should override for specific sorting logic
            return Task.FromResult(queryable);
        }

        #endregion

        #region Read Operations

        /// <summary>
        /// Lấy danh sách phân trang
        /// </summary>
        /// <param name="input">Tham số phân trang</param>
        /// <returns>Danh sách phân trang</returns>
        public virtual async Task<PagedResultDto<TGetPagedItemDto>> GetPagedListAsync(TGetPagedInputDto input)
        {
            // Lấy queryable gốc
            var queryable = (await GeneratePagedDtoQueryableAsync(input));
            // Đếm tổng số record
            var totalCount = await queryable.CountAsync();
            if (totalCount == 0)
            {
                return new PagedResultDto<TGetPagedItemDto>();
            }

            // Áp dụng sorting
            queryable = await ApplySortingAsync(queryable, input);

            // Áp dụng paging
            queryable = queryable
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var items = await queryable.ToListAsync();
            if (items?.Any() == true)
            {
                await ProcessPagedItemsAsync(items, input);
            }

            return new PagedResultDto<TGetPagedItemDto>(totalCount, items);
        }
        /// <summary>
        /// Tạo ra một truy vấn dạng IQueryable cho danh sách DTO  phân trang.
        /// override lại hàm này nếu where join ở các bảng khác
        /// <returns>Truy vấn IQueryable của DTO dùng cho danh sách phân trang</returns>
        protected virtual async Task<IQueryable<TGetPagedItemDto>> GeneratePagedDtoQueryableAsync(TGetPagedInputDto input)
        {  // Lấy queryable gốc
            var queryable = (await GetQueryableAsync()).AsNoTracking();
            queryable = ApplySortDefault(queryable, input);
            queryable = await GetPagedQueryableAsync(queryable, input);
            return await TransformToPagedDtoAsync(queryable, input);
        }

        /// <summary>
        /// Bổ sung dữ liệu liên quan hoặc xử lý thêm cho danh sách DTO đã phân trang
        /// </summary>
        /// <param name="items">Danh sách items</param>
        /// <param name="input">Tham số đầu vào</param>
        /// <returns>Task</returns>
        protected virtual async Task ProcessPagedItemsAsync(List<TGetPagedItemDto> items, TGetPagedInputDto input)
        {
            // Implementation mặc định - không làm gì
            await Task.CompletedTask;
        }

        /// <summary>
        /// Lấy thống kê số lượng theo trạng thái Active
        /// </summary>
        /// <param name="input">Tham số đầu vào</param>
        /// <returns>Thống kê số lượng</returns>
        public virtual async Task<CounterByIsActivedDto> GetCountGroupByIsActivedAsync(TGetPagedInputDto input)
        {
            if (!typeof(IHasActived).IsAssignableFrom(typeof(TEntity)))
            {
                return new CounterByIsActivedDto();
            }

            var queryable = (await GetQueryableAsync()).AsNoTracking();

            #region set IsActived = null cho input, mục đích bỏ qua trong where khi count

            var isActivedProp = typeof(TGetPagedInputDto).GetProperty("IsActived");
            if (isActivedProp != null && isActivedProp.PropertyType == typeof(bool?) && isActivedProp.CanWrite)
            {
                var currentValue = isActivedProp.GetValue(input) as bool?;
                if (currentValue.HasValue)
                {
                    isActivedProp.SetValue(input, null);
                }
            }

            #endregion

            queryable = await GetPagedQueryableAsync(queryable, input);
            var queryableDto = await TransformToPagedDtoAsync(queryable, input);
            var groupByQuery = await queryableDto.GroupBy(e => ((IHasActived)e).IsActived)
                .Select(x => new CounterByIsActivedItemDto()
                {
                    IsActived = x.Key,
                    TotalCount = x.Count()
                }).ToListAsync();

            return new CounterByIsActivedDto()
            {
                Items = groupByQuery
            };
        }

        /// <summary>
        /// Lấy entity theo encoded ID
        /// </summary>
        /// <param name="encodedId">ID đã được encode</param>
        /// <param name="isAsNoTracking">Có sử dụng AsNoTracking hay không</param>
        /// <returns>Entity hoặc null</returns>
        public virtual async Task<TEntity> GetByEncodedIdAsync(string encodedId, bool isAsNoTracking = true)
        {
            if (IdEncoderService.TryDecodeId(encodedId, out var id))
            {
                return await GetByIdAsync(id, isAsNoTracking);
            }

            return null;
        }

        /// <summary>
        /// Lấy chi tiết entity theo ID
        /// </summary>
        /// <param name="id">ID của entity</param>
        /// <returns>DTO chi tiết entity</returns>
        public virtual async Task<TGetByIdDto> GetDetailByIdAsync(TKey id)
        {
            TGetByIdDto dto = null;
            var entityQueryable = (await GetQueryableAsync()).AsNoTracking();
            var queryable = await GenerateDetailByIdQueryableAsync(entityQueryable);
            if (queryable != null)
            {
                dto = await queryable.Where(x => x.Id.Equals(id)).FirstOrDefaultAsync();
                if (dto == null)
                {
                    return null;
                }
                await CheckPermissionViewDetailAsync(dto);
            }
            else
            {
                var entity = await GetByIdAsync(id, true);
                if (entity == null)
                {
                    return null;
                }
                dto = await MapToGetByIdDtoAsync(entity);
            }
            if (dto != null)
            {
                if (dto is IHasEncodedId encodedDto and IEntityDto<TKey> entityDto)
                {
                    encodedDto.EncodedId = IdEncoderService.EncodeId(entityDto.Id);
                }
            }

            return dto;
        }

        protected virtual async Task<IQueryable<TGetByIdDto>> GenerateDetailByIdQueryableAsync(IQueryable<TEntity> entityQueryable)
        {
            // để null để chạy vào luồng mặc định GetByIdAsync
            return null;
        }
        /// <summary>
        /// Kiểm tra quyền xem dữ liệu của hàm GetByIdAsync
        /// throw NotAccessPermissionException nếu không được xem
        /// </summary>
        /// <param name="entity">Entity cần kiểm tra quyền</param>
        /// <returns>Task</returns>
        protected virtual Task CheckPermissionViewDetailAsync(TGetByIdDto detailDto)
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Lấy chi tiết entity theo encoded ID
        /// </summary>
        /// <param name="encodedId">ID đã được encode</param>
        /// <returns>DTO chi tiết entity</returns>
        public virtual async Task<TGetByIdDto> GetDetailByEncodedIdAsync(string encodedId)
        {
            if (IdEncoderService.TryDecodeId(encodedId, out var id))
            {
                return await GetDetailByIdAsync(id);
            }

            return null;
        }

        /// <summary>
        /// Kiểm tra entity có tồn tại theo encoded ID hay không
        /// </summary>
        /// <param name="encodeId">ID đã được encode</param>
        /// <returns>True nếu tồn tại</returns>
        public virtual async Task<bool> ExistsByEncodeIdAsync(string encodeId)
        {
            if (IdEncoderService.TryDecodeId(encodeId, out var id))
            {
                return await ExistsAsync(e => e.Id.Equals(id));
            }

            return false;
        }

        #endregion

        #region Helper Methods cho Read Operations

        /// <summary>
        /// Áp dụng sorting mặc định
        /// </summary>
        /// <param name="queryable">Queryable gốc</param>
        /// <param name="input">Tham số đầu vào</param>
        /// <returns>Queryable đã được sort</returns>
        protected IQueryable<TEntity> ApplySortDefault(IQueryable<TEntity> queryable, TGetPagedInputDto input)
        {
            // Áp dụng default sorting nếu không có sorting được chỉ định
            if (string.IsNullOrWhiteSpace(input.Sorting))
            {
                // Nếu entity có CreationTime, sort theo CreationTime desc
                if (typeof(IHasCreationTime).IsAssignableFrom(typeof(TEntity)))
                {
                    queryable = queryable.OrderByDescending(e => ((IHasCreationTime)e).CreationTime);
                }
                // Nếu entity có Id và Id là numeric, sort theo Id desc
                else if (IsNumericType(typeof(TKey)))
                {
                    queryable = queryable.OrderByDescending(e => e.Id);
                }
                // Fallback: sort theo Id
                else
                {
                    queryable = queryable.OrderBy(e => e.Id);
                }
            }

            return queryable;
        }

        /// <summary>
        /// Map Entity queryable sang DTO queryable sử dụng AutoMapper ProjectTo
        /// ProjectTo giúp optimize query bằng cách chỉ select các field cần thiết từ database
        /// </summary>
        /// <param name="entityQueryable">Entity queryable từ database</param>
        /// <param name="input">Tham số đầu vào (có thể dùng để custom mapping logic)</param>
        /// <returns>DTO queryable đã được map</returns>
        protected virtual async Task<IQueryable<TGetPagedItemDto>> TransformToPagedDtoAsync(IQueryable<TEntity> entityQueryable, TGetPagedInputDto input)
        {
            var mapper = AppFactory.GetServiceDependency<IMapper>();
            return entityQueryable.ProjectTo<TGetPagedItemDto>(mapper.ConfigurationProvider);
        }

        /// <summary>
        /// Kiểm tra xem type có phải là numeric type hay không
        /// </summary>
        /// <param name="type">Type cần kiểm tra</param>
        /// <returns>True nếu là numeric type</returns>
        private static bool IsNumericType(Type type)
        {
            // Remove nullable wrapper if exists
            type = Nullable.GetUnderlyingType(type) ?? type;

            return type == typeof(int) ||
                   type == typeof(long) ||
                   type == typeof(short) ||
                   type == typeof(byte) ||
                   type == typeof(uint) ||
                   type == typeof(ulong) ||
                   type == typeof(ushort) ||
                   type == typeof(sbyte) ||
                   type == typeof(decimal) ||
                   type == typeof(double) ||
                   type == typeof(float);
        }

        #endregion
    }
}