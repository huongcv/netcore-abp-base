using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Volo.Abp.Guids;
using Volo.Abp.Security.Claims;

namespace Ord.Plugin.Auth.Services
{
    public class JwtManager(IGuidGenerator guidGenerator) : OrdAuthManagerBase, IJwtManager
    {
        private IRefreshTokenStore RefreshTokenStore => AppFactory.GetServiceDependency<IRefreshTokenStore>();

        public async Task<JwtDto> CreateJwtAsync(UserLoginDto loginUser, IEnumerable<Claim> extendClaims = null)
        {
            if (loginUser == null)
                throw new ArgumentNullException(nameof(loginUser));

            var tokenId = guidGenerator.Create().ToString();
            var claims = BuildUserClaims(loginUser, tokenId);

            if (extendClaims != null)
            {
                claims.AddRange(extendClaims);
            }

            return await CreateJwtAsync(claims, loginUser, tokenId);
        }

        public async Task SetJwtCookie(JwtDto jwtDto)
        {
            var httpContext = AppFactory.HttpContextAccessor().HttpContext;
            if (httpContext == null) return;
            var isHttps = httpContext.Request.IsHttps;
            var expireInSeconds = jwtDto.ExpireInSeconds;
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // Cookie chỉ có thể truy cập từ server, không thể truy cập từ JavaScript
                Secure = isHttps,
                SameSite = SameSiteMode.Strict, // Bảo vệ khỏi CSRF attacks
                Expires = DateTimeOffset.UtcNow.AddSeconds(expireInSeconds).AddDays(1),
                Path = "/" // Cookie có hiệu lực cho toàn bộ ứng dụng
            };
            var refreshTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7), //  refresh token sống 7 ngày
                Path = "/"
            };
            httpContext.Response.Cookies.Append("jwt", jwtDto.AccessToken, cookieOptions);
            httpContext.Response.Cookies.Append("refresh_token", jwtDto.RefreshToken, refreshTokenOptions);
        }

        public async Task ClearJwtCookie()
        {
            var httpContext = AppFactory.HttpContextAccessor().HttpContext;
            if (httpContext == null) return;
            var isHttps = httpContext.Request.IsHttps;
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(-1), // Set thời gian quá khứ để xóa cookie
                Path = "/"
            };

            httpContext.Response.Cookies.Append("jwt", "", cookieOptions);
            httpContext.Response.Cookies.Append("refresh_token", "", cookieOptions);
        }

        protected async Task<JwtDto> CreateJwtAsync(List<Claim> claims, UserLoginDto loginUser, string jwtId)
        {
            if (claims == null || !claims.Any())
                throw new ArgumentException("Claims cannot be null or empty", nameof(claims));

            var tokenAuthConfiguration = AppFactory.GetServiceDependency<TokenAuthConfiguration>();
            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(tokenAuthConfiguration.SecurityKey));
            var signingCredentials = new SigningCredentials(securityKey, tokenAuthConfiguration?.SecurityAlgorithm ?? SecurityAlgorithms.HmacSha512);

            var now = DateTime.UtcNow;
            var accessTokenExpiration = TimeSpan.FromSeconds(tokenAuthConfiguration?.TimeLifeTokenSeconds ?? 3600);
            var expirationTime = now.Add(accessTokenExpiration);

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: tokenAuthConfiguration.Issuer,
                audience: tokenAuthConfiguration.Audience,
                claims: claims,
                notBefore: now,
                expires: expirationTime,
                signingCredentials: signingCredentials
            );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            // Tạo refresh token với JWT ID
            var refreshToken = await GenerateRefreshTokenAsync(loginUser.Id, jwtId);

            return new JwtDto()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpireInSeconds = (int)accessTokenExpiration.TotalSeconds,
                UserId = loginUser.Id,
                TenantId = loginUser.TenantId
            };
        }

        /// <summary>
        /// Refresh JWT token với validation JWT ID
        /// </summary>
        /// <param name="refreshToken">Refresh token</param>
        /// <param name="currentAccessToken">Access token hiện tại để lấy JWT ID</param>
        /// <returns>JWT mới</returns>
        public async Task<JwtDto> RefreshJwtAsync(string refreshToken, string currentAccessToken)
        {
            if (string.IsNullOrEmpty(refreshToken) || string.IsNullOrEmpty(currentAccessToken))
            {
                throw new ArgumentException("Refresh token and current access token are required");
            }

            try
            {
                // Extract JWT ID từ current access token
                var jwtId = ExtractJwtIdFromToken(currentAccessToken);
                if (string.IsNullOrEmpty(jwtId))
                {
                    throw new InvalidOperationException("Invalid access token: JWT ID not found");
                }

                // Validate refresh token với JWT ID
                var userId = await ValidateRefreshTokenWithJwtIdAsync(refreshToken, jwtId);
                if (!userId.HasValue)
                {
                    throw new InvalidOperationException("Invalid refresh token or JWT ID mismatch");
                }

                // Lấy thông tin user để tạo JWT mới
                var userRepository = AppFactory.GetServiceDependency<IUserRepository>();
                var loginUser = await userRepository.GetLoginById(userId.Value);
                if (loginUser == null || !loginUser.IsActived)
                {
                    throw new InvalidOperationException("User not found or inactive");
                }
                // Revoke refresh token cũ
                await RevokeRefreshTokenAsync(refreshToken);
                return await CreateJwtAsync(loginUser);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error refreshing JWT token");
                throw;
            }
        }

        /// <summary>
        /// Validate refresh token với JWT ID
        /// </summary>
        /// <param name="refreshToken">Refresh token</param>
        /// <param name="jwtId">JWT ID</param>
        /// <returns>User ID nếu hợp lệ</returns>
        public async Task<Guid?> ValidateRefreshTokenWithJwtIdAsync(string refreshToken, string jwtId)
        {
            try
            {
                if (string.IsNullOrEmpty(refreshToken) || string.IsNullOrEmpty(jwtId))
                    return null;

                // Validate cặp refresh token và JWT ID
                var isValidPair = await RefreshTokenStore.ValidateTokenPairAsync(refreshToken, jwtId);
                if (!isValidPair)
                {
                    Logger.LogWarning("Invalid token pair: RefreshToken and JwtId do not match");
                    return null;
                }

                var refreshTokenInfo = await RefreshTokenStore.GetAsync(refreshToken);

                if (refreshTokenInfo == null || !refreshTokenInfo.IsValid)
                {
                    return null;
                }

                return refreshTokenInfo.UserId;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error validating refresh token with JWT ID {JwtId}", jwtId);
                return null;
            }
        }

        /// <summary>
        /// Revoke refresh token
        /// </summary>
        /// <param name="refreshToken">Refresh token cần revoke</param>
        /// <returns>True nếu thành công</returns>
        public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
        {
            try
            {
                if (string.IsNullOrEmpty(refreshToken))
                    return false;

                var refreshTokenInfo = await RefreshTokenStore.GetAsync(refreshToken);
                if (refreshTokenInfo == null)
                    return false;

                // Revoke token với thông tin bổ sung
                refreshTokenInfo.Revoke(
                    reason: "Token refresh rotation",
                    revokedByIp: GetClientIpAddress()
                );

                var result = await RefreshTokenStore.UpdateAsync(refreshTokenInfo);

                if (result)
                {
                    Logger.LogInformation("Refresh token revoked for user {UserId}", refreshTokenInfo.UserId);
                }

                return result;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error revoking refresh token");
                return false;
            }
        }

        /// <summary>
        /// Revoke tất cả refresh token của user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>True nếu thành công</returns>
        public async Task<bool> RevokeAllRefreshTokensAsync(Guid userId)
        {
            try
            {
                var result = await RefreshTokenStore.RemoveAllByUserIdAsync(userId);

                if (result)
                {
                    Logger.LogInformation("All refresh tokens revoked for user {UserId}", userId);
                }

                return result;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error revoking all refresh tokens for user {UserId}", userId);
                return false;
            }
        }

        private async Task<string> GenerateRefreshTokenAsync(Guid userId, string jwtId, DateTime? expireTime = null)
        {
            try
            {
                // Tạo refresh token ngẫu nhiên
                var randomNumber = new byte[64];
                using var rng = RandomNumberGenerator.Create();
                rng.GetBytes(randomNumber);
                var refreshToken = Convert.ToBase64String(randomNumber);

                // Tạo thông tin refresh token với JWT ID
                var refreshTokenInfo = RefreshTokenInfo.Create(
                    token: refreshToken,
                    userId: userId,
                    jwtId: jwtId,
                    expirationDays: 30,
                    tenantId: AppFactory.CurrentTenantId,
                    deviceInfo: GetDeviceInfo(),
                    userAgent: GetUserAgent()
                );

                if (expireTime.HasValue)
                {
                    refreshTokenInfo.ExpiresAt = expireTime.Value;
                }

                // Lưu vào store
                var result = await RefreshTokenStore.StoreAsync(refreshTokenInfo);
                if (!result)
                {
                    throw new InvalidOperationException("Failed to store refresh token");
                }

                return refreshToken;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error generating refresh token for user {UserId} with JWT ID {JwtId}", userId, jwtId);
                throw;
            }
        }

        private List<Claim> BuildUserClaims(UserLoginDto loginUser, string tokenId)
        {
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Jti, tokenId),
                new(JwtRegisteredClaimNames.Sub, loginUser.Id.ToString()),
                new(JwtRegisteredClaimNames.Iat,
                    new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64),
                new(AbpClaimTypes.UserId, loginUser.Id.ToString())
            };

            // Add optional claims conditionally
            AddOptionalClaim(claims, AbpClaimTypes.UserName, loginUser.UserName);
            AddOptionalClaim(claims, JwtRegisteredClaimNames.Email, loginUser.Email);
            AddOptionalClaim(claims, AbpClaimTypes.Name, loginUser.Name);

            if (loginUser.TenantId.HasValue)
            {
                claims.Add(new Claim(AbpClaimTypes.TenantId, loginUser.TenantId.Value.ToString()));
            }

            if (loginUser.Level == UserConst.SaLevel)
            {
                claims.Add(new Claim(OrdClaimsTypes.IsSuperAdmin, "1"));
            }

            AddDateTimeClaim(claims, OrdClaimsTypes.LastModificationTime, loginUser.LastModificationTime);
            AddDateTimeClaim(claims, OrdClaimsTypes.ChangePasswordDateTime, loginUser.ChangePasswordDateTime);

            return claims;
        }

        /// <summary>
        /// Extract JWT ID từ access token
        /// </summary>
        /// <param name="accessToken">Access token</param>
        /// <returns>JWT ID hoặc null nếu không tìm thấy</returns>
        private string? ExtractJwtIdFromToken(string accessToken)
        {
            try
            {
                if (string.IsNullOrEmpty(accessToken))
                    return null;

                var tokenHandler = new JwtSecurityTokenHandler();

                // Remove Bearer prefix nếu có
                if (accessToken.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    accessToken = accessToken.Substring(7);
                }

                var token = tokenHandler.ReadJwtToken(accessToken);
                return token.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error extracting JWT ID from access token");
                return null;
            }
        }

        #region Helper Methods

        private static void AddOptionalClaim(List<Claim> claims, string claimType, string? claimValue)
        {
            if (!string.IsNullOrWhiteSpace(claimValue))
            {
                claims.Add(new Claim(claimType, claimValue));
            }
        }

        private static void AddDateTimeClaim(List<Claim> claims, string claimType, DateTime? dateTime)
        {
            if (dateTime.HasValue)
            {
                claims.Add(new Claim(claimType, dateTime.Value.ToString(OrdClaimsTypes.FormatClaimDateType)));
            }
        }

        private string? GetDeviceInfo()
        {
            try
            {
                var httpContext = AppFactory.HttpContextAccessor()?.HttpContext;
                if (httpContext == null) return null;

                var deviceInfo = new
                {
                    Platform = httpContext.Request.Headers["X-Platform"].FirstOrDefault(),
                    DeviceId = httpContext.Request.Headers["X-Device-Id"].FirstOrDefault(),
                    AppVersion = httpContext.Request.Headers["X-App-Version"].FirstOrDefault()
                };

                return System.Text.Json.JsonSerializer.Serialize(deviceInfo);
            }
            catch
            {
                return null;
            }
        }

        private string? GetUserAgent()
        {
            try
            {
                var httpContext = AppFactory.HttpContextAccessor()?.HttpContext;
                return httpContext?.Request.Headers["User-Agent"].FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }

        private string? GetClientIpAddress()
        {
            try
            {
                var httpContext = AppFactory.HttpContextAccessor()?.HttpContext;
                if (httpContext == null) return null;

                return httpContext.Connection.RemoteIpAddress?.ToString();
            }
            catch
            {
                return null;
            }
        }

        #endregion
    }
}

