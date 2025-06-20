﻿using Microsoft.EntityFrameworkCore.ChangeTracking;
using Ord.Domain.Entities.Auth;
using Ord.Domain.Entities.MasterData;
using Ord.Plugin.Contract.Features.Notifications;
using Ord.Plugin.Contract.Features.Notifications.Entities;
using Ord.Plugin.Core.Logging;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.EfCore.Default.EntityFrameworkCore
{
    [ConnectionStringName("Default")]
    public class OrdDefaultDbContext : AbpDbContext<OrdDefaultDbContext>
    {
        #region user,role,auth,notification
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
        public virtual DbSet<FileUploadEntity> FileUploads { get; set; }
        #endregion


        #region MasterData
        public virtual DbSet<CountryEntity> Countries { get; set; }
        public virtual DbSet<ProvinceEntity> Provinces { get; set; }
        public virtual DbSet<DistrictEntity> Districts { get; set; }
        #endregion

        public OrdDefaultDbContext(DbContextOptions<OrdDefaultDbContext> options) : base(options)
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
