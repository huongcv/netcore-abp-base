using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Core.Base;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Core.Features.Notifications
{
    public class NotificationManager(IRepository<NotificationInfoEntity, Guid> notificationRepository) : OrdManagerBase
    {
    }
}
