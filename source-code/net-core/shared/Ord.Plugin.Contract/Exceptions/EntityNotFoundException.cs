namespace Ord.Plugin.Contract.Exceptions
{
    public class EntityNotFoundException(string message = "not_found") : OrdCommonException(CommonResultCode.NotFound, message)
    {
    }
}
