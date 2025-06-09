using Ord.Plugin.Contract.Dtos;

namespace Ord
{
    public class EncodedIdDto: IHasEncodedId
    {
        public string? EncodedId { get; set; }
    }
}
