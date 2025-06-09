using Ord.Plugin.Contract.Dtos;
using System.Linq.Expressions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Contract.Data
{
    public interface IOrdCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto,
        TUpdateInputDto> : IOrdEfCoreRepository<TEntity, TKey>
        where TEntity : class, IEntity<TKey>
        where TGetPagedInputDto : PagedAndSortedResultRequestDto
        where TGetPagedItemDto : class
        where TGetByIdDto : class
        where TCreateInputDto : class
        where TUpdateInputDto : class
    {
        #region Get function

        Task<PagedResultDto<TGetPagedItemDto>> GetPagedListAsync(TGetPagedInputDto input);
        Task<CounterByIsActivedDto> GetCountGroupByIsActived(TGetPagedInputDto input);
        Task<TEntity> GetByIdAsync(TKey id, bool isNoTracking = false);
        Task<TEntity> GetByEncodedId(string encodedId, bool isAsNoTracking = true);
        Task<TGetByIdDto> GetDetailByIdAsync(TKey id);
        Task<TGetByIdDto> GetDetailByEncodedIdAsync(string encodedId);

        #endregion

        Task<TEntity> CreateAsync(TCreateInputDto createInput, bool autoSave = true);
        Task<TEntity> UpdateAsync(TKey id, TUpdateInputDto updateInput, bool autoSave = true);
        Task<TEntity> UpdateByEncodedIdAsync(string encodedId, TUpdateInputDto updateInput, bool autoSave = true);
        Task<bool> DeleteAsync(TKey id, bool autoSave = true);
        Task<bool> DeleteByEncodedIdAsync(string encodedId, bool autoSave = true);

        Task<List<TGetByIdDto>> CreateManyAsync(IEnumerable<TCreateInputDto> createInputs, CancellationToken cancellationToken = default);

        Task<IEnumerable<TEntity>> UpdateByConditionAsync(Expression<Func<TEntity, bool>> predicate, Action<TEntity> updateAction, CancellationToken cancellationToken = default);

        Task DeleteManyAsync(IEnumerable<TKey> ids, CancellationToken cancellationToken = default);
        Task<int> DeleteByConditionAsync(Expression<Func<TEntity, bool>> predicate, int batchSize = 100, CancellationToken cancellationToken = default);
    }
}
