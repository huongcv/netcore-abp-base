using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos.Notifications;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Contract.Features.Notifications.Entities;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Repositories;

public class NotificationRepository(IAppFactory factory)
    : OrdAuthBaseRepository<NotificationInfoEntity, Guid>(factory), INotificationRepository
{
    public async Task<PagedResultDto<UserNotificationDto>> GetUserNotificationsAsync(Guid userId, GetUserNotificationInput input)
    {
        var notificationQuery = (await GetEntityQueryable<NotificationInfoEntity>())
            .WhereLikeText(input.TextSearch, x => new { x.Title, x.Body })
            .WhereIf(input.Severity.HasValue, x => x.Severity == input.Severity.Value)
            .WhereIf(input.FromDate.HasValue, x => x.CreationTime >= input.FromDate.Value.Date)
            .WhereIf(input.ToDate.HasValue, x => x.CreationTime <= input.ToDate.Value.Date);

        var userNotificationQuery = (await GetEntityQueryable<UserNotificationEntity>())
            .Where(x => x.UserId == userId)
            .WhereIf(input.IsRead.HasValue, x => x.State == input.IsRead.Value);

        var query = from notification in notificationQuery
                    join userNotification in userNotificationQuery
                        on notification.Id equals userNotification.NotificationId
                    orderby notification.CreationTime descending
                    select new UserNotificationDto
                    {
                        Id = userNotification.Id,
                        NotificationName = notification.NotificationName,
                        Title = notification.Title,
                        Body = notification.Body,
                        Severity = notification.Severity,
                        State = userNotification.State,
                        CreationTime = notification.CreationTime
                    };

        return await QueryPagedResultAsync(query, input);
    }

    public async Task<int> GetUnreadCountAsync(Guid userId)
    {
        var userNotificationQuery = await GetEntityQueryable<UserNotificationEntity>();

        return await userNotificationQuery
            .Where(x => x.UserId == userId && !x.State)
            .CountAsync();
    }

    public async Task<NotificationSummaryDto> GetNotificationSummaryAsync(Guid userId)
    {
        var userNotificationQuery = await GetEntityQueryable<UserNotificationEntity>();

        var summary = await userNotificationQuery
            .Where(x => x.UserId == userId)
            .GroupBy(_ => 1)
            .Select(g => new NotificationSummaryDto
            {
                TotalCount = g.Count(),
                UnreadCount = g.Count(x => !x.State),
                ReadCount = g.Count(x => x.State)
            })
            .FirstOrDefaultAsync();

        return summary ?? new NotificationSummaryDto();
    }
}
