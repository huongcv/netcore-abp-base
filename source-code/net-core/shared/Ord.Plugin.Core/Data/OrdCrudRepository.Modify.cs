using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Data
{
	/// <summary>
	/// Repository cơ sở cho các operations CRUD với hỗ trợ DTO mapping và validation
	/// Phần này chứa các thao tác ghi dữ liệu (Create, Update, Delete)
	/// </summary>
	public abstract partial class OrdCrudRepository<TDbContext, TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
		TUpdateInputDto> 
		where TDbContext : IEfCoreDbContext
		where TEntity : class, IEntity<TKey>
		where TGetPagedInputDto : PagedAndSortedResultRequestDto
		where TGetPagedItemDto : class
		where TGetByIdDto : class, IEntityDto<TKey>
        where TCreateInputDto : class
		where TUpdateInputDto : class, IHasEncodedId
	{
		#region Abstract Methods - Must be implemented by derived classes

		/// <summary>
		/// Validate dữ liệu trước khi tạo mới
		/// </summary>
		/// <param name="createInput">Dữ liệu đầu vào cho tạo mới</param>
		/// <returns>Nếu có lỗi ném AbpValidationException</returns>
		protected abstract Task ValidateBeforeCreateAsync(TCreateInputDto createInput);

		/// <summary>
		/// Validate dữ liệu trước khi cập nhật
		/// </summary>
		/// <param name="updateInput">Dữ liệu đầu vào cho cập nhật</param>
		/// <param name="entityUpdate">Entity sẽ được cập nhật</param>
		/// <returns>Nếu có lỗi ném AbpValidationException</returns>
		protected abstract Task ValidateBeforeUpdateAsync(TUpdateInputDto updateInput, TEntity entityUpdate);

		/// <summary>
		/// Validate dữ liệu trước khi xóa
		/// </summary>
		/// <param name="entityDelete">Entity sẽ được xóa</param>
		/// <returns>Nếu có lỗi ném AbpValidationException</returns>
		protected abstract Task ValidateBeforeDeleteAsync(TEntity entityDelete);

		#endregion

		#region Virtual Methods - Can be overridden by derived classes

		/// <summary>
		/// Map từ CreateInputDto sang Entity
		/// </summary>
		/// <param name="createInput">DTO đầu vào</param>
		/// <returns>Entity đã được map</returns>
		protected virtual Task<TEntity> MapToCreateEntityAsync(TCreateInputDto createInput)
		{
			return Task.FromResult(ObjectMap<TCreateInputDto, TEntity>(createInput));
		}

		/// <summary>
		/// Map từ UpdateInputDto sang Entity
		/// </summary>
		/// <param name="updateInput">DTO đầu vào</param>
		/// <param name="entity">Entity cần cập nhật</param>
		/// <returns>Entity đã được map</returns>
		protected virtual Task<TEntity> MapToUpdateEntityAsync(TUpdateInputDto updateInput, TEntity entity)
		{
			return Task.FromResult(ObjectMap(updateInput, entity));
		}

		#endregion

		#region Create Operations

		/// <summary>
		/// Tạo mới entity
		/// </summary>
		/// <param name="createInput">Dữ liệu đầu vào</param>
		/// <param name="autoSave">Tự động save hay không</param>
		/// <returns>Entity vừa tạo</returns>
		public virtual async Task<TEntity> CreateAsync(TCreateInputDto createInput, bool autoSave = true)
		{
			// Validate đầu vào
			await ValidateBeforeCreateAsync(createInput);

			// Map sang entity
			var entity = await MapToCreateEntityAsync(createInput);

			// Insert entity
			var insertedEntity = await InsertAsync(entity, autoSave: autoSave);
			return insertedEntity;
		}

		/// <summary>
		/// Tạo nhiều entity cùng lúc
		/// </summary>
		/// <param name="createInputs">Danh sách dữ liệu đầu vào</param>
		/// <param name="cancellationToken">Token để hủy operation</param>
		/// <returns>Danh sách Entity đã tạo</returns>
		public virtual async Task<IEnumerable<TEntity>> CreateManyAsync(IEnumerable<TCreateInputDto> createInputs, CancellationToken cancellationToken = default)
		{
			var results = new List<TEntity>();

			foreach (var createInput in createInputs)
			{
				// Validate từng item
				await ValidateBeforeCreateAsync(createInput);

				// Map sang entity
				var entity = await MapToCreateEntityAsync(createInput);

				// Insert (không save ngay)
				var insertedEntity = await InsertAsync(entity, autoSave: false, cancellationToken: cancellationToken);

				// Thêm vào kết quả
				results.Add(insertedEntity);
			}

			// Save tất cả cùng lúc
			await SaveChangesAsync(cancellationToken);

			return results;
		}

		#endregion

		#region Update Operations

		/// <summary>
		/// Cập nhật entity theo ID
		/// </summary>
		/// <param name="id">ID của entity</param>
		/// <param name="updateInput">Dữ liệu cập nhật</param>
		/// <param name="autoSave">Tự động save hay không</param>
		/// <returns>Entity sau khi cập nhật</returns>
		public virtual async Task<TEntity> UpdateAsync(TKey id, TUpdateInputDto updateInput, bool autoSave = true)
		{
			var entity = await GetByIdAsync(id);
			if (entity == null)
			{
				return null;
			}

			// Validate đầu vào
			await ValidateBeforeUpdateAsync(updateInput, entity);

			entity = await MapToUpdateEntityAsync(updateInput, entity);
			var updatedEntity = await UpdateAsync(entity, autoSave: autoSave);
			return updatedEntity;
		}

		/// <summary>
		/// Cập nhật entity theo ID với action tùy chỉnh
		/// </summary>
		/// <param name="id">ID của entity</param>
		/// <param name="updateAction">Action để cập nhật entity</param>
		/// <param name="autoSave">Tự động save hay không</param>
		/// <returns>Entity sau khi cập nhật</returns>
		public virtual async Task<TEntity> UpdateAsync(TKey id, Func<TEntity, Task> updateAction, bool autoSave = true)
		{
			var entity = await GetByIdAsync(id);
			if (entity == null)
			{
				return null;
			}

			await updateAction(entity);
			var updatedEntity = await UpdateAsync(entity, autoSave: autoSave);
			return updatedEntity;
		}

		/// <summary>
		/// Cập nhật entity theo encoded ID
		/// </summary>
		/// <param name="encodedId">ID đã được encode</param>
		/// <param name="updateInput">Dữ liệu cập nhật</param>
		/// <param name="autoSave">Tự động save hay không</param>
		/// <returns>Entity sau khi cập nhật</returns>
		public virtual async Task<TEntity> UpdateByEncodedIdAsync(string encodedId, TUpdateInputDto updateInput, bool autoSave = true)
		{
			if (IdEncoderService.TryDecodeId(encodedId, out var id))
			{
				return await UpdateAsync(id, updateInput, autoSave);
			}

			return null;
		}

		/// <summary>
		/// Cập nhật entity theo encoded ID với action tùy chỉnh
		/// </summary>
		/// <param name="encodedId">ID đã được encode</param>
		/// <param name="updateAction">Action để cập nhật entity</param>
		/// <param name="autoSave">Tự động save hay không</param>
		/// <returns>Entity sau khi cập nhật</returns>
		public virtual async Task<TEntity> UpdateByEncodedIdAsync(string encodedId, Func<TEntity, Task> updateAction, bool autoSave = true)
		{
			if (IdEncoderService.TryDecodeId(encodedId, out var id))
			{
				return await UpdateAsync(id, updateAction, autoSave);
			}
			return null;
		}

		#endregion

		#region Delete Operations

		/// <summary>
		/// Xóa entity theo ID
		/// </summary>
		/// <param name="id">ID của entity</param>
		/// <param name="autoSave">Tự động save hay không</param>
		/// <returns>True nếu xóa thành công</returns>
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

		/// <summary>
		/// Xóa entity theo encoded ID
		/// </summary>
		/// <param name="encodedId">ID đã được encode</param>
		/// <param name="autoSave">Tự động save hay không</param>
		/// <returns>True nếu xóa thành công</returns>
		public virtual async Task<bool> DeleteByEncodedIdAsync(string encodedId, bool autoSave = true)
		{
			if (IdEncoderService.TryDecodeId(encodedId, out var id))
			{
				return await DeleteAsync(id, autoSave);
			}
			return false;
		}

		/// <summary>
		/// Xóa nhiều entity theo danh sách ID
		/// </summary>
		/// <param name="ids">Danh sách ID</param>
		/// <param name="cancellationToken">Token để hủy operation</param>
		/// <returns>Task hoàn thành</returns>
		public virtual async Task DeleteManyAsync(IEnumerable<TKey> ids, CancellationToken cancellationToken = default)
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
	}
}