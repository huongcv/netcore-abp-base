using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Contract.Utils;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Uow;
using Volo.Abp.Validation;

namespace Ord.Plugin.Core.Features.Notifications
{
    public class OrdNotificationPublisher : DomainService, IOrdNotificationPublisher
    {
        private readonly IRepository<NotificationInfoEntity, Guid> _notificationRepository;
        [UnitOfWork]
        public async Task PublishAsync(NotificationPublishDto input)
        {
            var data = input.Data;
            var notificationInfo = new NotificationInfoEntity()
            {
                NotificationName = input.NotificationName,
                Data = data != null ? data.ToJsonString() : (string?)null,
                DataTypeName = data?.GetType().AssemblyQualifiedName
            };
        }
        [UnitOfWork]
        public async Task PublishAsync(string notificationName, NotificationData data = null,
            NotificationSeverity severity = NotificationSeverity.Info, UserIdentifier[] userIds = null,
            UserIdentifier[] excludedUserIds = null, Guid?[] tenantIds = null)
        {
            if (notificationName.IsNullOrEmpty())
            {
                throw new AbpValidationException("NotificationName can not be null or whitespace!");
            }

            var notificationInfo = MapNotificationInfoEntity(notificationName, data);
            await _notificationRepository.InsertAsync(notificationInfo);
        }

        protected NotificationInfoEntity MapNotificationInfoEntity(string notificationName, NotificationData? data = null,
            NotificationSeverity severity = NotificationSeverity.Info, UserIdentifier[] userIds = null,
            UserIdentifier[] excludedUserIds = null, Guid?[] tenantIds = null)
        {
            var notificationInfo = new NotificationInfoEntity()
            {
                NotificationName = notificationName,
                Data = data != null ? data.ToJsonString() : (string?)null,
                DataTypeName = data?.GetType().AssemblyQualifiedName
            };
            return notificationInfo;
        }

        
    }
}
