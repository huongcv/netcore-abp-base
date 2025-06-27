using Ord.Domain.Consts;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Factories.Extensions;
using Volo.Abp;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices.Host
{
    [OrdAuth]
    public class RoleTemplateAppService : RoleAppService
    {
        protected override string GetBasePermissionName()
        {
            AppFactory.CheckHostUser();
            return "AuthPlugin.HostRoleTemplate";
        }

        public override Task<CommonResultDto<PagedResultDto<RolePagedDto>>> GetPaged(RolePagedInput input)
        {
            input.IsTemplate = true;
            return base.GetPaged(input);
        }

        public override Task<CommonResultDto<List<CounterByStatusItemDto>>> GetCountByActive(RolePagedInput input)
        {
            input.IsTemplate = true;
            return base.GetCountByActive(input);
        }

        public override Task<CommonResultDto<RoleDetailDto>> CreateAsync(CreateRoleDto input)
        {
            input.IsTemplate = true;
            return base.CreateAsync(input);
        }

        public override Task<CommonResultDto<RoleDetailDto>> UpdateAsync(UpdateRoleDto input)
        {
            input.IsTemplate = true;
            return base.UpdateAsync(input);
        }

        protected override async Task OnBeforeDeleteAsync(string encodedId)
        {
            var role = await CrudRepository.GetByEncodedIdAsync(encodedId);
            if (role.Code == RoleCodeTemplateConst.TenantAdmin || role.Code == RoleCodeTemplateConst.TenantUser)
            {
                throw new BusinessException(AppFactory.GetLocalizedMessage("message.role_template.not_static_role_tenant"));
            }
        }
        protected override ExportEpplusFileSetting GetExportFileSetting()
        {
            return AppFactory.GetExportFileName("list-role-template");
        }
    }
}
