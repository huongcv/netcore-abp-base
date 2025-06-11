using Ord.Plugin.Auth.Shared.Dtos.Roles;
using Ord.Plugin.Auth.Shared.Entities;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface IRoleTemplateManager : IDomainService
    {
        Task<RoleEntity> CreateTemplateRoleAsync(CreateTemplateRoleDto input);

        Task<RoleEntity> CreateRoleFromTemplateAsync(Guid templateRoleId, Guid tenantId,
            CreateRoleFromTemplateDto input);
    }
}
