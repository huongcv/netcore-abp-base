using Ord.Plugin.Contract.Features.Authorization.Users;

namespace Ord.Plugin.Contract.Features.Notifications
{

    public class NotificationContentDto
    {
        public string NotificationName { get; private set; }
        public string Title { get; private set; }
        public string Body { get; private set; }
        public Dictionary<string, object?>? Data { get; set; }
        public NotificationSeverity? Severity { get; set; } = Notifications.NotificationSeverity.Info;

        protected NotificationContentDto()
        {

        }
        public NotificationContentDto(string notificationName, string title, string body, Dictionary<string, object?>? data = null)
        {
            NotificationName = notificationName;
            Title = title;
            Body = body;
            Data = data;
        }
    }
    public class NotificationPublishDto : NotificationContentDto
    {
        public List<UserIdentifier> Users { get; set; } = new();
        public List<UserIdentifier> ExcludedUsers { get; set; }
        public List<Guid?> Tenants { get; set; }
        public HashSet<NotificationChannel> Channels { get; set; }

        protected NotificationPublishDto() : base()
        {

        }

        public NotificationPublishDto(string notificationName, string title, string body, Dictionary<string, object?>? data = null) : base(notificationName, title, body, data)
        {

        }

        public NotificationPublishDto AddChannel(NotificationChannel channel)
        {
            Channels.Add(channel);
            return this;
        }
        public NotificationPublishDto RemoveChannel(NotificationChannel channel)
        {
            Channels.Remove(channel);
            return this;
        }
    }
}
