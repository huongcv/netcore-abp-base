namespace Ord.Plugin.Auth.Shared.Dtos.Auths
{
    public class RefreshTokenInfo
    {
        public string Token { get; set; }
        /// <summary>
        /// JWT ID (claim Jti) để liên kết với access token
        /// </summary>
        public string? JwtId { get; set; }
        public Guid UserId { get; set; }
        public Guid? TenantId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime? RevokedAt { get; set; }
        public string? RevokedByIp { get; set; }
        public string? RevokedReason { get; set; }
        public string? DeviceInfo { get; set; }
        public string? UserAgent { get; set; }

        /// <summary>
        /// Kiểm tra token có hợp lệ không (không bị revoke và chưa hết hạn)
        /// </summary>
        public bool IsValid => !IsRevoked && ExpiresAt > DateTime.UtcNow;

        /// <summary>
        /// Kiểm tra token có hết hạn không
        /// </summary>
        public bool IsExpired => ExpiresAt <= DateTime.UtcNow;

        /// <summary>
        /// Revoke token với thông tin bổ sung
        /// </summary>
        /// <param name="reason">Lý do revoke</param>
        /// <param name="revokedByIp">IP address thực hiện revoke</param>
        public void Revoke(string? reason = null, string? revokedByIp = null)
        {
            IsRevoked = true;
            RevokedAt = DateTime.UtcNow;
            RevokedReason = reason;
            RevokedByIp = revokedByIp;
        }

        /// <summary>
        /// Lấy thời gian còn lại của token
        /// </summary>
        /// <returns>TimeSpan còn lại, hoặc TimeSpan.Zero nếu đã hết hạn</returns>
        public TimeSpan GetRemainingTime()
        {
            if (IsRevoked || IsExpired)
                return TimeSpan.Zero;

            return ExpiresAt - DateTime.UtcNow;
        }

        /// <summary>
        /// Tạo token info mới từ user ID
        /// </summary>
        /// <param name="token">Token string</param>
        /// <param name="userId">User ID</param>
        /// <param name="jwtId">JWT ID để liên kết với access token</param>
        /// <param name="expirationDays">Số ngày hết hạn</param>
        /// <param name="tenantId">Tenant ID (optional)</param>
        /// <param name="deviceInfo">Thông tin device (optional)</param>
        /// <param name="userAgent">User agent (optional)</param>
        /// <returns>RefreshTokenInfo instance</returns>
        public static RefreshTokenInfo Create(
            string token,
            Guid userId,
            string jwtId,
            int expirationDays = 30,
            Guid? tenantId = null,
            string? deviceInfo = null,
            string? userAgent = null)
        {
            return new RefreshTokenInfo
            {
                Token = token,
                UserId = userId,
                JwtId = jwtId,
                TenantId = tenantId,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(expirationDays),
                IsRevoked = false,
                DeviceInfo = deviceInfo,
                UserAgent = userAgent
            };
        }
    }
}
