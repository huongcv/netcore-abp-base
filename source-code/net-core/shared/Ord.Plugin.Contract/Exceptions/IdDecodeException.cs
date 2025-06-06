namespace Ord.Plugin.Contract.Exceptions
{
    public class IdDecodeException : Exception
    {
        /// <summary>
        /// Entity type gây ra lỗi
        /// </summary>
        public string EntityType { get; }

        /// <summary>
        /// Encoded ID gây ra lỗi
        /// </summary>
        public string EncodedId { get; }

        public IdDecodeException(string encodedId, string entityType = null)
            : base("IdDecodeInvalid")
        {
            EntityType = entityType;
            EncodedId = encodedId;
        }
    }
}
