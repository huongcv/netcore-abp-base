using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Auth.Shared.Entities
{
    [Table("PermissionGrants")]
    public class PermissionGrantEntity : Entity<long>, IMultiTenant
    {
        /// <summary>
        /// USER hoặc ROLE
        /// </summary>
        [MaxLength(20)]
        public string? ProviderName { get; set; }
        /// <summary>
        /// UserId hoặc RoleId
        /// </summary>
        public Guid ProviderId { get; set; }
        [MaxLength(200)]
        public string? PermissionName { get; set; }
        public Guid? TenantId { get; set; }
    }
}
