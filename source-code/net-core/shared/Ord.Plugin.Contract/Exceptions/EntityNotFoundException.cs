namespace Ord.Plugin.Contract.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public bool IsMustGetLocalized = false;
        public EntityNotFoundException(string message = "not_found")
            : base(message)
        {
            IsMustGetLocalized = string.Equals(message, "not_found");
        }
    }
}
