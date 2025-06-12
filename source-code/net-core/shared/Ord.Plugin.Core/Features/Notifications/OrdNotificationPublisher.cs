using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Core.Base;
using Volo.Abp.Uow;

namespace Ord.Plugin.Core.Features.Notifications
{
    public class OrdNotificationPublisher(INotificationManager notificationManager) : OrdManagerBase, IOrdNotificationPublisher
    {
        [UnitOfWork]
        public async Task PublishAsync(NotificationPublishDto input)
        {
            var notificationId = await notificationManager.CreateAsync(input);
            var users = await notificationManager.GetTargetUserIdsAsync(input);
        }
    }
}
