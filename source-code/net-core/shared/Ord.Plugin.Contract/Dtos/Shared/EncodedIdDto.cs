using Ord.Plugin.Contract.Dtos;

namespace Ord
{
    public class EncodedIdDto: IHasEncodedId
    {
        public string? EncodedId { get; set; }
    }

    public class SetActiveStatusDto : EncodedIdDto
    {
        public bool IsActived { get; set; }
    }
    public class MultiEncodedIdDto
    {
        public List<string> EncodedIds { get; set; }
    }
}
