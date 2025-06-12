namespace Ord.Plugin.Contract.Features.Notifications
{
    public interface IOrdNotificationPublisher
    {
        Task PublishAsync(
            string notificationName,
            NotificationData data = null,
            NotificationSeverity severity = NotificationSeverity.Info,
            UserIdentifier[] userIds = null,
            UserIdentifier[] excludedUserIds = null,
            Guid?[] tenantIds = null);
        void Publish(
            string notificationName,
            NotificationData data = null,
            NotificationSeverity severity = NotificationSeverity.Info,
            UserIdentifier[] userIds = null,
            UserIdentifier[] excludedUserIds = null,
            Guid?[] tenantIds = null);
    }
}
