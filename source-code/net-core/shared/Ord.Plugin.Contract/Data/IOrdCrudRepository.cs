using Ord.Plugin.Contract.Dtos;
using System.Linq.Expressions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Contract.Data
{
    /// <summary>
    /// Interface CRUD Repository với hỗ trợ DTO mapping và operations cơ bản
    /// </summary>
    /// <typeparam name="TEntity">Entity class</typeparam>
    /// <typeparam name="TKey">Kiểu khóa chính (int, long, Guid, ...)</typeparam>
    /// <typeparam name="TGetPagedInputDto">DTO tham số phân trang và tìm kiếm</typeparam>
    /// <typeparam name="TGetPagedItemDto">DTO hiển thị danh sách (ít field)</typeparam>
    /// <typeparam name="TGetByIdDto">DTO chi tiết (đầy đủ field)</typeparam>
    /// <typeparam name="TCreateInputDto">DTO tạo mới</typeparam>
    /// <typeparam name="TUpdateInputDto">DTO cập nhật</typeparam>
    public interface IOrdCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto> : IOrdEfCoreRepository<TEntity, TKey>
        where TEntity : class, IEntity<TKey>
        where TGetPagedInputDto : PagedAndSortedResultRequestDto
        where TGetPagedItemDto : class
        where TGetByIdDto : class
        where TCreateInputDto : class
        where TUpdateInputDto : class
    {
        #region Query Operations
        /// <summary>
        /// Lấy danh sách phân trang với filtering và sorting
        /// </summary>
        Task<PagedResultDto<TGetPagedItemDto>> GetPagedListAsync(TGetPagedInputDto input);

        /// <summary>
        /// Thống kê số lượng theo trạng thái IsActived (chỉ áp dụng Entity có IHasActived)
        /// </summary>
        Task<CounterByIsActivedDto> GetCountGroupByIsActivedAsync(TGetPagedInputDto input);

        /// <summary>
        /// Lấy Entity theo ID (raw entity)
        /// </summary>
        Task<TEntity> GetByIdAsync(TKey id, bool isNoTracking = false);

        /// <summary>
        /// Lấy Entity theo Encoded ID (ID đã mã hóa bảo mật)
        /// </summary>
        Task<TEntity> GetByEncodedIdAsync(string encodedId, bool isAsNoTracking = true);

        /// <summary>
        /// Lấy DTO chi tiết theo ID
        /// </summary>
        Task<TGetByIdDto> GetDetailByIdAsync(TKey id);

        /// <summary>
        /// Lấy DTO chi tiết theo Encoded ID
        /// </summary>
        Task<TGetByIdDto> GetDetailByEncodedIdAsync(string encodedId);
        #endregion

        #region CRUD Operations
        /// <summary>
        /// Tạo mới Entity từ DTO
        /// </summary>
        Task<TEntity> CreateAsync(TCreateInputDto createInput, bool autoSave = true);

        /// <summary>
        /// Cập nhật Entity theo ID với DTO
        /// </summary>
        Task<TEntity> UpdateAsync(TKey id, TUpdateInputDto updateInput, bool autoSave = true);

        /// <summary>
        /// Cập nhật Entity theo ID với action function
        /// </summary>
        Task<TEntity> UpdateAsync(TKey id, Func<TEntity, Task> updateAction, bool autoSave = true);

        /// <summary>
        /// Cập nhật Entity theo Encoded ID với DTO
        /// </summary>
        Task<TEntity> UpdateByEncodedIdAsync(string encodedId, TUpdateInputDto updateInput, bool autoSave = true);

        /// <summary>
        /// Cập nhật Entity theo Encoded ID với action function
        /// </summary>
        Task<TEntity> UpdateByEncodedIdAsync(string encodedId, Func<TEntity, Task> updateAction, bool autoSave = true);

        /// <summary>
        /// Xóa Entity theo ID
        /// </summary>
        Task<bool> DeleteAsync(TKey id, bool autoSave = true);

        /// <summary>
        /// Xóa Entity theo Encoded ID
        /// </summary>
        Task<bool> DeleteByEncodedIdAsync(string encodedId, bool autoSave = true);
        #endregion

        #region Batch Operations
        /// <summary>
        /// Tạo nhiều Entity cùng lúc
        /// </summary>
        Task<IEnumerable<TEntity>> CreateManyAsync(IEnumerable<TCreateInputDto> createInputs, CancellationToken cancellationToken = default);

        /// <summary>
        /// Cập nhật nhiều Entity theo điều kiện với async action
        /// </summary>
        Task<IEnumerable<TEntity>> UpdateByConditionAsync(Expression<Func<TEntity, bool>> predicate, Func<TEntity, Task> updateAction, CancellationToken cancellationToken = default);

        /// <summary>
        /// Xóa nhiều Entity theo danh sách ID
        /// </summary>
        Task DeleteManyAsync(IEnumerable<TKey> ids, CancellationToken cancellationToken = default);

        /// <summary>
        /// Xóa nhiều Entity theo điều kiện với batch processing
        /// </summary>
        Task<int> DeleteByConditionAsync(Expression<Func<TEntity, bool>> predicate, int batchSize = 100, CancellationToken cancellationToken = default);
        #endregion

        #region Helper Methods
        Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate);
        Task<bool> ExistsByIdAsync(TKey id);
        Task<bool> ExistsByEncodeIdAsync(string encodeId);
        Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate);

        #endregion
    }
}