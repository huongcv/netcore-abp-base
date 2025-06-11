using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos.Roles;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Volo.Abp.Validation;

namespace Ord.Plugin.Auth.Services
{
    public class RoleTemplateManager(
         IRoleCrudRepository roleCrudRepository,
         IRoleManager roleManager) : OrdAuthManagerBase, IRoleTemplateManager
    {
        public async Task<RoleEntity> CreateTemplateRoleAsync(CreateTemplateRoleDto input)
        {
            var templateRole = await roleCrudRepository.CreateTemplateRoleAsync(input);
            // Assign permissions if provided
            if (input.Permissions?.Any() == true)
            {
                await roleManager.AssignPermissionsToRoleAsync(templateRole.Id, input.Permissions);
            }

            return templateRole;
        }

        public async Task<RoleEntity> CreateRoleFromTemplateAsync(Guid templateRoleId, Guid tenantId, CreateRoleFromTemplateDto input)
        {
            // Get template role
            var templateRole = await roleCrudRepository.GetByIdAsync(templateRoleId);
            if (templateRole == null || !templateRole.IsTemplate)
            {
                throw new AbpValidationException("auth.role.template_role_not_found");
            }

            // Create tenant role
            using (CurrentTenant.Change(tenantId))
            {
                var tenantRole = new RoleEntity()
                {
                    TenantId = tenantId,
                    Code = input.Code ?? templateRole.Code,
                    Name = input.Name ?? templateRole.Name,
                    Description = input.Description ?? templateRole.Description,
                    TemplateRoleId = templateRoleId,
                    IsActived = input.IsActived
                };

                tenantRole = await roleCrudRepository.InsertAsync(tenantRole, autoSave: true);
                return tenantRole;
            }
        }
    }
}
