using Ord.Domain.Enums;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Validation.Attributes;

namespace Ord.Plugin.Auth.Shared.Dtos.Users
{
    /// <summary>
    /// DTO để hiển thị thông tin access token
    /// </summary>
    public class UserAccessTokenDto
    {
        public Guid Id { get; set; }
        public string TokenId { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? DeviceName { get; set; }
        public string? Platform { get; set; }
        public DateTime? LastUsedAt { get; set; }
        public string Status { get; set; }
        public string? RevokeReason { get; set; }
        public DateTime? RevokedAt { get; set; }
        public DateTime CreationTime { get; set; }
        public bool IsExpired { get; set; }
        public bool IsValid { get; set; }
        public bool IsCurrentToken { get; set; }

        public bool IsActived => Status == TokenStatus.Active && ExpiresAt > DateTime.Now;
    }
    /// <summary>
    /// DTO để thu hồi nhiều token
    /// </summary>
    public class RevokeMultipleTokensDto
    {
        [OrdValidateRequired]
        public string? UserEncodedId { get; set; }
        [OrdValidateRequired]
        public List<string> TokenIds { get; set; } = new();

        [OrdMaxLengthString(200)]
        public string? Reason { get; set; }
    }
    public class RevokeTokenDto
    {
        [OrdValidateRequired]
        public string? TokenId { get; set; }

        [OrdMaxLengthString(200)]
        public string? Reason { get; set; }
    }
    public class GetUserAccessTokenPagedInput : OrdPagedRequestDto
    {
        public string UserEncodedId { get; set; }
        public string? Status { get; set; }
        public bool? IsActived { get; set; }
    }
}
