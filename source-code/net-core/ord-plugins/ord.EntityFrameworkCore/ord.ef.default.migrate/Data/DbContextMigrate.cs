using Microsoft.EntityFrameworkCore;
using Ord.Contract.Entities;
using Ord.Domain.Entities.MasterData;
using Ord.EfCore.Default.MigrateDb.ModelBuilders;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Contract.Features.Notifications.Entities;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Ord.EfCore.Default.MigrateDb.Data
{
    [ConnectionStringName("Default")]
    public class DbContextMigrate : AbpDbContext<DbContextMigrate>
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

        #region MasterData
        public virtual DbSet<CountryEntity> Countries { get; set; }
        public virtual DbSet<ProvinceEntity> Provinces { get; set; }
        #endregion

        public DbContextMigrate(DbContextOptions<DbContextMigrate> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            AuthDataModelBuilder.OnModelCreating(builder);
            MasterDataModelBuilder.OnModelCreating(builder);
        }
    }
}
