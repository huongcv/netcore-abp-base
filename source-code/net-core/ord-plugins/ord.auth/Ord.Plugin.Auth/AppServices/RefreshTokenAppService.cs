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
                var httpRequest = AppFactory.HttpContextAccessor().HttpContext?.Request;
                // Nếu không có RefreshToken trong body, lấy từ cookie
                if (string.IsNullOrEmpty(request.RefreshToken))
                {
                    request.RefreshToken = httpRequest.Cookies["refresh_token"];
                }

                // Nếu không có AccessToken trong body, lấy từ header hoặc cookie "jwt"
                if (string.IsNullOrEmpty(request.AccessToken))
                {
                    var authHeader = httpRequest.Headers["Authorization"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        request.AccessToken = authHeader.Substring("Bearer ".Length).Trim();
                    }
                    else
                    {
                        request.AccessToken = httpRequest.Cookies["jwt"];
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

        protected override string GetBasePermissionName()
        {
            return "";
        }
    }
}
