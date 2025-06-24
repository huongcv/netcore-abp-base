using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract.Dtos;
using System.Security.Claims;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface IJwtManager : IDomainService
    {
        /// <summary>
        /// Tạo JWT từ thông tin user
        /// </summary>
        /// <param name="loginUser">Thông tin user</param>
        /// <param name="extendClaims">Claims bổ sung</param>
        /// <returns>JWT DTO</returns>
        Task<JwtDto> CreateJwtAsync(UserLoginDto loginUser, IEnumerable<Claim> extendClaims = null);

        Task SetJwtCookie(JwtDto jwtDto);
        Task ClearJwtCookie();

        /// <summary>
        /// Refresh JWT token
        /// </summary>
        /// <param name="refreshToken">Refresh token</param>
        /// <param name="currentAccessToken">Access token hiện tại</param>
        /// <returns>JWT mới</returns>
        Task<JwtDto> RefreshJwtAsync(string refreshToken, string currentAccessToken);

        /// <summary>
        /// Validate refresh token với JWT ID
        /// </summary>
        /// <param name="refreshToken">Refresh token</param>
        /// <param name="jwtId">JWT ID</param>
        /// <returns>User ID nếu hợp lệ</returns>
        Task<Guid?> ValidateRefreshTokenWithJwtIdAsync(string refreshToken, string jwtId);

        /// <summary>
        /// Revoke refresh token
        /// </summary>
        /// <param name="refreshToken">Refresh token</param>
        /// <returns>True nếu thành công</returns>
        Task<bool> RevokeRefreshTokenAsync(string refreshToken);

        /// <summary>
        /// Revoke tất cả refresh token của user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>True nếu thành công</returns>
        Task<bool> RevokeAllRefreshTokensAsync(Guid userId);
    }
}
