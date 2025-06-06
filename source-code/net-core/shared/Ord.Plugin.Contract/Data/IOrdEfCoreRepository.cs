using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Contract.Data
{
    public interface IOrdEfCoreRepository<TEntity, TKey> : IBasicRepository<TEntity, TKey>, IScopedDependency
        where TEntity : class, IEntity<TKey>

    {
    }
}
