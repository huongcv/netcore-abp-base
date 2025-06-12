using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Shared.Dtos.Notifications;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Notifications.Entities;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Utils;
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
        private IIdEncoderService<UserNotificationEntity, Guid> IdEncoder => AppFactory.GetServiceDependency<IIdEncoderService<UserNotificationEntity, Guid>>();
        [HttpPost]
        public async Task<CommonResultDto<PagedResultDto<UserNotificationDto>>> GetUserNotificationsAsync(GetUserNotificationInput input)
        {
            var userId = AppFactory.CurrentUserId.Value;
            var result = await NotificationRepository.GetUserNotificationsAsync(userId, input);
            AppFactory.EncodeIdPagedItems<UserNotificationEntity,Guid, UserNotificationDto>(result);
            return AppFactory.CreateSuccessResult(result);
        }

        [HttpPost]
        public async Task<CommonResultDto<bool>> MarkAsReadAsync(EncodedIdDto input)
        {
            if (IdEncoder.TryDecodeId(input.EncodedId,out var userNotificationId))
            {
                var userId = AppFactory.CurrentUserId.Value;
                // Kiểm tra quyền truy cập
                var canAccess = await UserNotificationRepository.CanUserAccessNotificationAsync(userId, userNotificationId);
                if (!canAccess)
                {
                    return AppFactory.CreateBadRequestResult<bool>(GetAccessDeniedMessage());
                }
                await UserNotificationRepository.MarkAsReadAsync(userNotificationId);
                return AppFactory.CreateSuccessResult(true, "auth.notification.marked_as_read");
            }
            return AppFactory.CreateNotFoundResult<bool>(GetNotFoundMessage());
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> MarkAllAsReadAsync()
        {
            var userId = AppFactory.CurrentUserId.Value;
            await UserNotificationRepository.MarkAllAsReadAsync(userId);
            return AppFactory.CreateSuccessResult(true, "auth.notification.all_marked_as_read");
        }

        [HttpPost]
        public async Task<CommonResultDto<bool>> RemoveAsync(EncodedIdDto input)
        {
            if (IdEncoder.TryDecodeId(input.EncodedId, out var userNotificationId))
            {
                var userId = AppFactory.CurrentUserId.Value;
                // Kiểm tra quyền truy cập
                var canAccess = await UserNotificationRepository.CanUserAccessNotificationAsync(userId, userNotificationId);
                if (!canAccess)
                {
                    return AppFactory.CreateBadRequestResult<bool>(GetAccessDeniedMessage());
                }
                await UserNotificationRepository.DeleteAsync(userNotificationId);
                return AppFactory.CreateSuccessResult(true, GetDeleteSuccessMessage());
            }
            return AppFactory.CreateNotFoundResult<bool>(GetNotFoundMessage());
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
