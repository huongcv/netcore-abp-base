using Ord.Plugin.Contract.Features.Authorization.Users;

namespace Ord.Plugin.Contract.Features.Notifications
{
    public class NotificationPublishDto
    {
        public string NotificationName { get; private set; }
        public string Title { get; private set; }
        public string Body { get; private set; }
        public Dictionary<string, object?>? Data { get; private set; }
        public NotificationSeverity? Severity { get; set; } = Notifications.NotificationSeverity.Info;
        public IEnumerable<UserIdentifier> Users { get; set; }
        public IEnumerable<UserIdentifier> ExcludedUsers { get; set; }
        public IEnumerable<Guid?> Tenants { get; set; }
        public List<NotificationChannel> Channels { get; set; } = new();

        protected NotificationPublishDto()
        {

        }

        public NotificationPublishDto(string notificationName, string title, string body, Dictionary<string, object?> data = null)
        {
            NotificationName = notificationName;
            Title = title;
            Body = body;
            Data = data;
        }
    }
}
