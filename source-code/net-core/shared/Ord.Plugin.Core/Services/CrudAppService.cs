using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Ord.Plugin.Contract.DataExporting;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Utils;
using System.Text;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Core.Services
{
    public abstract class OrdCrudAppService<TEntity, TDto>
        : OrdCrudAppService<TEntity, long, TDto, OrdPagedRequestDto>
        where TEntity : Entity<long>
        where TDto : EntityIdHashDto<long>
    {

    }
    public abstract class OrdCrudAppService<TEntity, TKeyPrimary, TDto>
        : OrdCrudAppService<TEntity, TKeyPrimary, TDto, OrdPagedRequestDto>
        where TEntity : Entity<TKeyPrimary>
        where TDto : EntityIdHashDto<TKeyPrimary>
    {

    }

    public abstract class OrdCrudAppService<TEntity, TKeyPrimary, TDto, TGetPagedInput>
        : OrdCrudAppService<TEntity, TKeyPrimary, TDto, TDto, TDto, TGetPagedInput>
        where TEntity : Entity<TKeyPrimary>
        where TDto : EntityIdHashDto<TKeyPrimary>
        where TGetPagedInput : OrdPagedRequestDto
    {

    }

    [OrdAuth]
    public abstract class OrdCrudAppService<TEntity, TKeyPrimary, TGetPaged, TGetById, TCreateOrUpdateDto, TGetPagedInput>
        : ApplicationService
        where TEntity : Entity<TKeyPrimary>
        where TGetPaged : EntityIdHashDto<TKeyPrimary>
        where TGetById : EntityIdHashDto<TKeyPrimary>
        where TCreateOrUpdateDto : EntityIdHashDto<TKeyPrimary>
    where TGetPagedInput : OrdPagedRequestDto
    {
        public IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();

        [HttpPost]
        public virtual async Task<PagedResultDto<TGetPaged>> GetPaged(TGetPagedInput input)
        {
            await AppFactory.CheckPermissionAsync(PolicyGetPaged(), true);
           // var listCriteria = await GetPagedCriterias(input);
            return null;
        }
        [HttpPost]
        public virtual async Task<IActionResult> ExportPagedResult(TGetPagedInput input)
        {
            var bytes = await AppFactory.EpplusExporting.ExportDataTable(
                input,
                input => GetPaged(input as TGetPagedInput),
                GetExcelCells().ToArray()
            );
            return new FileContentResult(bytes, FileExtensionMapping.Mappings[".xlsx"]);
        }

        [HttpGet]
        public virtual async Task<TGetById> GetById(string findIdHash)
        {
            await AppFactory.CheckPermissionAsync(PrefixPolicyMain(), true);
            var id = AppFactory.DecryptHashId(findIdHash);
            return null;
        }
        [HttpPost]
        public virtual async Task<CommonResultDto<TCreateOrUpdateDto>> CreateOrUpdate(TCreateOrUpdateDto input)
        {
            await AppFactory.CheckPermissionAsync(PrefixPolicyMain(), true);
            var isUpdate = !string.IsNullOrEmpty(input.IdHash);
            if (isUpdate)
            {
                input.Id = default(TKeyPrimary);
                var id = AppFactory.DecryptHashId(input.IdHash);
                var keyType = typeof(TKeyPrimary);
                if (keyType == typeof(int))
                {
                    input.Id = (TKeyPrimary)(object)Convert.ToInt32(id);
                }
                else if (keyType == typeof(Guid))
                {
                    input.Id = (TKeyPrimary)(object)Guid.Parse(id);
                }
                else if (keyType == typeof(long))
                {
                    input.Id = (TKeyPrimary)(object)Convert.ToInt64(id);
                }
            }

            var result = await AppFactory.CreateOrUpdateEntity<TEntity, TKeyPrimary, TCreateOrUpdateDto>(
                input,
                GetEntityName(),
                isUpdate,
                setter: CreateOrUpdateSetterEntity
                );
            if (result.IsSuccessful)
            {
                await ClearCache();
            }
            return result;

        }
        [HttpPost]
        public async Task<CommonResultDto<TGetById>> Remove(string removeHashId)
        {
            var dto = await GetById(removeHashId);
            if (dto != null)
            {
               
            }
            return CommonResultDto<TGetById>.Ok(dto);
        }

        [HttpGet]
        public async Task<IEnumerable<ComboOptionDto>?> GetComboOptions()
        {
            return await AppFactory.ComboOptionsCache().GetOrAddAsync(
                GetPrefixKeyCache() + ".Combo",
                async () =>
                {
                    return null;
                    //var criteriaSql = CriteriaSqlUtil.Builder;
                    //AddWhereCombo(criteriaSql);
                    //var items = await Dao.GetListAsync<TGetById>(criteriaSql);
                    //return items.Select(x => new ComboOptionDto()
                    //{
                    //    Value = x.Id,
                    //    Data = x,
                    //    DisplayName = GetLabelCombo(x),
                    //});

                }, () => new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(30)
                });
        }

        [HttpPost]
        public async Task ClearCache()
        {
            await AppFactory.RemoveRedisCacheContainKey(GetPrefixKeyCache());
        }

        protected virtual string PolicyGetPaged()
        {
            return string.IsNullOrEmpty(PrefixPolicyMain()) ? string.Empty : PrefixPolicyMain() + ".GetPaged";
        }
        protected virtual string PolicyGetById()
        {
            return PrefixPolicyMain();
        }
        protected virtual string PolicyCreateOrUpdate()
        {
            return string.IsNullOrEmpty(PrefixPolicyMain()) ? string.Empty : PrefixPolicyMain() + ".CreateOrUpdate";
        }
        protected virtual string PolicyRemove()
        {
            return string.IsNullOrEmpty(PrefixPolicyMain()) ? string.Empty : PrefixPolicyMain() + ".Remove";
        }


        protected virtual string PrefixPolicyMain()
        {
            return "";
        }

        protected virtual List<string> GetBaseColumnsGet()
        {
            return new List<string>();
        }
        protected virtual List<string> GetBaseColumnsGetPaged()
        {
            return new List<string>();
        }

        protected virtual string GetPrefixKeyCache()
        {
            var key = new StringBuilder(GetEntityName());
            if (AppFactory?.CurrentTenant?.Id.HasValue == true)
            {
                key.Append(AppFactory.CurrentTenant.Id.Value.ToString("N"));
            }
            if (AppFactory?.CurrentShop?.ShopId.HasValue == true)
            {
                key.Append(AppFactory.CurrentShop.ShopId.Value);
            }
            return key.ToString();
        }

        protected virtual List<OrdExportColumnData<TGetPaged>> GetExcelCells()
        {
            return new List<OrdExportColumnData<TGetPaged>>();
        }

        protected virtual void CreateOrUpdateSetterEntity(TCreateOrUpdateDto dto, TEntity entity, bool isCreate)
        {

        }
        protected abstract string GetEntityName();
        protected abstract string? GetLabelCombo(TGetById item);
    }
}