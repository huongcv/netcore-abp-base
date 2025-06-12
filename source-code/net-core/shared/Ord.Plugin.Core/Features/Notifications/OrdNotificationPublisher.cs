using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Base;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;

namespace Ord.Plugin.Core.Features.Notifications
{
    public class OrdNotificationPublisher(IRepository<NotificationInfoEntity, Guid> notificationRepository) : OrdManagerBase, IOrdNotificationPublisher
    {
        [UnitOfWork]
        public async Task PublishAsync(NotificationPublishDto input)
        {
            var data = input.Data;
            var notificationInfo = new NotificationInfoEntity()
            {
                NotificationName = input.NotificationName,
                Body = input.Body,
                Title = input.Title,
                Data = data != null ? data.ToJsonString() : (string?)null,
                Severity = input.Severity ?? NotificationSeverity.Info
            };
            await notificationRepository.InsertAsync(notificationInfo);
        }
    }
}
