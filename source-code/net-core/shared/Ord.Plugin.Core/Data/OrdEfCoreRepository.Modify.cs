using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore;

namespace Ord
{
    /// <summary>
    /// Repository EF Core cơ sở với các thao tác ghi dữ liệu (Create, Update, Delete)
    /// </summary>
    public partial class OrdEfCoreRepository<TDbContext, TEntity, TKey>
        where TDbContext : IEfCoreDbContext
        where TEntity : class, IEntity<TKey>
    {
        #region Single Update Methods

        /// <summary>
        /// Cập nhật entity theo ID với action
        /// </summary>
        /// <param name="id">ID của entity</param>
        /// <param name="updateAction">Action để cập nhật entity</param>
        /// <returns>Task</returns>
        public async Task UpdateById(TKey id, Action<TEntity> updateAction)
        {
            var repos = AppFactory.GetServiceDependency<IRepository<TEntity, TKey>>();
            var entity = await repos.GetAsync(id);
            updateAction(entity);
            await UpdateAsync(entity);
        }

        #endregion

        #region Batch Update Methods

        /// <summary>
        /// Cập nhật nhiều entity theo điều kiện với async action
        /// </summary>
        /// <param name="predicate">Điều kiện để lọc entity cần cập nhật</param>
        /// <param name="updateAction">Async action để cập nhật entity</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Danh sách entity đã cập nhật</returns>
        public virtual async Task<IEnumerable<TEntity>> UpdateByConditionAsync(
            Expression<Func<TEntity, bool>> predicate,
            Func<TEntity, Task> updateAction,
            CancellationToken cancellationToken = default)
        {
            var entities = await GetListAsync(predicate, cancellationToken: cancellationToken);
            foreach (var entity in entities)
            {
                await updateAction(entity);
                await UpdateAsync(entity, autoSave: false, cancellationToken);
            }

            await SaveChangesAsync(cancellationToken);
            return entities;
        }

        /// <summary>
        /// Cập nhật nhiều entity theo điều kiện với sync action
        /// </summary>
        /// <param name="predicate">Điều kiện để lọc entity cần cập nhật</param>
        /// <param name="updateAction">Sync action để cập nhật entity</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Danh sách entity đã cập nhật</returns>
        public virtual async Task<IEnumerable<TEntity>> UpdateByConditionAsync(
            Expression<Func<TEntity, bool>> predicate,
            Action<TEntity> updateAction,
            CancellationToken cancellationToken = default)
        {
            var entities = await GetListAsync(predicate, cancellationToken: cancellationToken);
            foreach (var entity in entities)
            {
                updateAction(entity);
                await UpdateAsync(entity, autoSave: false, cancellationToken);
            }

            await SaveChangesAsync(cancellationToken);
            return entities;
        }

        #endregion

        #region Insert Or Update Methods

        /// <summary>
        /// Thực hiện Insert hoặc Update entity dựa trên điều kiện tìm kiếm
        /// </summary>
        /// <typeparam name="T">Loại entity cần xử lý</typeparam>
        /// <param name="predicate">Điều kiện để tìm kiếm entity đã tồn tại trong database</param>
        /// <param name="createNewEntity">Function tạo entity mới khi không tìm thấy entity tồn tại</param>
        /// <param name="updateEntity">Action để cập nhật entity khi đã tồn tại (optional)</param>
        /// <param name="autoSave">Có tự động save hay không</param>
        /// <returns>Entity sau khi được insert hoặc update</returns>
        /// <exception cref="ArgumentNullException">Ném khi predicate hoặc createNewEntity là null</exception>
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
            Action<T> updateEntity,
            bool autoSave = false)
            where T : class, IEntity
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

        /// <summary>
        /// Thực hiện Insert hoặc Update entity hiện tại dựa trên điều kiện tìm kiếm
        /// </summary>
        /// <param name="predicate">Điều kiện để tìm kiếm entity đã tồn tại</param>
        /// <param name="createNewEntity">Function tạo entity mới</param>
        /// <param name="updateEntity">Action để cập nhật entity hiện có</param>
        /// <param name="autoSave">Có tự động save hay không</param>
        /// <returns>Entity sau khi được xử lý</returns>
        protected async Task<TEntity> InsertOrUpdateAsync(
            Expression<Func<TEntity, bool>> predicate,
            Func<TEntity> createNewEntity,
            Action<TEntity> updateEntity,
            bool autoSave = false)
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
        /// <param name="cancellationToken">Token để hủy operation</param>
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
                var existingEntity = await queryable.Where(itemPredicate)
                    .FirstOrDefaultAsync(cancellationToken: cancellationToken);

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

        /// <summary>
        /// Thực hiện insert hoặc update nhiều entities hiện tại dựa trên danh sách DTOs
        /// </summary>
        /// <typeparam name="TDto">Loại DTO đầu vào</typeparam>
        /// <param name="items">Danh sách các DTO cần xử lý</param>
        /// <param name="predicate">Hàm tạo expression để tìm entity tương ứng</param>
        /// <param name="createNewEntity">Hàm tạo entity mới từ DTO</param>
        /// <param name="updateEntity">Action để cập nhật entity hiện có từ DTO</param>
        /// <param name="autoSave">Có tự động save thay đổi hay không</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Danh sách các entities đã được xử lý</returns>
        protected async Task<List<TEntity>> InsertOrUpdateManyAsync<TDto>(
            IEnumerable<TDto> items,
            Func<TDto, Expression<Func<TEntity, bool>>> predicate,
            Func<TDto, TEntity> createNewEntity,
            Action<TDto, TEntity> updateEntity,
            bool autoSave = false,
            CancellationToken cancellationToken = default)
        {
            return await InsertOrUpdateManyAsync<TEntity, TDto>(items, predicate, createNewEntity, updateEntity,
                autoSave, cancellationToken);
        }

        #endregion
    }
}