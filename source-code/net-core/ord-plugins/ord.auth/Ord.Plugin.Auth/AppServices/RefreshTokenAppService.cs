using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Utils;

namespace Ord.Plugin.Auth.AppServices
{
    [ApiController]
    [Route("api/auth")]
    public class RefreshTokenAppService : OrdAppServiceBase
    {
        /// <summary>
        /// Refresh access token bằng refresh token
        /// </summary>
        /// <param name="request">Refresh token request</param>
        /// <returns>New access token và refresh token</returns>
        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<CommonResultDto<JwtDto>> RefreshTokenAsync([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var httpContext = AppFactory.HttpContextAccessor().HttpContext;
                // Ưu tiên body, fallback lấy từ Cookie (middleware đã gắn vào context)
                if (string.IsNullOrEmpty(request.RefreshToken))
                {
                    if (httpContext.Items.TryGetValue("RefreshTokenFromCookie", out var refreshTokenObj))
                    {
                        request.RefreshToken = refreshTokenObj as string;
                    }
                }

                if (string.IsNullOrEmpty(request.RefreshToken))
                {
                    return CommonResultDto<JwtDto>.Failed("Refresh token is required");
                }
                // Nếu AccessToken chưa có thì lấy từ header Authorization: Bearer xxx
                if (string.IsNullOrEmpty(request.AccessToken))
                {
                    var authHeader = AppFactory.HttpContextAccessor().HttpContext?.Request.Headers["Authorization"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        request.AccessToken = authHeader.Substring("Bearer ".Length).Trim();
                    }
                }
                if (string.IsNullOrEmpty(request.AccessToken))
                {
                    return CommonResultDto<JwtDto>.Failed("Current access token is required for validation");
                }
                // Sử dụng JwtManager để refresh token với validation JWT ID
                var jwtManager = AppFactory.GetServiceDependency<IJwtManager>();
                var newJwt = await jwtManager.RefreshJwtAsync(request.RefreshToken, request.AccessToken);
                return CommonResultDto<JwtDto>.Ok(newJwt, "Token refreshed successfully");
            }
            catch (InvalidOperationException ex)
            {
                return CommonResultDto<JwtDto>.Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return CommonResultDto<JwtDto>.ServerFailure(ex, "Error refreshing token");
            }
        }
        protected override string GetBasePermissionName()
        {
            return "";
        }
    }
}
