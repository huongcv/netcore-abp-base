using Ord.Plugin.Contract.Features.Notifications;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface INotificationRepository : IBasicRepository<NotificationInfoEntity, Guid>
    {
    }
}
