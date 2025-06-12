namespace Ord.Plugin.Contract.Features.Notifications
{
    public interface INotificationPublisher
    {
        Task PublishAsync(NotificationPublishDto input);
    }
}
