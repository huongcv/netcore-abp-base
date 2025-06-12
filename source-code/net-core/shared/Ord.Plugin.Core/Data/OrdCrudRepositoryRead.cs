//using AutoMapper;
//using AutoMapper.QueryableExtensions;
//using Microsoft.EntityFrameworkCore;
//using Ord.Plugin.Contract.Base;
//using Ord.Plugin.Contract.Data;
//using Ord.Plugin.Contract.Dtos;
//using Ord.Plugin.Contract.Factories;
//using Ord.Plugin.Contract.Services.Security;
//using System.Linq.Expressions;
//using Volo.Abp.Application.Dtos;
//using Volo.Abp.Auditing;
//using Volo.Abp.Data;
//using Volo.Abp.Domain.Entities;
//using Volo.Abp.Domain.Repositories;
//using Volo.Abp.EntityFrameworkCore;

//namespace Ord.Plugin.Core.Data
//{
//    /// <summary>
//    /// Repository cơ sở hỗ trợ CRUD với mapping DTO, validation và phân trang
//    /// </summary>
//    public  abstract partial class OrdCrudRepository<TDbContext, TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto, TUpdateInputDto>
//        : OrdEfCoreRepository<TDbContext, TEntity, TKey>,
//          IOrdCrudRepository<TEntity, TKey, TGetPagedInputDto, TGetPagedItemDto, TGetByIdDto, TCreateInputDto, TUpdateInputDto>
//        where TDbContext : IEfCoreDbContext
//        where TEntity : class, IEntity<TKey>
//        where TGetPagedInputDto : PagedAndSortedResultRequestDto
//        where TGetPagedItemDto : class
//        where TGetByIdDto : class
//        where TCreateInputDto : class
//        where TUpdateInputDto : class, IHasEncodedId
//    {
//        #region Dependencies

//        protected IIdEncoderService<TEntity, TKey> IdEncoderService =>
//            AppFactory.GetServiceDependency<IIdEncoderService<TEntity, TKey>>();

//        protected IDataFilter DataFilter => AppFactory.GetServiceDependency<IDataFilter>();

//        protected IMapper Mapper => AppFactory.GetServiceDependency<IMapper>();

//        #endregion

//        #region Abstract Methods

//        protected abstract Task<IQueryable<TEntity>> GetPagedQueryableAsync(IQueryable<TEntity> queryable, TGetPagedInputDto input);
//        protected abstract Task ValidateBeforeCreateAsync(TCreateInputDto createInput);
//        protected abstract Task ValidateBeforeUpdateAsync(TUpdateInputDto updateInput, TEntity entityUpdate);
//        protected abstract Task ValidateBeforeDeleteAsync(TEntity entityDelete);

//        #endregion

//        #region Virtual Mapping Methods

//        protected virtual Task<TEntity> MapToCreateEntityAsync(TCreateInputDto createInput) =>
//            Task.FromResult(ObjectMap<TCreateInputDto, TEntity>(createInput));

//        protected virtual Task<TEntity> MapToUpdateEntityAsync(TUpdateInputDto updateInput, TEntity entity) =>
//            Task.FromResult(ObjectMap(updateInput, entity));

//        protected virtual Task<TGetByIdDto> MapToGetByIdDtoAsync(TEntity entity) =>
//            Task.FromResult(ObjectMap<TEntity, TGetByIdDto>(entity));

//        protected virtual Task<IQueryable<TGetPagedItemDto>> ApplySortingAsync(IQueryable<TGetPagedItemDto> queryable, TGetPagedInputDto input) =>
//            Task.FromResult(queryable);

//        protected virtual Task ProcessPagedItemsAsync(List<TGetPagedItemDto> items, TGetPagedInputDto input) =>
//            Task.CompletedTask;

//        #endregion

//        #region Paging & Listing

//        public virtual async Task<PagedResultDto<TGetPagedItemDto>> GetPagedListAsync(TGetPagedInputDto input)
//        {
//            var queryable = (await GetQueryableAsync()).AsNoTracking();
//            queryable = ApplySortDefault(queryable, input);
//            queryable = await GetPagedQueryableAsync(queryable, input);
//            var dtoQueryable = await TransformToPagedDtoAsync(queryable, input);

//            var totalCount = await dtoQueryable.CountAsync();
//            if (totalCount == 0)
//            {
//                return new PagedResultDto<TGetPagedItemDto>();
//            }

