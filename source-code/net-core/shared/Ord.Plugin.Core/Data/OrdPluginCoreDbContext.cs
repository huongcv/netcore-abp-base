using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Contract.Features.Notifications.Entities;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Data
{
    public class OrdPluginCoreDbContext : AbpDbContext<OrdPluginCoreDbContext>
    {
        public virtual DbSet<NotificationInfoEntity> Notifications { get; set; }
        public virtual DbSet<UserNotificationEntity> UserNotifications { get; set; }
        public OrdPluginCoreDbContext(DbContextOptions<OrdPluginCoreDbContext> options) : base(options)
        {
        }
    }
}
