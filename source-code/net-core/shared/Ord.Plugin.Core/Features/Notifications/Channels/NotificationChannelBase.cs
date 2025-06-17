using Ord.Domain.Enums;
using Ord.Plugin.Contract.Features.Authorization.Users;
using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Core.Base;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Features.Notifications.Channels
{
    public abstract class NotificationChannelBase : OrdManagerBase, INotificationChannel, ITransientDependency
    {
        public virtual Task SendAsync(UserIdentifier user, NotificationContentDto notificationDto)
        {
            throw new NotImplementedException();
        }

        public abstract NotificationChannel ChannelType { get; }
    }
}
