namespace Ord.Plugin.Contract.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public class IgnoreJwtCheckAttribute : Attribute
    {
    }
}
