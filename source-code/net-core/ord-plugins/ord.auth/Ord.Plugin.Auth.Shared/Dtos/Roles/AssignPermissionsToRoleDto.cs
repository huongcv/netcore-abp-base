namespace Ord.Plugin.Auth.Shared.Dtos.Roles
{
    public class AssignPermissionsToRoleDto : EncodedIdDto
    {
        public List<string>? PermissionNames { get; set; }
    }
}
