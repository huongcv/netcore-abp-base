using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Auth.Shared.Entities
{
    [Table("PermissionUsers")]
    public class PermissionUserEntity : Entity<Guid>
    {
        public Guid UserId { get; set; }
        [MaxLength(200)]
        public string? PermissionName { get; set; }
        public bool IsGrant { get; set; }
    }
}
