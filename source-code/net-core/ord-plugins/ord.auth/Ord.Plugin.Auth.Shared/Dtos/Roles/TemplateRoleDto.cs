namespace Ord.Plugin.Auth.Shared.Dtos.Roles
{
    public class CreateTemplateRoleDto: RoleCrudBase
    {
        public List<string>? Permissions { get; set; }
    }

    public class UpdateTemplateRoleDto: RoleCrudBase
    {
        public List<string>? Permissions { get; set; }
        public bool SyncToTenantRoles { get; set; } = true;
    }

    public class CreateRoleFromTemplateDto : RoleCrudBase
    {
        public string? Code { get; set; } // Nếu null, sẽ dùng code của template
        public string? Name { get; set; } // Nếu null, sẽ dùng name của template
        public string? Description { get; set; }
        public bool IsAutoSyncFromTemplate { get; set; } = true;
        public bool IsActived { get; set; } = true;
    }

    public class TemplateRoleDto : RolePagedDto
    {
        public bool IsTemplate { get; set; }
        public long Version { get; set; }
        public int DerivedRolesCount { get; set; }
        public List<string>? Permissions { get; set; }
    }

    public class TenantRoleWithTemplateDto : RolePagedDto
    {
        public Guid? TemplateRoleId { get; set; }
        public string? TemplateRoleName { get; set; }
        public bool IsAutoSyncFromTemplate { get; set; }
        public DateTime? LastTemplateSyncTime { get; set; }
        public long? TemplateVersion { get; set; }
        public bool IsTemplateChanged { get; set; }
    }

    public class SyncFromTemplateDto : EncodedIdDto
    {
        public bool ForceSync { get; set; } = false;
    }

    public class AttachToTemplateDto : EncodedIdDto
    {
        public string TemplateRoleEncodedId { get; set; }
        public bool SyncImmediately { get; set; } = true;
        public bool IsAutoSyncFromTemplate { get; set; } = true;
    }
}
