using Ord.Plugin.Contract.Features.Notifications;
using Volo.Abp.Domain.Services;
using Volo.Abp.Uow;
using Volo.Abp.Validation;

namespace Ord.Plugin.Core.Features.Notifications
{
    public class OrdNotificationPublisher : DomainService, IOrdNotificationPublisher
    {
        [UnitOfWork]
        public Task PublishAsync(string notificationName, NotificationData data = null,
            NotificationSeverity severity = NotificationSeverity.Info, UserIdentifier[] userIds = null,
            UserIdentifier[] excludedUserIds = null, Guid?[] tenantIds = null)
        {
            if (notificationName.IsNullOrEmpty())
            {
                throw new AbpValidationException("NotificationName can not be null or whitespace!");
            }

            throw new NotImplementedException();
        }

        public void Publish(string notificationName, NotificationData data = null,
            NotificationSeverity severity = NotificationSeverity.Info, UserIdentifier[] userIds = null,
            UserIdentifier[] excludedUserIds = null, Guid?[] tenantIds = null)
        {
            throw new NotImplementedException();
        }
    }
}
