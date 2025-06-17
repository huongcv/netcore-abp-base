using Ord.Domain.Enums;
using Ord.Plugin.Contract.Features.Notifications;

namespace Ord.Plugin.Core.Features.Notifications.Channels
{
    public class EmailNotificationChannel : NotificationChannelBase
    {
        public override NotificationChannel ChannelType => NotificationChannel.Email;
    }
}
