using Ord.Domain.Enums;

namespace Ord.Plugin.Core.Features.Notifications.Channels
{
    public class SocketIoNotificationChannel : NotificationChannelBase
    {
        public override NotificationChannel ChannelType => NotificationChannel.SocketIo;
    }
}
