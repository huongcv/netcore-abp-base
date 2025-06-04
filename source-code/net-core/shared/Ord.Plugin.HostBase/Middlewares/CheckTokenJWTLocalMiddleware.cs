using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Services.Auth;
using System.Net;

namespace Ord.Plugin.HostBase.Middlewares
{
    public class CheckTokenJWTLocalMiddleware
    {
        private readonly RequestDelegate _next;


        public CheckTokenJWTLocalMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value?.ToLower();
            // Bỏ qua kiểm tra nếu URL là refresh-token
            if (path == "/api/auth-plugin/auth/refresh-token")
            {
                await _next(context);
                return;
            }

            var claims = context.User?.Claims;
            if (claims?.Any() == true)
            {
                var middlewareServices =
                    context.RequestServices.GetService<IEnumerable<ICheckClaimTokenJwtMiddlewareService>>();
                if (middlewareServices?.Any() == true)
                {
                    foreach (var ser in middlewareServices)
                    {
                        var statusCode = await ser.CheckClaims(claims);
                        if (statusCode != HttpStatusCode.OK)
                        {
                           
                            context.Response.Clear();
                            context.Response.StatusCode = (int)statusCode;
                            try
                            {
                                await context.SignOutAsync("Cookies");
                            }
                            catch
                            {
                                // ignored
                            }
                            return;
                        }
                    }
                }
            }

            await _next(context);
        }
    }
}
