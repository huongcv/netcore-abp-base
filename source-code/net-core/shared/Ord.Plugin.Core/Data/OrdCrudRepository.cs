using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Services.Security;
using System.Linq.Expressions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Data
{
    /// <summary>
    /// Repository cơ sở cho các operations CRUD với hỗ trợ DTO mapping và validation
    /// </summary>
    /// <typeparam name="TDbContext">Loại DbContext</typeparam>
    /// <typeparam name="TEntity">Loại Entity</typeparam>
    /// <typeparam name="TKey">Loại khóa chính</typeparam>
    /// <typeparam name="TGetPagedItemDto">DTO cho danh sách phân trang</typeparam>
    /// <typeparam name="TGetByIdDto">DTO cho chi tiết entity</typeparam>
    /// <typeparam name="TCreateInputDto">DTO cho tạo mới</typeparam>
    /// <typeparam name="TUpdateInputDto">DTO cho cập nhật</typeparam>
    public abstract class OrdCrudRepository<TDbContext, TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto>(IDbContextProvider<TDbContext> dbContextProvider)
        : OrdEfCoreRepository<TDbContext, TEntity, TKey>(dbContextProvider), IOrdCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
            TUpdateInputDto>
        where TDbContext : IEfCoreDbContext
        where TEntity : class, IEntity<TKey>
        where TGetPagedInputDto : PagedAndSortedResultRequestDto
        where TGetPagedItemDto : class, IHasEncodedId, IEntityDto<TKey>
        where TGetByIdDto : class
        where TCreateInputDto : class
        where TUpdateInputDto : class, IHasEncodedId

    {
        protected IIdEncoderService<TEntity, TKey> IdEncoderService =>
            AppFactory.GetServiceDependency<IIdEncoderService<TEntity, TKey>>();
        #region Abstract Methods - Must be implemented by derived classes

        /// <summary>
        /// Tạo queryable cho danh sách phân trang với mapping sang DTO
        /// </summary>
        /// <param name="queryable">Queryable gốc của entity</param>
        protected abstract Task<IQueryable<TEntity>> GetPagedQueryableAsync(IQueryable<TEntity> queryable, TGetPagedInputDto input);

        /// <summary>
        /// Validate dữ liệu trước khi tạo mới
        /// </summary>
        /// <param name="createInput">Dữ liệu đầu vào cho tạo mới</param>
        /// <returns>Task hoàn thành</returns>
        protected abstract Task ValidateBeforeCreateAsync(TCreateInputDto createInput);

        /// <summary>
        /// Validate dữ liệu trước khi cập nhật
        /// </summary>
        /// <param name="updateInput">Dữ liệu đầu vào cho cập nhật</param>
        /// <param name="entityUpdate">Entity sẽ được cập nhật</param>
        /// <returns>Task hoàn thành</returns>
        protected abstract Task ValidateBeforeUpdateAsync(TUpdateInputDto updateInput, TEntity entityUpdate);
        /// <summary>
        /// Validate dữ liệu trước khi cập nhật
        /// </summary>
        /// <param name="updateInput">Dữ liệu đầu vào cho cập nhật</param>
        /// <param name="entityUpdate">Entity sẽ được cập nhật</param>
        /// <returns>Task hoàn thành</returns>
        protected abstract Task ValidateBeforeDeleteAsync(TEntity entityUpdate);

        #endregion

        #region Virtual Methods - Can be overridden by derived classes

        /// <summary>
        /// Map từ CreateInputDto sang Entity
        /// </summary>
        /// <param name="createInput">DTO đầu vào</param>
        /// <returns>Entity đã được map</returns>
        protected virtual TEntity MapToEntity(TCreateInputDto createInput)
        {
            return ObjectMap<TCreateInputDto, TEntity>(createInput);
        }

        /// <summary>
        /// Map từ UpdateInputDto sang Entity
        /// </summary>
        /// <param name="updateInput">DTO đầu vào</param>
        /// <param name="entity">Entity cần cập nhật</param>
        /// <returns>Entity đã được map</returns>
        protected virtual TEntity MapToEntity(TUpdateInputDto updateInput, TEntity entity)
        {
            return ObjectMap(updateInput, entity);
        }

        /// <summary>
        /// Map từ Entity sang GetByIdDto
        /// </summary>
        /// <param name="entity">Entity cần map</param>
        /// <returns>DTO đã được map</returns>
        protected virtual TGetByIdDto MapToGetByIdDto(TEntity entity)
        {
            return ObjectMap<TEntity, TGetByIdDto>(entity);
        }

        /// <summary>
        /// Áp dụng sorting cho queryable
        /// </summary>
        /// <param name="queryable">Queryable gốc</param>
        /// <param name="sorting">Sorting string</param>
        /// <returns>Queryable đã được sort</returns>
        protected virtual Task<IQueryable<TGetPagedItemDto>> ApplySortingAsync(IQueryable<TGetPagedItemDto> queryable, TGetPagedInputDto input)
        {
            // Base implementation - derived classes should override for specific sorting logic
            return Task.FromResult(queryable);
        }

        #endregion

        #region CRUD Service Methods

        /// <summary>
        /// Lấy danh sách phân trang
        /// </summary>
        /// <param name="input">Tham số phân trang</param>
        /// <param name="filter">Filter string</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Danh sách phân trang</returns>
        public virtual async Task<PagedResultDto<TGetPagedItemDto>> GetPagedListAsync(TGetPagedInputDto input)
        {
            // Lấy queryable gốc
            var queryable = (await GetQueryableAsync()).AsNoTracking();
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
            queryable = await GetPagedQueryableAsync(queryable, input);
            var dtoQueryable = await MapToDtoQueryableAsync(queryable, input);
            // Đếm tổng số record
            var totalCount = await dtoQueryable.CountAsync();
            if (totalCount == 0)
            {
                return new PagedResultDto<TGetPagedItemDto>();
            }
            // Áp dụng sorting
            dtoQueryable = await ApplySortingAsync(dtoQueryable, input);
            // Áp dụng paging
            dtoQueryable = dtoQueryable
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);
            var items = await dtoQueryable.ToListAsync();
            if (items?.Any() == true)
            {
                foreach (var item in items)
                {
                    item.EncodedId = IdEncoderService.EncodeId(item.Id);
                }
            }
            return new PagedResultDto<TGetPagedItemDto>(totalCount, items);
        }

        protected virtual async Task<IQueryable<TGetPagedItemDto>> MapToDtoQueryableAsync(IQueryable<TEntity> entityQueryable, TGetPagedInputDto input)
        {
            var mapper = AppFactory.GetServiceDependency<IMapper>();
            return entityQueryable.ProjectTo<TGetPagedItemDto>(mapper.ConfigurationProvider);
        }
        public async Task<CounterByIsActivedDto> GetCountGroupByIsActived(TGetPagedInputDto input)
        {

            if (!typeof(IHasActived).IsAssignableFrom(typeof(TEntity)))
            {
                return new CounterByIsActivedDto();

            }
            var queryable = (await GetQueryableAsync()).AsNoTracking();
            var isActivedProp = typeof(TGetPagedInputDto).GetProperty("IsActived");
            if (isActivedProp != null && isActivedProp.PropertyType == typeof(bool?) && isActivedProp.CanWrite)
            {
                var currentValue = isActivedProp.GetValue(input) as bool?;
                if (currentValue.HasValue)
                {
                    isActivedProp.SetValue(input, null);
                }
            }
            var queryableDto = await GetPagedQueryableAsync(queryable, input);
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

        public virtual async Task<TEntity> GetByEncodedId(string encodedId, bool isAsNoTracking = true)
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
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>DTO chi tiết entity</returns>
        public virtual async Task<TGetByIdDto> GetDetailByIdAsync(TKey id)
        {
            var mapper = AppFactory.GetServiceDependency<IMapper>();
            var queryable = (await GetQueryableAsync()).AsNoTracking();
            var dto = await queryable.Where(x => x.Id.Equals(id))
                .ProjectTo<TGetByIdDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
            if (dto != null)
            {
                if (dto is IHasEncodedId encodedDto and IEntityDto<TKey> entityDto)
                {
                    encodedDto.EncodedId = IdEncoderService.EncodeId(entityDto.Id);
                }

            }

            return dto;
        }

        public virtual async Task<TGetByIdDto> GetDetailByEncodedIdAsync(string encodedId)
        {
            if (IdEncoderService.TryDecodeId(encodedId, out var id))
            {
                return await GetDetailByIdAsync(id);
            }

            return null;
        }

        /// <summary>
        /// Tạo mới entity
        /// </summary>
        /// <param name="createInput">Dữ liệu đầu vào</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>DTO chi tiết entity vừa tạo</returns>
        public virtual async Task<TEntity> CreateAsync(TCreateInputDto createInput, bool autoSave = true)
        {
            // Validate đầu vào
            await ValidateBeforeCreateAsync(createInput);
            // Map sang entity
            var entity = MapToEntity(createInput);
            // Insert entity
            var insertedEntity = await InsertAsync(entity, autoSave: autoSave);
            return insertedEntity;
        }

        /// <summary>
        /// Cập nhật entity
        /// </summary>
        /// <param name="id">ID của entity</param>
        /// <param name="updateInput">Dữ liệu cập nhật</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>DTO chi tiết entity sau khi cập nhật</returns>
        public virtual async Task<TEntity> UpdateAsync(TKey id, TUpdateInputDto updateInput, bool autoSave = true)
        {
            // Lấy entity hiện tại
            var entity = await GetByIdAsync(id);
            if (entity == null)
            {
                return null;
            }
            // Validate đầu vào
            await ValidateBeforeUpdateAsync(updateInput, entity);
            entity = MapToEntity(updateInput, entity);
            var updatedEntity = await UpdateAsync(entity, autoSave: autoSave);
            return updatedEntity;
        }

        public async Task<TEntity> UpdateByEncodedIdAsync(string encodedId, TUpdateInputDto updateInput, bool autoSave = true)
        {
            if (IdEncoderService.TryDecodeId(encodedId, out var id))
            {
                return await UpdateAsync(id, updateInput, autoSave);
            }

            return null;
        }

        /// <summary>
        /// Xóa entity theo ID
        /// </summary>
        /// <param name="id">ID của entity</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Task hoàn thành</returns>
        public virtual async Task<bool> DeleteAsync(TKey id, bool autoSave = true)
        {
            // Lấy entity hiện tại
            var entity = await GetByIdAsync(id);
            if (entity == null)
            {
                return false;
            }
            // Logic trước khi xóa
            await ValidateBeforeDeleteAsync(entity);
            // Xóa entity
            await DeleteAsync(entity, autoSave);
            return true;
        }

        public async Task<bool> DeleteByEncodedIdAsync(string encodedId, bool autoSave = true)
        {
            if (IdEncoderService.TryDecodeId(encodedId, out var id))
            {
                return await DeleteAsync(id);
            }
            return false;
        }

        #endregion

        #region Batch Operations

        /// <summary>
        /// Tạo nhiều entity cùng lúc
        /// </summary>
        /// <param name="createInputs">Danh sách dữ liệu đầu vào</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Danh sách DTO đã tạo</returns>
        public virtual async Task<List<TGetByIdDto>> CreateManyAsync(IEnumerable<TCreateInputDto> createInputs, CancellationToken cancellationToken = default)
        {
            var results = new List<TGetByIdDto>();

            foreach (var createInput in createInputs)
            {
                // Validate từng item
                await ValidateBeforeCreateAsync(createInput);

                // Map sang entity
                var entity = MapToEntity(createInput);

                // Insert (không save ngay)
                var insertedEntity = await InsertAsync(entity, autoSave: false);

                // Thêm vào kết quả
                results.Add(MapToGetByIdDto(insertedEntity));
            }

            // Save tất cả cùng lúc
            await SaveChangesAsync(cancellationToken);

            return results;
        }

        /// <summary>
        /// Cập nhật với điều kiện
        /// </summary>
        /// <param name="predicate">Điều kiện để lọc entity cần cập nhật</param>
        /// <param name="updateAction">Action để cập nhật entity</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Số lượng entity đã cập nhật</returns>
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
        /// <summary>
        /// Xóa nhiều entity theo danh sách ID
        /// </summary>
        /// <param name="ids">Danh sách ID</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Task hoàn thành</returns>
        public virtual async Task DeleteManyAsync(IEnumerable<TKey> ids,
            CancellationToken cancellationToken = default)
        {
            foreach (var id in ids)
            {
                var entity = await GetByIdAsync(id);
                if (entity != null)
                {
                    await ValidateBeforeDeleteAsync(entity);
                    await DeleteAsync(entity, autoSave: false, cancellationToken);
                }

            }

            // Save tất cả changes cùng lúc
            await SaveChangesAsync(cancellationToken);
        }
        /// <summary>
        /// Xóa các entity theo điều kiện với batch processing và transaction support
        /// </summary>
        /// <param name="predicate">Điều kiện để xác định entity cần xóa</param>
        /// <param name="batchSize">Số lượng entity xử lý trong mỗi batch (default: 100)</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Số lượng entity đã được xóa</returns>
        public virtual async Task<int> DeleteByConditionAsync(
            Expression<Func<TEntity, bool>> predicate,
            int batchSize = 100,
            CancellationToken cancellationToken = default)
        {
            if (predicate == null)
            {
                throw new ArgumentNullException(nameof(predicate));
            }

            if (batchSize <= 0)
            {
                throw new ArgumentException("Batch size must be greater than 0", nameof(batchSize));
            }

            var totalDeletedCount = 0;
            bool hasMoreRecords;
            do
            {
                // Lấy batch entities theo điều kiện (tracking enabled để có thể delete)
                var queryable = await GetQueryableAsync();
                var batchEntities = await queryable
                    .Where(predicate)
                    .Take(batchSize)
                    .ToListAsync(cancellationToken);

                hasMoreRecords = batchEntities.Count == batchSize;

                if (batchEntities.Any())
                {
                    // Thực hiện logic trước khi xóa cho từng entity
                    foreach (var entity in batchEntities)
                    {
                        await ValidateBeforeDeleteAsync(entity);
                    }

                    // Xóa batch hiện tại
                    await DeleteManyAsync(batchEntities, autoSave: false, cancellationToken);

                    // Save changes cho batch này
                    await SaveChangesAsync(cancellationToken);

                    totalDeletedCount += batchEntities.Count;

                    // Log progress nếu có nhiều batch
                    if (totalDeletedCount > batchSize)
                    {
                        // _logger?.LogInformation($"Deleted {totalDeletedCount} entities so far...");
                    }
                }

            } while (hasMoreRecords && !cancellationToken.IsCancellationRequested);

            return totalDeletedCount;
        }

        #endregion

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
        public virtual async Task<List<TDto>> GetAllAsDtoAsync<TDto>(bool isAsNoTracking = true)
            where TDto : class
        {
            var queryable = await GetQueryableAsync();
            var items = await queryable.AsNoTrackingIf(isAsNoTracking).ToListAsync();
            return items.Select(ObjectMap<TEntity, TDto>).ToList();
        }

        /// <summary>
        /// Lấy danh sách entity theo điều kiện dưới dạng DTO
        /// </summary>
        /// <param name="predicate">Điều kiện lọc</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Danh sách DTO</returns>
        public virtual async Task<List<TDto>> GetListAsDtoAsync<TDto>(
            Expression<Func<TEntity, bool>> predicate,
            bool isAsNoTracking = true)
        where TDto : class
        {
            var queryable = await GetQueryableAsync();
            var items = await queryable.AsNoTrackingIf(isAsNoTracking).Where(predicate).ToListAsync();
            return items.Select(ObjectMap<TEntity, TDto>).ToList();
        }
        /// <summary>
        /// Lấy danh sách entity theo điều kiện dưới dạng DTO
        /// </summary>
        /// <param name="predicate">Điều kiện lọc</param>
        /// <param name="cancellationToken">Token để hủy operation</param>
        /// <returns>Danh sách DTO</returns>
        public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var queryable = await GetQueryableAsync();
            return await queryable.AsNoTracking().Where(predicate).CountAsync();
        }

        #endregion
    }
}
