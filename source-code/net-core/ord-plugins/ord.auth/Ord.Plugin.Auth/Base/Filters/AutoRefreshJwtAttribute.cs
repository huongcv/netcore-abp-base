using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Auth.Shared.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Ord.Plugin.Auth.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AutoRefreshJwtAttribute : Attribute, IAsyncAuthorizationFilter
    {
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var httpContext = context.HttpContext;
            var jwt = httpContext.Request.Cookies["jwt"];
            var refreshToken = httpContext.Request.Cookies["refresh_token"];

            if (string.IsNullOrEmpty(jwt) || string.IsNullOrEmpty(refreshToken))
                return;

            var handler = new JwtSecurityTokenHandler();

            JwtSecurityToken? token = null;
            try
            {
                token = handler.ReadJwtToken(jwt);
            }
            catch
            {
                // Token không hợp lệ
                return;
            }

            var expires = token.ValidTo;
            if (expires > DateTime.UtcNow)
            {
                // Token vẫn còn hạn
                return;
            }

            // Token đã hết hạn → Gọi refresh
            var jwtManager = httpContext.RequestServices.GetRequiredService<IJwtManager>();
            try
            {
                var newJwt = await jwtManager.RefreshJwtAsync(refreshToken, jwt);
                await jwtManager.SetJwtCookie(newJwt);
                // Gán lại ClaimsPrincipal (User)
                var refreshedToken = handler.ReadJwtToken(newJwt.AccessToken);
                var claims = refreshedToken.Claims;
                var identity = new ClaimsIdentity(claims, "Jwt");
                var principal = new ClaimsPrincipal(identity);
                httpContext.User = principal;
            }
            catch
            {
                // Có thể cho logout hoặc làm gì đó nếu refresh thất bại
                // context.Result = new UnauthorizedResult();
            }
        }
    }
}
