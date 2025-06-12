using Ord.Plugin.Contract.Utils;

namespace Ord.Plugin.Contract.Features.Notifications
{
    [Serializable]
    public class NotificationData
    {
        public string? Title { get; set; }
        public string? Body { get; set; }
        public IEnumerable<string>? TitleParameter { get; set; }
        public IEnumerable<string>? BodyParameter { get; set; }

        public override string ToString() => this.ToJsonString();
    }
}
