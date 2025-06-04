using Ord.Plugin.Contract.Base;
using Ord.Plugin.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Plugin.Auth.Shared.Entities
{
    [Table("Tenants")]
    public class TenantEntity : FullAuditedEntity<Guid>, IHasActived
    {
        [MaxLength(50)]
        public string Code { get; set; }
        [MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(200)]
        public string? Email { get; set; }
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
        [MaxLength(200)]
        public string? Address { get; set; }
        
        /// <summary>
        /// La kho thuoc
        /// </summary>
        public bool IsStock { get; set; }
        public bool IsActived { get; set; }
        public TenantType Type { get; set; } = TenantType.Other;
    }
}
 