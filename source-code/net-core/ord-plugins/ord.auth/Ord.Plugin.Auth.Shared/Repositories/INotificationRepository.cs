using Ord.Plugin.Auth.Shared.Dtos.Notifications;
using Ord.Plugin.Contract.Features.Notifications;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface INotificationRepository : IBasicRepository<NotificationInfoEntity, Guid>
    {
        Task<PagedResultDto<UserNotificationDto>>
            GetUserNotificationsAsync(Guid userId, GetUserNotificationInput input);

        Task<int> GetUnreadCountAsync(Guid userId);
        Task<NotificationSummaryDto> GetNotificationSummaryAsync(Guid userId);
    }
}
