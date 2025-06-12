using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Shared.Dtos.Notifications;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Base;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    public class NotificationAppService : OrdAppServiceBase
    {
        private INotificationRepository NotificationRepository =>
            AppFactory.GetServiceDependency<INotificationRepository>();
        private IUserNotificationRepository UserNotificationRepository =>
            AppFactory.GetServiceDependency<IUserNotificationRepository>();
        [HttpPost]
        public async Task<CommonResultDto<PagedResultDto<UserNotificationDto>>> GetUserNotificationsAsync(GetUserNotificationInput input)
        {
            var userId = AppFactory.CurrentUserId.Value;
            var result = await NotificationRepository.GetUserNotificationsAsync(userId, input);
            return AppFactory.CreateSuccessResult(result);
        }

        [HttpPost]
        public async Task<CommonResultDto<bool>> MarkAsReadAsync(Guid notificationId)
        {
            var userId = AppFactory.CurrentUserId.Value;

            // Kiểm tra quyền truy cập
            var canAccess = await UserNotificationRepository.CanUserAccessNotificationAsync(userId, notificationId);
            if (!canAccess)
            {
                return AppFactory.CreateBadRequestResult<bool>("notification.access_denied");
            }
            await UserNotificationRepository.MarkAsReadAsync(userId, notificationId);
            return AppFactory.CreateSuccessResult(true, "notification.marked_as_read");
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> MarkAllAsReadAsync()
        {
            var userId = AppFactory.CurrentUserId.Value;
            await UserNotificationRepository.MarkAllAsReadAsync(userId);
            return AppFactory.CreateSuccessResult(true, "notification.all_marked_as_read");
        }

        [HttpPost]
        public async Task<CommonResultDto<bool>> DeleteNotificationAsync(Guid notificationId)
        {
            var userId = AppFactory.CurrentUserId.Value;

            // Kiểm tra quyền truy cập
            var canAccess = await UserNotificationRepository.CanUserAccessNotificationAsync(userId, notificationId);
            if (!canAccess)
            {
                return AppFactory.CreateBadRequestResult<bool>("notification.access_denied");
            }

            await UserNotificationRepository.DeleteUserNotificationAsync(userId, notificationId);
            return AppFactory.CreateSuccessResult(true, "notification.deleted");
        }

        [HttpGet]
        public async Task<CommonResultDto<int>> GetUnreadCountAsync()
        {
            var userId = AppFactory.CurrentUserId.Value;
            var count = await NotificationRepository.GetUnreadCountAsync(userId);
            return AppFactory.CreateSuccessResult(count);
        }

        [HttpGet]
        public async Task<CommonResultDto<NotificationSummaryDto>> GetNotificationSummaryAsync()
        {
            var userId = AppFactory.CurrentUserId.Value;
            var summary = await NotificationRepository.GetNotificationSummaryAsync(userId);
            return AppFactory.CreateSuccessResult(summary);
        }


        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.Notification";
        }
    }
}
