using Ord.Plugin.Contract.Features.Authorization.Users;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Contract.Features.Notifications
{
    public interface INotificationManager : IDomainService
    {
        Task<IEnumerable<UserIdentifier>> GetTargetUserIdsAsync(NotificationPublishDto input);
        Task<Guid> CreateAsync(NotificationPublishDto input);
    }
}
