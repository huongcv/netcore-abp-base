using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Auth.Shared.Entities
{
    [Table("UserRoles")]
    public class UserRoleEntity : Entity<int>, IHasCreationTime, IMultiTenant
    {
        public Guid? TenantId { get; set; }
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
