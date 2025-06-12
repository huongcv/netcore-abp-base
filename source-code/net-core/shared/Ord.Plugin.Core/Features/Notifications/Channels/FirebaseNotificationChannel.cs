using Ord.Plugin.Contract.Features.Authorization.Users;
using Ord.Plugin.Contract.Features.Notifications;

namespace Ord.Plugin.Core.Features.Notifications.Channels
{
    public class FirebaseNotificationChannel : NotificationChannelBase
    {
        public override NotificationChannel ChannelType => NotificationChannel.Firebase;
        public override async Task SendAsync(UserIdentifier user, NotificationContentDto notificationDto)
        {
            // TODO: Implement Firebase notification logic
            // Lấy Firebase token của user và gửi thông báo
        }
    }
}
