using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Tenants;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Services;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    public class TenantAppService : OrdCrudAppService<TenantEntity, Guid, TenantPagedInput, TenantPagedDto, TenantDetailDto, CreateTenantDto, UpdateTenantDto>
    {
        private ITenantCrudRepository TenantCrudRepository => AppFactory.GetServiceDependency<ITenantCrudRepository>();
        protected override
            IOrdCrudRepository<TenantEntity, Guid, TenantPagedInput, TenantPagedDto, TenantDetailDto, CreateTenantDto,
                UpdateTenantDto> CrudRepository
            => TenantCrudRepository;

        protected IUserManager UserManager => AppFactory.GetServiceDependency<IUserManager>();
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

        public override async Task<CommonResultDto<TenantDetailDto>> CreateAsync(CreateTenantDto input)
        {
            var commonResult = await base.CreateAsync(input);
            if (commonResult.IsSuccessful)
            {
                var tenantDto = commonResult.Data;
                await UserManager.CreateDefaultTenantAdmin(tenantDto, input.AdminUsername, input.AdminPassword);
            }

            return commonResult;
        }


        #region User management 
        [HttpPost]
        [ActionName("GetUserPaged")]
        public virtual async Task<CommonResultDto<PagedResultDto<UserPagedDto>>> GetUserPaged(TenantUserPagedInput input)
        {
            if (IdEncoderService.TryDecodeId(input.EncodedId, out var id))
            {
                using (CurrentTenant.Change(id))
                {
                    var userAppService = AppFactory.GetServiceDependency<UserAppService>();
                    var userPaged = AppFactory.ObjectMap<TenantUserPagedInput, UserPagedInput>(input);
                    var result = await userAppService.GetPaged(userPaged);
                    return result;
                }
            }

            return new CommonResultDto<PagedResultDto<UserPagedDto>>();
        }


        #endregion
    }
}
