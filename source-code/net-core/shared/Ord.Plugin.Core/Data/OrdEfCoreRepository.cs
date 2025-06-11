using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Data;
using Pipelines.Sockets.Unofficial;
using System.Data;
using System.Linq.Expressions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Ord
{
    public class OrdEfCoreRepository<TDbContext, TEntity, TKey> : EfCoreRepository<TDbContext, TEntity, TKey>
        where TDbContext : IEfCoreDbContext
        where TEntity : class, IEntity<TKey>
    {

        private readonly IDbContextProvider<TDbContext> _dbContextProvider;
        public IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
        public IDapperDbContext DapperHelper { get; }
        public OrdEfCoreRepository(IDbContextProvider<TDbContext> dbContextProvider) : base(dbContextProvider)
        {
            _dbContextProvider = dbContextProvider;
            DapperHelper = new DapperDbcontext<TDbContext>(dbContextProvider);
        }
        protected async Task<IQueryable<T>> GetEntityQueryable<T>(bool isNoTracking = true)
            where T : class, IEntity
        {
            var dbContext = await GetDbContextAsync();
            return dbContext.Set<T>().AsNoTrackingIf(isNoTracking);
        }
        protected async Task<IQueryable<T>> GetActiveEntitiesQueryable<T>(bool isNoTracking = true)
            where T : class, IEntity, IHasActived
        {
            var queryable = await GetEntityQueryable<T>(isNoTracking);
            return queryable.Where(e => e.IsActived == true);
        }

        protected TDestination ObjectMap<TSource, TDestination>(TSource source)
        {
            return AppFactory.ObjectMap<TSource, TDestination>(source);
        }

        protected TDestination ObjectMap<TSource, TDestination>(TSource source, TDestination destination)
        {
            return AppFactory.ObjectMap(source, destination);
        }
        public async Task UpdateById(TKey id, Action<TEntity> updateAction)
        {
            var repos = AppFactory.GetServiceDependency<IRepository<TEntity, TKey>>();
            var entity = await repos.GetAsync(id);
            updateAction(entity);
            await UpdateAsync(entity);
        }

        public async Task<TEntity> GetByIdAsync(TKey id, bool isNoTracking = false)
        {
            var queryable = (await GetQueryableAsync()).AsNoTrackingIf(isNoTracking);
            var entity = await queryable.Where(x => x.Id.Equals(id)).FirstOrDefaultAsync();
            await CheckPermissionViewEntity(entity);
            return entity;
        }
        /// <summary>
        /// Kiểm trả quyền xem dữ liệu của hàm GetByIdAsync
        /// throw NotAccessPermissionException nếu không được xem
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        protected virtual Task CheckPermissionViewEntity(TEntity entity)
        {
            return Task.CompletedTask;
        }

        #region Helper Methods
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


        /// <summary>
        /// Lấy danh sách tất cả entity dưới dạng DTO
        /// </summary>
        /// <param name="cancellationToken">Token để hủy operation</param>
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
        /// <param name="predicate">Điều kiện lọc</param>
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

        protected virtual async Task<IQueryable<TEntity>> GetQueryableAsNoTracking(bool isAsNoTracking)
        {
            var queryable = await GetQueryableAsync();
            return queryable.AsNoTrackingIf(isAsNoTracking);
        }
        /// <summary>
        /// Lấy danh sách entity theo điều kiện dưới dạng DTO
        /// </summary>
        /// <param name="predicate">Điều kiện lọc</param>
        /// <returns>Danh sách DTO</returns>
        public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var queryable = await GetQueryableAsync();
            return await queryable.AsNoTracking().Where(predicate).CountAsync();
        }
        public virtual async Task<int> CountEntityAsync<T>(Expression<Func<T, bool>> predicate)
            where T : class, IEntity
        {
            var queryable = await GetEntityQueryable<T>();
            return await queryable.AsNoTracking().Where(predicate).CountAsync();
        }

        #endregion
        /// <summary>
        /// Hàm base thực hiện Insert hoặc Update entity dựa trên điều kiện tìm kiếm
        /// </summary>
        /// <typeparam name="T">Loại entity cần xử lý</typeparam>
        /// <param name="findPredicate">Function để tìm kiếm entity đã tồn tại trong database</param>
        /// <param name="createNewEntity">Function tạo entity mới khi không tìm thấy entity tồn tại</param>
        /// <param name="updateEntity">Action để cập nhật entity khi đã tồn tại (optional)</param>
        /// <returns>Entity sau khi được insert hoặc update</returns>
        /// <exception cref="ArgumentNullException">Ném khi findPredicate hoặc createNewEntity là null</exception>
        /// <remarks>
        /// Hàm này sẽ:
        /// 1. Tìm kiếm entity dựa trên điều kiện predicate
        /// 2. Nếu entity đã tồn tại: cập nhật thông qua updateEntity action và gọi UpdateAsync
        /// 3. Nếu entity chưa tồn tại: tạo mới thông qua createNewEntity function và gọi InsertAsync
        /// 4. Trả về entity đã được xử lý
        /// </remarks>
        protected async Task<T> InsertOrUpdateAsync<T>(
            Expression<Func<T, bool>> predicate,
            Func<T> createNewEntity,
            Action<T> updateEntity, bool autoSave = false) where T : class, IEntity
        {
            var repository = AppFactory.GetServiceDependency<IRepository<T>>();
            var queryable = await repository.GetQueryableAsync();

            var existingEntity = await queryable.Where(predicate).FirstOrDefaultAsync();

            if (existingEntity != null)
            {
                // Nếu entity đã tồn tại, cập nhật nó
                updateEntity?.Invoke(existingEntity);
                await repository.UpdateAsync(existingEntity, autoSave);
                return existingEntity;
            }
            // Nếu entity chưa tồn tại, tạo mới
            var newEntity = createNewEntity();
            await repository.InsertAsync(newEntity, autoSave);
            return newEntity;
        }

        protected async Task<TEntity> InsertOrUpdateAsync(
            Expression<Func<TEntity, bool>> predicate,
            Func<TEntity> createNewEntity,
            Action<TEntity> updateEntity, bool autoSave = false)
        {
            return await InsertOrUpdateAsync<TEntity>(predicate, createNewEntity, updateEntity, autoSave);
        }

        /// <summary>
        /// Thực hiện insert hoặc update nhiều entities dựa trên danh sách DTOs
        /// </summary>
        /// <typeparam name="TEnt">Loại entity cần xử lý</typeparam>
        /// <typeparam name="TDto">Loại DTO đầu vào</typeparam>
        /// <param name="items">Danh sách các DTO cần xử lý</param>
        /// <param name="predicate">Hàm tạo expression để tìm entity tương ứng cho mỗi DTO</param>
        /// <param name="createNewEntity">Hàm tạo entity mới từ DTO</param>
        /// <param name="updateEntity">Action để cập nhật entity hiện có từ DTO</param>
        /// <param name="autoSave">Có tự động save thay đổi hay không</param>
        /// <returns>Danh sách các entities đã được xử lý</returns>
        protected async Task<List<TEnt>> InsertOrUpdateManyAsync<TEnt, TDto>(
            IEnumerable<TDto> items,
            Func<TDto, Expression<Func<TEnt, bool>>> predicate,
            Func<TDto, TEnt> createNewEntity,
            Action<TDto, TEnt> updateEntity,
            bool autoSave = false,
            CancellationToken cancellationToken = default)
            where TEnt : class, IEntity
        {
            // Kiểm tra danh sách đầu vào
            if (items?.Any() != true)
            {
                return new List<TEnt>();
            }
            // Lấy repository cho entity
            var repository = AppFactory.GetServiceDependency<IRepository<TEnt>>();
            var resultEntities = new List<TEnt>();

            // Xử lý từng item trong danh sách
            foreach (var item in items)
            {
                // Tạo predicate động cho item hiện tại
                var itemPredicate = predicate(item);

                // Lấy queryable và tìm entity tương ứng
                var queryable = await repository.GetQueryableAsync();
                var existingEntity = await queryable.Where(itemPredicate).FirstOrDefaultAsync(cancellationToken: cancellationToken);

                if (existingEntity != null)
                {
                    // Nếu entity đã tồn tại, cập nhật nó
                    updateEntity?.Invoke(item, existingEntity);
                    await repository.UpdateAsync(existingEntity, false, cancellationToken); // Không save ngay
                    resultEntities.Add(existingEntity);
                }
                else
                {
                    // Nếu entity chưa tồn tại, tạo mới
                    var newEntity = createNewEntity(item);
                    await repository.InsertAsync(newEntity, false, cancellationToken); // Không save ngay
                    resultEntities.Add(newEntity);
                }
            }

            // Save tất cả thay đổi cùng lúc nếu autoSave = true
            if (autoSave)
            {
                await SaveChangesAsync(cancellationToken);
            }

            return resultEntities;
        }

        protected async Task<List<TEntity>> InsertOrUpdateManyAsync<TDto>(IEnumerable<TDto> items,
            Func<TDto, Expression<Func<TEntity, bool>>> predicate,
            Func<TDto, TEntity> createNewEntity,
            Action<TDto, TEntity> updateEntity,
            bool autoSave = false,
            CancellationToken cancellationToken = default)
        {
            return await InsertOrUpdateManyAsync<TEntity, TDto>(items, predicate, createNewEntity, updateEntity, autoSave, cancellationToken);
        }

        protected async Task<PagedResultDto<TDto>> QueryPagedResultAsync<TDto>(IQueryable<TDto> queryable,
            PagedAndSortedResultRequestDto input,
            Func<TDto, Task> postProcessItemAsync = null)
        where TDto : class
        {
            var totalCount = await queryable.CountAsync();
            if (totalCount == 0)
            {
                return new();
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
    }
}
