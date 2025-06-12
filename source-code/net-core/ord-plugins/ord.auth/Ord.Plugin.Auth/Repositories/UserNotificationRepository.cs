using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Features.Notifications.Entities;

namespace Ord.Plugin.Auth.Repositories
{
    public class UserNotificationRepository(IAppFactory appFactory) : OrdAuthBaseRepository<UserNotificationEntity, Guid>(appFactory)
    {
        public async Task MarkAsReadAsync(Guid userId, Guid notificationId)
        {
            await UpdateByConditionAsync(
                x => x.UserId == userId && x.NotificationId == notificationId,
                x => { x.State = true; }
            );
        }

        public async Task MarkAllAsReadAsync(Guid userId)
        {
            await UpdateByConditionAsync(
                x => x.UserId == userId && !x.State,
                x => x.State = true
            );
        }

        public async Task DeleteUserNotificationAsync(Guid userId, Guid notificationId)
        {
            await DeleteAsync(x => x.UserId == userId && x.NotificationId == notificationId);
        }

        public async Task<bool> CanUserAccessNotificationAsync(Guid userId, Guid notificationId)
        {
            var queryable = await GetQueryableAsync();
            return await queryable.AnyAsync(x => x.UserId == userId && x.NotificationId == notificationId);
        }
    }
}
