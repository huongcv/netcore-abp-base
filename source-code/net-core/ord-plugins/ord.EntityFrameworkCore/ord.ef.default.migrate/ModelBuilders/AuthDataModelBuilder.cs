namespace Ord.EfCore.Default.MigrateDb.ModelBuilders
{
    public  class AuthDataModelBuilder
    {
        public static void OnModelCreating(ModelBuilder builder)
        {
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
                });
            });
        }
    }
}
