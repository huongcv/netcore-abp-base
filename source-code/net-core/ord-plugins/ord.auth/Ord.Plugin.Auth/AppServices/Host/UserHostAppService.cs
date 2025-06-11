namespace Ord.Plugin.Auth.AppServices.Host
{
    [OrdAuth]
    public class UserHostAppService : UserAppService
    {
        protected override string GetBasePermissionName()
        {
            AppFactory.CheckHostUser();
            return "AuthPlugin.Host.User";
        }
    }
}