//            dtoQueryable = await ApplySortingAsync(dtoQueryable, input)
//                .ContinueWith(t => t.Result.Skip(input.SkipCount).Take(input.MaxResultCount));
//            var items = await dtoQueryable.ToListAsync();

//            if (items?.Any() == true)
//            {
//                await ProcessPagedItemsAsync(items, input);
//            }

//            return new PagedResultDto<TGetPagedItemDto>(totalCount, items);
//        }

//        protected IQueryable<TEntity> ApplySortDefault(IQueryable<TEntity> queryable, TGetPagedInputDto input)
//        {
//            if (string.IsNullOrWhiteSpace(input.Sorting))
//            {
//                if (typeof(IHasCreationTime).IsAssignableFrom(typeof(TEntity)))
//                {
//                    queryable = queryable.OrderByDescending(e => ((IHasCreationTime)e).CreationTime);
//                }
//                else if (IsNumericType(typeof(TKey)))
//                {
//                    queryable = queryable.OrderByDescending(e => e.Id);
//                }
//                else
//                {
//                    queryable = queryable.OrderBy(e => e.Id);
//                }
//            }

//            return queryable;
//        }

//        protected virtual async Task<IQueryable<TGetPagedItemDto>> TransformToPagedDtoAsync(IQueryable<TEntity> entityQueryable, TGetPagedInputDto input)
//        {
//            var mapper = AppFactory.GetServiceDependency<IMapper>();
//            return entityQueryable.ProjectTo<TGetPagedItemDto>(mapper.ConfigurationProvider);
//        }

//        public virtual async Task<CounterByIsActivedDto> GetCountGroupByIsActivedAsync(TGetPagedInputDto input)
//        {
//            if (!typeof(IHasActived).IsAssignableFrom(typeof(TEntity)))
//                return new CounterByIsActivedDto();

//            var queryable = (await GetQueryableAsync()).AsNoTracking();

//            // Bỏ qua điều kiện IsActived để đếm theo từng nhóm
//            var isActivedProp = typeof(TGetPagedInputDto).GetProperty("IsActived");
//            if (isActivedProp?.PropertyType == typeof(bool?) && isActivedProp.CanWrite)
//            {
//                var currentValue = isActivedProp.GetValue(input) as bool?;
//                if (currentValue.HasValue)
//                    isActivedProp.SetValue(input, null);
//            }

//            queryable = await GetPagedQueryableAsync(queryable, input);
//            var dtoQueryable = await TransformToPagedDtoAsync(queryable, input);
//            var groupBy = await dtoQueryable.GroupBy(e => ((IHasActived)e).IsActived)
//                .Select(g => new CounterByIsActivedItemDto
//                {
//                    IsActived = g.Key,
//                    TotalCount = g.Count()
//                }).ToListAsync();

//            return new CounterByIsActivedDto { Items = groupBy };
//        }

//        #endregion

//        #region Detail Retrieval

//        public virtual async Task<TEntity> GetByEncodedIdAsync(string encodedId, bool isAsNoTracking = true)
//        {
//            return IdEncoderService.TryDecodeId(encodedId, out var id)
//                ? await GetByIdAsync(id, isAsNoTracking)
//                : null;
//        }

//        public virtual async Task<TGetByIdDto> GetDetailByIdAsync(TKey id)
//        {
//            var entity = await GetByIdAsync(id, true);
//            if (entity == null) return null;

//            var dto = await MapToGetByIdDtoAsync(entity);
//            if (dto is IHasEncodedId encodedDto and IEntityDto<TKey> entityDto)
//            {
//                encodedDto.EncodedId = IdEncoderService.EncodeId(entityDto.Id);
//            }

//            return dto;
//        }

//        public virtual async Task<TGetByIdDto> GetDetailByEncodedIdAsync(string encodedId)
//        {
//            return IdEncoderService.TryDecodeId(encodedId, out var id)
//                ? await GetDetailByIdAsync(id)
//                : null;
//        }

//        #endregion

//        #region Helper

//        private static bool IsNumericType(Type type)
//        {
//            type = Nullable.GetUnderlyingType(type) ?? type;
//            return type == typeof(int) || type == typeof(long) || type == typeof(short) ||
//                   type == typeof(byte) || type == typeof(uint) || type == typeof(ulong) ||
//                   type == typeof(ushort) || type == typeof(sbyte) || type == typeof(decimal) ||
//                   type == typeof(double) || type == typeof(float);
//        }

//        #endregion
//    }
//}
