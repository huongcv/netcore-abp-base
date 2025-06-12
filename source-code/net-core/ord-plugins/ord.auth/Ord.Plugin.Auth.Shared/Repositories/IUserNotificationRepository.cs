using Ord.Plugin.Contract.Features.Notifications.Entities;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IUserNotificationRepository : IBasicRepository<UserNotificationEntity, Guid>
    {
        Task MarkAsReadAsync(Guid userId, Guid notificationId);
        Task MarkAllAsReadAsync(Guid userId);
        Task DeleteUserNotificationAsync(Guid userId, Guid notificationId);
        Task<bool> CanUserAccessNotificationAsync(Guid userId, Guid notificationId);
    }
}
