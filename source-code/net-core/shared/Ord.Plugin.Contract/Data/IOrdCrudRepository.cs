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
        Task<PagedResultDto<TGetPagedItemDto>> GetPagedListAsync(TGetPagedInputDto input);

        Task<TGetByIdDto> GetByIdAsync(TKey id);
        Task<TGetByIdDto> GetByEncodedIdAsync(string encodedId);
        Task<TEntity> CreateAsync(TCreateInputDto createInput, bool autoSave = true);
        Task<TEntity> UpdateAsync(TKey id, TUpdateInputDto updateInput, bool autoSave = true);
        Task<TEntity> UpdateByEncodedIdAsync(string encodedId, TUpdateInputDto updateInput, bool autoSave = true);
        Task DeleteAsync(TKey id);
        Task DeleteByEncodedIdAsync(string encodedId);

        Task<List<TGetByIdDto>> CreateManyAsync(IEnumerable<TCreateInputDto> createInputs, CancellationToken cancellationToken = default);

        Task<IEnumerable<TEntity>> UpdateByConditionAsync(Expression<Func<TEntity, bool>> predicate, Action<TEntity> updateAction, CancellationToken cancellationToken = default);

        Task DeleteManyAsync(IEnumerable<TKey> ids, CancellationToken cancellationToken = default);
        Task<int> DeleteByConditionAsync(Expression<Func<TEntity, bool>> predicate, int batchSize = 100, CancellationToken cancellationToken = default);
    }
}
