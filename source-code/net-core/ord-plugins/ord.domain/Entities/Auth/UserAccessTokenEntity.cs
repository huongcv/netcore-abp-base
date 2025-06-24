using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Ord.Domain.Entities.Auth
{
    [Table("UserAccessTokens")]
    public class UserAccessTokenEntity : FullAuditedEntity<Guid>, IMultiTenant
    {
        public Guid? TenantId { get; set; }
        /// <summary>
        /// ID của người dùng
        /// </summary>
        public Guid UserId { get; set; }
        /// <summary>
        /// JWT Token ID (JTI claim)
        /// </summary>
        [MaxLength(100)]
        public string TokenId { get; set; }
        [MaxLength(500)]
        public string? TokenHash { get; set; }

        /// <summary>
        /// Thời gian hết hạn của access token
        /// </summary>
        public DateTime ExpiresAt { get; set; }
        /// <summary>
        /// Địa chỉ IP khi tạo token
        /// </summary>
        [MaxLength(50)]
        public string? IpAddress { get; set; }
        /// <summary>
        /// User Agent của thiết bị
        /// </summary>
        [MaxLength(500)]
        public string? UserAgent { get; set; }
        /// <summary>
        /// Tên thiết bị/ứng dụng
        /// </summary>
        [MaxLength(200)]
        public string? DeviceName { get; set; }

        /// <summary>
        /// Platform: web, mobile, desktop
        /// </summary>
        [MaxLength(20)]
        public string? Platform { get; set; }
        /// <summary>
        /// Thời gian sử dụng token lần cuối
        /// </summary>
        public DateTime? LastUsedAt { get; set; }
        /// <summary>
        /// Trạng thái token: active, revoked, expired
        /// </summary>
        [MaxLength(20)]
        public string Status { get; set; } = "active";

        /// <summary>
        /// Lý do thu hồi token (nếu có)
        /// </summary>
        [MaxLength(200)]
        public string? RevokeReason { get; set; }

        /// <summary>
        /// Thời gian thu hồi token
        /// </summary>
        public DateTime? RevokedAt { get; set; }

        public bool IsExpired => DateTime.Now > ExpiresAt;
        public bool IsValid => Status == "active" && !IsExpired;

    }
}
