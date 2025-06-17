using Ord.Domain.Enums;
using Ord.Plugin.Contract.Features.Authorization.Users;

namespace Ord.Plugin.Contract.Features.Notifications
{
    public interface INotificationChannel
    {
        Task SendAsync(UserIdentifier user, NotificationContentDto notificationDto);
        NotificationChannel ChannelType { get; }
    }
}
