using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Data;
using Ord.Plugin.Core.Services.Security;
using System.Data;
using System.Linq.Expressions;
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


        #endregion
    }
}
