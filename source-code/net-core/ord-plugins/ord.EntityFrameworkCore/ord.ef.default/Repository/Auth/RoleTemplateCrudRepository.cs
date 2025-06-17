using Ord.Plugin.Auth.Shared.Dtos.Roles;

namespace Ord.Plugin.Auth.Repositories
{
    public partial class RoleCrudRepository
        : OrdDefaultCrudRepository<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto>,
            IRoleCrudRepository
    {
        public async Task<RoleEntity> CreateTemplateRoleAsync(CreateTemplateRoleDto input)
        {
            using (CurrentTenant.Change(null))
            {
                var createRoleDto = ObjectMap<CreateTemplateRoleDto, CreateRoleDto>(input);
                var roleEntity = await CreateAsync(createRoleDto, true);
                roleEntity.IsTemplate = true;
                return roleEntity;
            }
           
        }
    }
}
