using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Auth.Shared.Entities
{
    [Table("UserClaims")]
    public class UserClaimEntity : Entity<Guid>
    {
        public Guid UserId { get; set; }
        public Guid? TenantId { get; set; }
        [MaxLength(200)]
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
