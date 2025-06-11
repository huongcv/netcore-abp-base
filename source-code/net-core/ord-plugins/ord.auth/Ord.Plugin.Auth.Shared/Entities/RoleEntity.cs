using Ord.Plugin.Contract.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Auth.Shared.Entities
{  /// <summary>
   /// Bảng phân quyền hệ thống
   /// </summary>
    [Table("Roles")]
    public class RoleEntity : FullAuditedEntity<Guid>, IMultiTenant, IHasActived
    {
        [MaxLength(100)]
        public string Code { get; set; }
        [MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
        public Guid? TenantId { get; set; }
        public bool IsActived { get; set; }

        /// <summary>
        /// Tham chiếu đến Role Template (Host Role) để thừa kế permissions
        /// Chỉ role của tenant mới có thể có TemplateRoleId
        /// </summary>
        public Guid? TemplateRoleId { get; set; }

        /// <summary>
        /// Đánh dấu đây có phải là Template Role (Host Role) không
        /// Template Role sẽ có TenantId = null và IsTemplate = true
        /// </summary>
        public bool IsTemplate { get; set; } = false;
    }
}
