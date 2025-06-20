﻿using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Features.Notifications.Entities;

namespace Ord.Plugin.Auth.Repositories
{
    public class UserNotificationRepository(IAppFactory appFactory) : DefaultBaseRepository<UserNotificationEntity, Guid>(appFactory), IUserNotificationRepository
    {
        public async Task MarkAsReadAsync(Guid userId, Guid notificationId)
        {
            await UpdateByConditionAsync(
                x => x.UserId == userId && x.NotificationId == notificationId,
                x => { x.State = true; }
            );
        }
        public async Task MarkAsReadAsync(Guid userNotificationId)
        {
            await UpdateByConditionAsync(
                x => x.Id == userNotificationId,
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

        public async Task<bool> CanUserAccessNotificationAsync(Guid userId, Guid userNotificationId)
        {
            var queryable = await GetQueryableAsync();
            return await queryable.AnyAsync(x => x.UserId == userId && x.Id == userNotificationId);
        }
    }
}
