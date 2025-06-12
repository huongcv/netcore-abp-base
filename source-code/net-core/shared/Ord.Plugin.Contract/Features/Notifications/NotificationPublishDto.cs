namespace Ord.Plugin.Contract.Features.Notifications
{
    public class NotificationPublishDto
    {
        public string NotificationName { get; private set; }
        public NotificationData? Data { get; private set; }
        public NotificationSeverity? Severity { get; set; } = Notifications.NotificationSeverity.Info;
        public IEnumerable<UserIdentifier> Users { get; set; }
        public IEnumerable<UserIdentifier> ExcludedUsers { get; set; }
        public IEnumerable<Guid?[]> Tenants { get; set; }
        public NotificationType NotificationType { get; set; }
        public List<NotificationChannel> Channels { get; set; } = new();

        protected NotificationPublishDto()
        {

        }

        public NotificationPublishDto(string notificationName, NotificationData data = null)
        {
            NotificationName = notificationName;
            Data = data;
        }
    }
}
