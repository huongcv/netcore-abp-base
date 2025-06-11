using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Validation.Attributes;

namespace Ord
{
    public class EncodedIdDto : IHasEncodedId
    {
        [OrdValidateRequired]
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
