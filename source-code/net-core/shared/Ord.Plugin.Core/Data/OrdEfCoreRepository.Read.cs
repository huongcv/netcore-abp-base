using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Data;
using System.Data;
using System.Linq.Expressions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Ord
{
    /// <summary>
    /// Repository EF Core cơ sở với các thao tác đọc dữ liệu
    /// </summary>
    /// <typeparam name="TDbContext">Loại DbContext</typeparam>
    /// <typeparam name="TEntity">Loại Entity</typeparam>
    /// <typeparam name="TKey">Loại khóa chính</typeparam>
    public partial class OrdEfCoreRepository<TDbContext, TEntity, TKey>(IAppFactory appFactory)
        : EfCoreRepository<TDbContext, TEntity, TKey>(appFactory.GetServiceDependency<IDbContextProvider<TDbContext>>())
        where TDbContext : IEfCoreDbContext
        where TEntity : class, IEntity<TKey>
    {
        #region Properties

        public IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
        public IDapperRepositoryBase DapperHelper { get; } = new DapperRepositoryBase<TDbContext>(appFactory);

        #endregion

        #region Queryable Methods

        /// <summary>
        /// Lấy queryable cho entity bất kỳ
        /// </summary>
        /// <typeparam name="T">Loại entity</typeparam>
        /// <param name="isNoTracking">Có sử dụng AsNoTracking hay không</param>
        /// <returns>IQueryable của entity</returns>
        protected async Task<IQueryable<T>> GetEntityQueryable<T>(bool isNoTracking = true)
            where T : class, IEntity
        {
            var dbContext = await GetDbContextAsync();
            return dbContext.Set<T>().AsNoTrackingIf(isNoTracking);
        }

        /// <summary>
        /// Lấy queryable cho các entity đang active
        /// </summary>
        /// <typeparam name="T">Loại entity có thuộc tính IsActived</typeparam>
        /// <param name="isNoTracking">Có sử dụng AsNoTracking hay không</param>
        /// <returns>IQueryable của entity active</returns>
        protected async Task<IQueryable<T>> GetActiveEntitiesQueryable<T>(bool isNoTracking = true)
            where T : class, IEntity, IHasActived
        {
            var queryable = await GetEntityQueryable<T>(isNoTracking);
            return queryable.Where(e => e.IsActived == true);
        }

        /// <summary>
        /// Lấy queryable với tùy chọn AsNoTracking
        /// </summary>
        /// <param name="isAsNoTracking">Có sử dụng AsNoTracking hay không</param>
        /// <returns>IQueryable của entity</returns>
        protected virtual async Task<IQueryable<TEntity>> GetQueryableAsNoTracking(bool isAsNoTracking)
        {
            var queryable = await GetQueryableAsync();
            return queryable.AsNoTrackingIf(isAsNoTracking);
        }

        #endregion

        #region Get Single Entity Methods

        /// <summary>
        /// Lấy entity theo ID với kiểm tra quyền
        /// </summary>
        /// <param name="id">ID của entity</param>
        /// <param name="isNoTracking">Có sử dụng AsNoTracking hay không</param>
        /// <returns>Entity hoặc null</returns>
        public async Task<TEntity> GetByIdAsync(TKey id, bool isNoTracking = false)
        {
            var queryable = (await GetQueryableAsync()).AsNoTrackingIf(isNoTracking);
            var entity = await queryable.Where(x => x.Id.Equals(id)).FirstOrDefaultAsync();
            await CheckPermissionViewEntity(entity);
            return entity;
        }

        /// <summary>
        /// Kiểm tra quyền xem dữ liệu của hàm GetByIdAsync
        /// throw NotAccessPermissionException nếu không được xem
        /// </summary>
        /// <param name="entity">Entity cần kiểm tra quyền</param>
        /// <returns>Task</returns>
        protected virtual Task CheckPermissionViewEntity(TEntity entity)
        {
            return Task.CompletedTask;
        }

        #endregion

        #region Existence Check Methods

        /// <summary>
        /// Kiểm tra entity có tồn tại theo điều kiện hay không
        /// </summary>
        /// <param name="predicate">Điều kiện kiểm tra</param>
        /// <returns>True nếu tồn tại, False nếu không</returns>
        public virtual async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var queryable = await GetQueryableAsync();
            return await queryable.AsNoTracking().AnyAsync(predicate);
        }

        /// <summary>
        /// Kiểm tra entity bất kỳ có tồn tại theo điều kiện hay không
        /// </summary>
        /// <typeparam name="T">Loại entity</typeparam>
        /// <param name="predicate">Điều kiện kiểm tra</param>
        /// <returns>True nếu tồn tại</returns>
        public virtual async Task<bool> ExistsEntityAsync<T>(Expression<Func<T, bool>> predicate)
            where T : class, IEntity
        {
            var queryable = await GetEntityQueryable<T>();
            return await queryable.AsNoTracking().AnyAsync(predicate);
        }

        /// <summary>
        /// Kiểm tra entity có tồn tại theo ID hay không
        /// </summary>
        /// <param name="id">ID cần kiểm tra</param>
        /// <returns>True nếu tồn tại</returns>
        public virtual async Task<bool> ExistsByIdAsync(TKey id)
        {
            return await ExistsAsync(e => e.Id.Equals(id));
        }

        #endregion

        #region Count Methods

        /// <summary>
        /// Đếm số lượng entity theo điều kiện
        /// </summary>
        /// <param name="predicate">Điều kiện lọc</param>
        /// <returns>Số lượng entity</returns>
        public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var queryable = await GetQueryableAsync();
            return await queryable.AsNoTracking().Where(predicate).CountAsync();
        }

        /// <summary>
        /// Đếm số lượng entity bất kỳ theo điều kiện
        /// </summary>
        /// <typeparam name="T">Loại entity</typeparam>
        /// <param name="predicate">Điều kiện lọc</param>
        /// <returns>Số lượng entity</returns>
        public virtual async Task<int> CountEntityAsync<T>(Expression<Func<T, bool>> predicate)
            where T : class, IEntity
        {
            var queryable = await GetEntityQueryable<T>();
            return await queryable.AsNoTracking().Where(predicate).CountAsync();
        }

        #endregion

        #region Get List as DTO Methods

        /// <summary>
        /// Lấy danh sách tất cả entity dưới dạng DTO
        /// </summary>
        /// <typeparam name="TDto">Loại DTO đầu ra</typeparam>
        /// <param name="selector">Selector để map từ entity sang DTO (optional)</param>
        /// <param name="isAsNoTracking">Có sử dụng AsNoTracking hay không</param>
        /// <returns>Danh sách DTO</returns>
        protected virtual async Task<List<TDto>> GetAllAsDtoAsync<TDto>(
            Expression<Func<TEntity, TDto>>? selector = null,
            bool isAsNoTracking = true)
            where TDto : class
        {
            var queryable = await GetQueryableAsNoTracking(isAsNoTracking);
            return await GetListAsDtoAsync(queryable, selector);
        }

        /// <summary>
        /// Lấy danh sách entity theo điều kiện dưới dạng DTO
        /// </summary>
        /// <typeparam name="TDto">Loại DTO đầu ra</typeparam>
        /// <param name="predicate">Điều kiện lọc</param>
        /// <param name="selector">Selector để map từ entity sang DTO (optional)</param>
        /// <param name="isAsNoTracking">Có sử dụng AsNoTracking hay không</param>
        /// <returns>Danh sách DTO</returns>
        protected virtual async Task<List<TDto>> GetListAsDtoAsync<TDto>(
            Expression<Func<TEntity, bool>> predicate,
            Expression<Func<TEntity, TDto>>? selector = null,
            bool isAsNoTracking = true)
            where TDto : class
        {
            var queryable = await GetQueryableAsNoTracking(isAsNoTracking);
            queryable = queryable.AsNoTrackingIf(isAsNoTracking).Where(predicate);
            return await GetListAsDtoAsync(queryable, selector);
        }

        /// <summary>
        /// Map queryable sang DTO list
        /// </summary>
        /// <typeparam name="TDto">Loại DTO đầu ra</typeparam>
        /// <param name="queryable">Queryable entity</param>
        /// <param name="selector">Selector để map từ entity sang DTO (optional)</param>
        /// <returns>Danh sách DTO</returns>
        protected virtual async Task<List<TDto>> GetListAsDtoAsync<TDto>(
            IQueryable<TEntity> queryable,
            Expression<Func<TEntity, TDto>>? selector = null)
            where TDto : class
        {
            if (selector != null)
            {
                return await queryable.Select(selector).ToListAsync();
            }
            var mapper = AppFactory.GetServiceDependency<IMapper>();
            return await queryable.ProjectTo<TDto>(mapper.ConfigurationProvider).ToListAsync();
        }

        #endregion

        #region Paged Query Methods

        /// <summary>
        /// Thực hiện query phân trang với post-processing
        /// </summary>
        /// <typeparam name="TDto">Loại DTO đầu ra</typeparam>
        /// <param name="queryable">Queryable DTO</param>
        /// <param name="input">Tham số phân trang</param>
        /// <param name="postProcessItemAsync">Action xử lý sau khi query (optional)</param>
        /// <returns>Kết quả phân trang</returns>
        protected async Task<PagedResultDto<TDto>> QueryPagedResultAsync<TDto>(
            IQueryable<TDto> queryable,
            PagedAndSortedResultRequestDto input,
            Func<TDto, Task> postProcessItemAsync = null)
            where TDto : class
        {
            var totalCount = await queryable.CountAsync();
            if (totalCount == 0)
            {
                return new PagedResultDto<TDto>();
            }

            var pagedQuery = queryable
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var dtos = await pagedQuery.ToListAsync();

            if (postProcessItemAsync != null)
            {
                foreach (var dto in dtos)
                {
                    await postProcessItemAsync(dto);
                }
            }

            return new PagedResultDto<TDto>(totalCount, dtos);
        }

        #endregion

        #region Object Mapping Helper Methods

        /// <summary>
        /// Map object từ source sang destination
        /// </summary>
        /// <typeparam name="TSource">Loại object nguồn</typeparam>
        /// <typeparam name="TDestination">Loại object đích</typeparam>
        /// <param name="source">Object nguồn</param>
        /// <returns>Object đích đã được map</returns>
        protected TDestination ObjectMap<TSource, TDestination>(TSource source)
        {
            return AppFactory.ObjectMap<TSource, TDestination>(source);
        }

        /// <summary>
        /// Map object từ source sang destination có sẵn
        /// </summary>
        /// <typeparam name="TSource">Loại object nguồn</typeparam>
        /// <typeparam name="TDestination">Loại object đích</typeparam>
        /// <param name="source">Object nguồn</param>
        /// <param name="destination">Object đích có sẵn</param>
        /// <returns>Object đích đã được map</returns>
        protected TDestination ObjectMap<TSource, TDestination>(TSource source, TDestination destination)
        {
            return AppFactory.ObjectMap(source, destination);
        }

        #endregion
    }
}