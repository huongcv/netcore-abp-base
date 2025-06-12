using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services.Security;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Core.Utils
{
    public static class AppFactoryCrudUtil
    {
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <typeparam name="TPrimaryKey"></typeparam>
        /// <typeparam name="TDto"></typeparam>
        /// <param name="appFactory"></param>
        /// <param name="input"></param>
        /// <param name="entityName"></param>
        /// <param name="isUpdate"></param>
        /// <param name="setter">Cập nhật thêm , bool là insert hay không? </param>
        /// <param name="autoSave"></param>
        /// <returns></returns>
        public static async Task<CommonResultDto<TDto>> CreateOrUpdateEntity<TEntity, TPrimaryKey, TDto>(
            this IAppFactory appFactory, TDto input, string entityName, bool? isUpdate = null,
            Action<TDto, TEntity, bool> setter = null, bool autoSave = true)
            where TEntity : class, IEntity<TPrimaryKey>
            where TDto : class, IEntityDto<TPrimaryKey>
        {
            isUpdate ??= input.Id != null && !input.Id.Equals(default(TPrimaryKey));
            if (isUpdate.Value)
            {
                return await UpdateEntity<TEntity, TPrimaryKey, TDto>(appFactory, input, entityName, setter, autoSave);
            }
            return await CreateEntity<TEntity, TDto>(appFactory, input, entityName, setter, autoSave);
        }
        public static async Task<CommonResultDto<TDto>> CreateEntity<TEntity, TDto>(
            this IAppFactory appFactory, TDto input, string entityName, Action<TDto, TEntity, bool> setter = null, bool autoSave = true)
            where TEntity : class, IEntity
            where TDto : class
        {
            try
            {
                var validResult = await appFactory.ValidateDto(input);
                if (!validResult.IsValid)
                {
                    return CommonResultDto<TDto>.ValidationFailure(validResult.Errors);
                }
                var repo = appFactory.GetServiceDependency<IRepository<TEntity>>();
                var createEnt = appFactory.ObjectMap<TDto, TEntity>(input);
                if (setter != null)
                {
                    setter.Invoke(input, createEnt, true);
                }
                await repo.InsertAsync(createEnt, autoSave);
                return CommonResultDto<TDto>.Ok(appFactory.ObjectMap<TEntity, TDto>(createEnt), $@"Crud.{entityName}.InsertSuccess");
            }
            catch (Exception ex)
            {
                // nhớ đặt để rollback lại db
                await appFactory.CurrentUnitOfWork.RollbackAsync();
                return CommonResultDto<TDto>.ServerFailure(ex);
            }
        }
        public static async Task<CommonResultDto<TDto>> UpdateEntity<TEntity, TPrimaryKey, TDto>(
            this IAppFactory appFactory, TDto input, string entityName, Action<TDto, TEntity, bool> setter = null, bool autoSave = true)
            where TEntity : class, IEntity<TPrimaryKey>
            where TDto : class, IEntityDto<TPrimaryKey>
        {
            try
            {
                var validResult = await appFactory.ValidateDto(input);
                if (!validResult.IsValid)
                {
                    return CommonResultDto<TDto>.ValidationFailure(validResult.Errors);
                }
                var repo = appFactory.GetServiceDependency<IRepository<TEntity, TPrimaryKey>>();
                var updateEnt = await repo.FirstOrDefaultAsync(x => x.Id != null && x.Id.Equals(input.Id));
                if (updateEnt == null)
                {
                    return CommonResultDto<TDto>.Failed($@"Crud.{entityName}.NotFound");
                }
                appFactory.ObjectMap(input, updateEnt);
                if (setter != null)
                {
                    setter.Invoke(input, updateEnt, false);
                }

                await repo.UpdateAsync(updateEnt, autoSave);
                return CommonResultDto<TDto>.Ok(appFactory.ObjectMap<TEntity, TDto>(updateEnt), $@"Crud.{entityName}.UpdateSuccess");
            }
            catch (Exception ex)
            {
                // nhớ đặt để rollback lại db
                await appFactory.CurrentUnitOfWork.RollbackAsync();
                return CommonResultDto<TDto>.ServerFailure(ex);
            }
        }


        public static async Task<CommonResultDto<TDto>> RemoveEntity<TEntity, TPrimaryKey, TDto>(
            this IAppFactory appFactory, TPrimaryKey removeId, string entityName, bool autoSave = true)
            where TEntity : class, IEntity<TPrimaryKey>
        {
            var repo = appFactory.GetServiceDependency<IRepository<TEntity, TPrimaryKey>>();
            var q = await repo.GetQueryableAsync();
            var find = await q.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id != null && x.Id.Equals(removeId));
            if (find == null)
            {
                return CommonResultDto<TDto>.Failed($@"Crud.{entityName}.NotFound");
            }
            await repo.DeleteAsync(removeId, autoSave);
            return CommonResultDto<TDto>.Ok(appFactory.ObjectMap<TEntity, TDto>(find), $@"Crud.{entityName}.RemoveSuccess");
        }

        #region Encode Id paged result

        public static void EncodeIdPagedItems<TEntity, TPrimaryKey, TPagedItemDto>(this IAppFactory appFactory, PagedResultDto<TPagedItemDto> pagedResult)
            where TEntity : class, IEntity<TPrimaryKey>
            where TPagedItemDto : class, IEntityDto<TPrimaryKey>, IHasEncodedId
        {
            appFactory.EncodeIdPagedItems<TEntity, TPrimaryKey, TPagedItemDto>(pagedResult.Items);
        }
        public static void EncodeIdPagedItems<TEntity, TPrimaryKey, TPagedItemDto>(this IAppFactory appFactory, IEnumerable<TPagedItemDto> items)
            where TEntity : class, IEntity<TPrimaryKey>
            where TPagedItemDto : class, IEntityDto<TPrimaryKey>, IHasEncodedId
        {
            var encodeService = appFactory.GetServiceDependency<IIdEncoderService<TEntity, TPrimaryKey>>();
            EncodeIdPagedItems(appFactory, items, encodeService);
        }
        public static void EncodeIdPagedItems<TEntity, TPrimaryKey, TPagedItemDto>(this IAppFactory appFactory, IEnumerable<TPagedItemDto> items, IIdEncoderService<TEntity, TPrimaryKey> encodeService)
            where TEntity : class, IEntity<TPrimaryKey>
            where TPagedItemDto : class, IEntityDto<TPrimaryKey>, IHasEncodedId
        {
            if (items?.Any() != true)
            {
                return;
            }
            foreach (var item in items)
            {
                item.EncodedId = encodeService.EncodeId(item.Id);
            }
        }
        #endregion

    }
}
