using Microsoft.EntityFrameworkCore.ChangeTracking;
using Ord.Domain.Entities.MasterData;
using Ord.EfCore.Default.MigrateDb.ModelBuilders;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Auditing;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

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
        public virtual DbSet<DistrictEntity> Districts { get; set; }
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
        public override int SaveChanges()
        {
            SetAuditProperties();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SetAuditProperties();
            return await base.SaveChangesAsync(cancellationToken);
        }
        protected virtual void SetAuditProperties()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            var now = DateTime.Now;

            foreach (var entry in entries)
            {
                SetAuditPropertiesForEntry(entry, now);
            }
        }

        protected virtual void SetAuditPropertiesForEntry(EntityEntry entry, DateTime now)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    SetCreationAuditProperties(entry.Entity, now);
                    break;
            }
        }

        protected virtual void SetCreationAuditProperties(object entity, DateTime now)
        {
            // Set CreationTime
            if (entity is IHasCreationTime hasCreationTime)
            {
                if (hasCreationTime.CreationTime == default)
                {
                    // Cách 1: Sử dụng reflection để set private field
                    var creationTimeProperty = entity.GetType().GetProperty("CreationTime");
                    if (creationTimeProperty != null && creationTimeProperty.CanWrite)
                    {
                        creationTimeProperty.SetValue(entity, now);
                    }
                    else
                    {
                        // Cách 2: Tìm backing field
                        var creationTimeField = entity.GetType()
                            .GetFields(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                            .FirstOrDefault(f => f.Name.Contains("CreationTime") || f.Name.Contains("creationTime"));

                        if (creationTimeField != null)
                        {
                            creationTimeField.SetValue(entity, now);
                        }
                    }
                }
            }
        }
    }
}
