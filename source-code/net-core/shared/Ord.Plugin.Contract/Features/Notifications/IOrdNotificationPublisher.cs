namespace Ord.Plugin.Contract.Features.Notifications
{
    public interface IOrdNotificationPublisher
    {
        Task PublishAsync(NotificationPublishDto input);
    }
}
