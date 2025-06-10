namespace Ord.Plugin.Contract.Exceptions
{
    public class NotAccessPermissionException(string message = "can_not_access_resource") : OrdCommonException(CommonResultCode.Forbidden, message)
    {
    }
}
