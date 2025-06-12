namespace Ord.Plugin.Auth.AppServices.Host
{
    [OrdAuth]
    public class RoleHostAppService:RoleAppService
    {
        protected override string GetBasePermissionName()
        {
            AppFactory.CheckHostUser();
            return "AuthPlugin.Host.Role";
        }
    }
}
