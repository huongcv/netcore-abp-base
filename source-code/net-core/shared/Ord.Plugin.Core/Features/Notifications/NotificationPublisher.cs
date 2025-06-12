using Ord.Plugin.Contract.Features.Authorization.Users;
using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Core.Base;
using Volo.Abp.Uow;

namespace Ord.Plugin.Core.Features.Notifications
{
    public class NotificationPublisher(INotificationManager notificationManager) : OrdManagerBase, INotificationPublisher
    {
        [UnitOfWork]
        public async Task PublishAsync(NotificationPublishDto input)
        {
            var users = await notificationManager.GetTargetUserIdsAsync(input);
            if (input.Channels?.Any() != true)
            {
                return;
            }
            if (input.Channels?.Any(x => x == NotificationChannel.InApp) == true)
            {
                var notificationId = await notificationManager.CreateAsync(input);
            }
            var channelServices = AppFactory.GetServiceDependency<IEnumerable<INotificationChannel>>();
            if (channelServices?.Any() != true)
            {
                return;
            }
            foreach (var channelType in input.Channels)
            {

                foreach (var user in users)
                {
                    await SendThroughChannelsAsync(channelServices, channelType,user, input);
                }
            }

        }
        private async Task SendThroughChannelsAsync(
            IEnumerable<INotificationChannel> channelServices,
            NotificationChannel channel,
            UserIdentifier user,
            NotificationContentDto notificationInfo)
        {
            foreach (var channelSer in channelServices)
            {
                if (channelSer.ChannelType.Equals(channel))
                {
                    await channelSer.SendAsync(user, notificationInfo);
                }
            }
        }
    }
}
