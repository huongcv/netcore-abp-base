using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Data;
using System.Data;
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
        protected async Task<IQueryable<T>> GetQueryableEntity<T>(bool isNoTracking = true)
            where T : class, IEntity
        {
            var dbContext = await GetDbContextAsync();
            return dbContext.Set<T>().AsNoTrackingIf(isNoTracking);
        }
        protected async Task<IQueryable<T>> GetActiveEntitiesQueryable<T>(bool isNoTracking = true)
            where T : class, IEntity, IHasActived
        {
            var queryable = await GetQueryableEntity<T>(isNoTracking);
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
        /// <summary>
        /// Lấy entity theo ID, ném exception nếu không tìm thấy
        /// </summary>
        /// <param name="id">ID của entity</param>
        /// <param name="includeDetails">Có include các thông tin chi tiết hay không</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Entity</returns>
        /// <exception cref="EntityNotFoundException">Khi không tìm thấy entity</exception>
        public virtual async Task<TEntity> GetByIdRequiredAsync(TKey id, bool includeDetails = true, CancellationToken cancellationToken = default)
        {
            var entity = await GetByIdAsync(id, includeDetails, cancellationToken);
            if (entity == null)
            {
                throw new EntityNotFoundException($"Entity with ID {id} not found");
            }
            return entity;
        }
        /// <summary>
        /// Lấy entity theo ID
        /// </summary>
        /// <param name="id">ID của entity</param>
        /// <param name="includeDetails">Có include các thông tin chi tiết hay không</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Entity hoặc null nếu không tìm thấy</returns>
        public virtual async Task<TEntity> GetByIdAsync(TKey id, bool includeDetails = true, CancellationToken cancellationToken = default)
        {
            return await GetAsync(id, includeDetails, cancellationToken);
        }

    }
}
