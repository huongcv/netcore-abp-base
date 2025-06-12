using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Contract.Factories;
using System.Linq.Expressions;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Core.Utils
{
    public static class AppFactoryEfUtil
    {
        public static async Task<T> EfInsertAsync<T, TDto>(this IAppFactory factory, TDto dto, Action<T> setterInsert = null, bool autoSave = false)
            where T : class, IEntity
        {
            var entity = factory.ObjectMap<TDto, T>(dto);
            var repos = factory.LazyService<IRepository<T>>();
            if (setterInsert != null)
            {
                setterInsert.Invoke(entity);
            }
            return await repos.InsertAsync(entity, autoSave);
        }
        public static async Task<IEnumerable<T>> EfInsertManyAsync<T, TDto>(this IAppFactory factory, List<TDto> listDto, Action<T> setterInsert = null, bool autoSave = false)
            where T : class, IEntity
        {
            var entities = listDto.Select(x =>
            {
                var dto = factory.ObjectMap<TDto, T>(x);
                if (setterInsert != null)
                {
                    setterInsert.Invoke(dto);
                }
                return dto;
            }).ToList();
            var repos = factory.LazyService<IRepository<T>>();
            await repos.InsertManyAsync(entities, autoSave);
            return entities;
        }
        public static async Task<T> EfUpdateOneAsync<T, TDto>(
            this IAppFactory factory,
            Expression<Func<T, bool>> findPredicate,
            TDto updateDto,
            Action<T> setterUpdate = null,
            bool autoSave = false)
            where T : class, IEntity
        {
            var repos = factory.LazyService<IRepository<T>>();
            var q = await repos.GetQueryableAsync();
            var entity = await q.Where(findPredicate).FirstOrDefaultAsync();
            if (entity == null)
            {
                return null;
            }

            factory.ObjectMap(updateDto, entity);
            if (setterUpdate != null)
            {
                setterUpdate.Invoke(entity);
            }
            return await repos.UpdateAsync(entity, autoSave);
        }
        public static async Task<T> EfUpdateOneAsync<T>(this IAppFactory factory, Expression<Func<T, bool>> findPredicate, Action<T> setterUpdate, bool autoSave = false)
            where T : class, IEntity
        {
            var repos = factory.LazyService<IRepository<T>>();
            var q = await repos.GetQueryableAsync();
            var entity = await q.Where(findPredicate).FirstOrDefaultAsync();
            if (entity == null)
            {
                return null;
            }
            setterUpdate.Invoke(entity);
            return await repos.UpdateAsync(entity, autoSave);
        }

        public static async Task<IEnumerable<T>> EfUpdateManyAsync<T>(this IAppFactory factory, Expression<Func<T, bool>> filterPredicate, Action<T> setterUpdate, bool autoSave = false)
            where T : class, IEntity
        {
            var repos = factory.LazyService<IRepository<T>>();
            var q = await repos.GetQueryableAsync();
            var entities = await q.Where(filterPredicate).ToListAsync();
            if (entities == null)
            {
                return null;
            }
            foreach (var entity in entities)
            {
                setterUpdate.Invoke(entity);
            }
            await repos.UpdateManyAsync(entities, autoSave);
            return entities;
        }

    }
}
