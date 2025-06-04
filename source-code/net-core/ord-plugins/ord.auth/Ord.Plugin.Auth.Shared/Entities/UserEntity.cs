using Ord.Plugin.Contract.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Ord.Contract.Entities
{
    [Table("Users")]
    public class UserEntity : FullAuditedEntity<Guid>, IMultiTenant, IHasActived
    {
        [Required]
        [MaxLength(200)]
        public string UserName { get; set; }
        [MaxLength(300)]
        public string? Email { get; set; }
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
        [MaxLength(200)]
        public string? Name { get; set; }
        [MaxLength(300)]
        public string? PasswordHash { get; set; }
        [MaxLength(30)]
        public string? Level { get; set; }
        public Guid? TenantId { get; set; }
        public bool IsActived { get; set; }
        public virtual bool IsLockoutEnabled { get; set; }
        public virtual DateTimeOffset? LockoutEnd { get; set; }
        [MaxLength(100)]
        public virtual string? PasswordResetCode { get; set; }
        public int AccessFailedCount { get; set; }
        public bool MustChangePassword { get; set; }
        public DateTime? ChangePasswordDateTime { get; set; }
        public DateTime? BirthDay { get; set; }

        public UserEntity()
        {

        }
        public UserEntity(Guid id) : base(id)
        {

        }
    }
}
