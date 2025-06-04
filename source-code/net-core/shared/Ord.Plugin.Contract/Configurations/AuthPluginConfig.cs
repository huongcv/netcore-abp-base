namespace Ord.Plugin.Contract.Configurations
{
    public class AuthPluginConfig
    {
        public AuthPluginConfigUserSetting User { get; set; }
        public AuthPluginConfigTenantSetting Tenant { get; set; }

    }
    public class AuthPluginConfigUserSetting
    {
        public bool IsUniqueEmail { get; set; }
    }

    public class AuthPluginConfigTenantSetting
    {
        public string? UserNameAdmin { get; set; }
        public string? PasswordDefault { get; set; }
        public bool MustChangePassword { get; set; }
        public bool SendAccountToEmail { get; set; }
    }
}
