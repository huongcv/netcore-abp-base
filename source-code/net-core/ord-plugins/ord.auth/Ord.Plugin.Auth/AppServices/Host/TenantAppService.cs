using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Shared.Dtos.Tenants;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Services;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    public class TenantAppService: OrdCrudAppService<TenantEntity, Guid, TenantPagedInput, TenantPagedDto, TenantDetailDto, CreateTenantDto, UpdateTenantDto>
    {
        private ITenantCrudRepository TenantCrudRepository => AppFactory.GetServiceDependency<ITenantCrudRepository>();
        protected override
            IOrdCrudRepository<TenantEntity, Guid, TenantPagedInput, TenantPagedDto, TenantDetailDto, CreateTenantDto,
                UpdateTenantDto> CrudRepository
            => TenantCrudRepository;
        protected override string GetBasePermissionName()
        {
            AppFactory.CheckHostUser();
            return "AuthPlugin.Tenant";
        }
        #region Read Operations
        [HttpPost]
        [ActionName("GetComboOptions")]
        public async Task<CommonResultDto<List<ComboOptionDto>>> GetComboOptions(GetComboOptionInputDto input)
        {
            var users = await TenantCrudRepository.GetListComboOptions(input.IncludeUnActive ?? false);
            var options = users.Select(x => new ComboOptionDto
            {
                Value = x.Id,
                DisplayName = x.Name,
                Data = new
                {
                    x.Id,
                    x.PhoneNumber,
                    x.Email,
                    x.Name,
                    x.IsActived,
                    EncodedId = IdEncoderService.EncodeId(x.Id)
                }
            }).ToList();
            return AppFactory.CreateSuccessResult(options);
        }
        #endregion
    }
}
