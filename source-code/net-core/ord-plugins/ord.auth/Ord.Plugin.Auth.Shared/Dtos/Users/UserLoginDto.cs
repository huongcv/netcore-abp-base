using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class UserLoginDto : UserBaseDto
    {
        public Guid Id { get; set; }
        public Guid? TenantId { get; set; }
        public string? PasswordHash { get; set; }
        public int AccessFailedCount { get; set; }
        public virtual bool IsLockoutEnabled { get; set; }
        public virtual DateTimeOffset? LockoutEnd { get; set; }
        public virtual DateTime? ChangePasswordDateTime { get; set; }
        public bool IsAdminTenancy => !string.IsNullOrEmpty(Level) && Level == UserConst.AdminTenantLevel;
    }
}
