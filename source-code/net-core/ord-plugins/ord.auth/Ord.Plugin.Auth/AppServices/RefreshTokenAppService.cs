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
        private IJwtManager JwtManager => AppFactory.GetServiceDependency<IJwtManager>();
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
                var httpRequest = AppFactory.HttpContextAccessor().HttpContext?.Request;
                // Nếu không có AccessToken trong body, lấy từ header hoặc cookie "jwt"
                if (string.IsNullOrEmpty(request.AccessToken))
                {
                    var authHeader = httpRequest.Headers["Authorization"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        request.AccessToken = authHeader.Substring("Bearer ".Length).Trim();
                    }
                }

                if (string.IsNullOrEmpty(request.RefreshToken))
                {
                    return CommonResultDto<JwtDto>.Failed("Refresh token is required");
                }

                if (string.IsNullOrEmpty(request.AccessToken))
                {
                    return CommonResultDto<JwtDto>.Failed("Access token is required");
                }

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

        [HttpPost("refresh-token-cookie")]
        [AllowAnonymous]
        public async Task<CommonResultDto<JwtDto>> RefreshTokenCookieAsync()
        {
            try
            {
                var httpRequest = AppFactory.HttpContextAccessor().HttpContext?.Request;

                // Nếu không có RefreshToken trong body, lấy từ cookie
                var refreshToken = httpRequest.Cookies["refresh_token"];
                var accessToken = httpRequest.Cookies["jwt"];
                await JwtManager.ClearJwtCookie();
                return await RefreshTokenAsync(new RefreshTokenRequest()
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                });
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
