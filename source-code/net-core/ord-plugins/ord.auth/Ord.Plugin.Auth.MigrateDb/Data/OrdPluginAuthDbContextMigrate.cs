using Microsoft.EntityFrameworkCore;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Contract.Features.Notifications.Entities;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Ord.Plugin.Auth.MigrateDb.Data
{
    [ConnectionStringName("OrdPluginAuth")]
    public class OrdPluginAuthDbContextMigrate : AbpDbContext<OrdPluginAuthDbContextMigrate>
    {
        public virtual DbSet<UserEntity> Users { get; set; }
        public virtual DbSet<RoleEntity> Roles { get; set; }
        public virtual DbSet<UserRoleEntity> UserAuthorities { get; set; }
        public virtual DbSet<PermissionGrantEntity> PermissionGrants { get; set; }
        public virtual DbSet<PermissionUserEntity> PermissionUsers { get; set; }
        public virtual DbSet<TenantEntity> Tenants { get; set; }
        public virtual DbSet<SettingEntity> Settings { get; set; }

        public virtual DbSet<NotificationInfoEntity> Notifications { get; set; }
        public virtual DbSet<UserNotificationEntity> UserNotifications { get; set; }
        public virtual DbSet<UserFirebaseDeviceEntity> UserFirebaseDevices { get; set; }

        public OrdPluginAuthDbContextMigrate(DbContextOptions<OrdPluginAuthDbContextMigrate> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => new
                {
                    x.UserName,
                    x.TenantId
                });
                b.HasIndex(x => new
                {
                    x.TenantId
                });
            });
            builder.Entity<RoleEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => new
                {
                    x.TenantId,
                });
                b.HasIndex(x => new
                {
                    x.Code,
                    x.TenantId,
                });
            });
            builder.Entity<UserRoleEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => x.UserId);
                b.HasIndex(x => x.RoleId);
            });
            builder.Entity<PermissionGrantEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => new
                {
                    x.ProviderName,
                    x.ProviderId
                });
            });
            builder.Entity<PermissionUserEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => new
                {
                    x.UserId
                });
            });
            builder.Entity<TenantEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => x.Code);
            });
            builder.Entity<SettingEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => new
                {
                    x.TenantId,
                    x.Name,
                    x.UserId
                }).IsUnique();
                b.HasIndex(x => new
                {
                    x.Type,
                    x.TenantId,
                    x.UserId
                });
                b.HasIndex(x => x.UserId);
                b.HasIndex(x => x.Name);
            });
            builder.Entity<NotificationInfoEntity>(b =>
            {
                b.ConfigureByConvention();
            });
            builder.Entity<UserNotificationEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => new
                {
                    x.UserId,
                    x.CreationTime
                }).IsDescending(false, true);
            });
            builder.Entity<UserFirebaseDeviceEntity>(b =>
            {
                b.ConfigureByConvention();
                b.HasIndex(x => new
                {
                    x.UserId,
                    x.DeviceId
                }).IsDescending(false, false, true);
            });
        }
    }
}
