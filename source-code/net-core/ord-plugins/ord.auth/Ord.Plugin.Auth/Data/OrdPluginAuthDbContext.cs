using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Core.Logging;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Auth.Data
{
    [ConnectionStringName("OrdPluginAuth")]
    public class OrdPluginAuthDbContext : AbpDbContext<OrdPluginAuthDbContext>
    {
        public virtual DbSet<UserEntity> Users { get; set; }
        public virtual DbSet<UserClaimEntity> UserClaims { get; set; }
        public virtual DbSet<RoleEntity> Roles { get; set; }
        public virtual DbSet<UserRoleEntity> UserAuthorities { get; set; }
        public virtual DbSet<PermissionGrantEntity> PermissionGrants { get; set; }
        public virtual DbSet<PermissionUserEntity> PermissionUsers { get; set; }
        public virtual DbSet<TenantEntity> Tenants { get; set; }
        public virtual DbSet<SettingEntity> Settings { get; set; }
        #region  Notification
        public virtual DbSet<NotificationEntity> NotificationEntity { get; set; }
        public virtual DbSet<NotificationUserEntity> NotificationUserEntity { get; set; }
        public virtual DbSet<UserFireBaseTokenEntity> UserFireBaseTokenEntity { get; set; }
        #endregion
      
        
        
        public OrdPluginAuthDbContext(DbContextOptions<OrdPluginAuthDbContext> options) : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(LoggingUtil.SqlQueryLogging())
                .EnableSensitiveDataLogging();
        }

        protected override void ApplyAbpConceptsForModifiedEntity(EntityEntry entry)
        {
            base.ApplyAbpConceptsForModifiedEntity(entry);
            if (entry.Entity is UserEntity userEntity)
            {
                var originalPassword = entry.OriginalValues[nameof(userEntity.PasswordHash)]?.ToString();
                var currentPassword = userEntity.PasswordHash;
                if (originalPassword != currentPassword)
                {
                    userEntity.ChangePasswordDateTime = DateTime.Now;
                    // Save the changes to the database if necessary
                    entry.Property(nameof(userEntity.ChangePasswordDateTime)).IsModified = true;
                }
            }
        }
    }
}
