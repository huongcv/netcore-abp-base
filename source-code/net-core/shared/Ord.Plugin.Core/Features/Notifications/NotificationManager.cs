using Ord.Domain.Enums;
using Ord.Plugin.Contract.Features.Authorization.Users;
using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Contract.Features.Notifications.Entities;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Base;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;

namespace Ord.Plugin.Core.Features.Notifications
{
    public class NotificationManager(IRepository<NotificationInfoEntity, Guid> notificationRepository,
        IRepository<UserNotificationEntity, Guid> userNotificationRepository) : OrdManagerBase, INotificationManager
    {
        private IUserSharedRepository UserSharedRepository => AppFactory.GetServiceDependency<IUserSharedRepository>();
        [UnitOfWork]
        public async Task<Guid> CreateAsync(NotificationPublishDto input)
        {
            var dataFilter = AppFactory.GetServiceDependency<IDataFilter>();
            using (dataFilter.Disable<IMultiTenant>())
            {
                return await DoCreateAsync(input);
            }
        }

        protected async Task<Guid> DoCreateAsync(NotificationPublishDto input)
        {
            // Tạo thông báo chính
            var notificationInfo = new NotificationInfoEntity()
            {
                NotificationName = input.NotificationName,
                Title = input.Title,
                Body = input.Body,
                DataJson = input.Data?.ToJsonString(),
                Severity = input.Severity ?? NotificationSeverity.Info
            };

            await notificationRepository.InsertAsync(notificationInfo, true);

            // Xác định danh sách người dùng nhận thông báo
            var targetUserIds = await GetTargetUserIdsAsync(input);
            // Tạo thông báo cho từng người dùng
            if (targetUserIds.Any())
            {
                var userNotificationEntities = new List<UserNotificationEntity>();
                foreach (var user in targetUserIds)
                {
                    userNotificationEntities.Add(new UserNotificationEntity()
                    {
                        UserId = user.UserId,
                        TenantId = user.TenantId,
                        State = false,
                        NotificationId = notificationInfo.Id
                    });
                }
                await userNotificationRepository.InsertManyAsync(userNotificationEntities);
            }
            return notificationInfo.Id;
        }

        public async Task<IEnumerable<UserIdentifier>> GetTargetUserIdsAsync(NotificationPublishDto input)
        {
            var userIds = new HashSet<UserIdentifier>();

            // Thêm người dùng được chỉ định cụ thể
            if (input.Users?.Any() == true)
            {
                foreach (var user in input.Users)
                {
                    userIds.Add(user);
                }
            }

            // Thêm người dùng từ tenants
            if (input.Tenants?.Any() == true)
            {
                foreach (var tenant in input.Tenants)
                {
                    var tenantUserIds = await UserSharedRepository.GetUsersByTenantsAsync(tenant);
                    foreach (var userId in tenantUserIds)
                    {
                        userIds.Add(new UserIdentifier(tenant, userId));
                    }
                }
            }

            // Loại bỏ người dùng bị loại trừ
            if (input.ExcludedUsers?.Any() == true)
            {
                userIds.RemoveWhere(userIdentifier => input.ExcludedUsers.Any(excluded => excluded.UserId == userIdentifier.UserId));
            }

            return userIds;
        }
    }
}
