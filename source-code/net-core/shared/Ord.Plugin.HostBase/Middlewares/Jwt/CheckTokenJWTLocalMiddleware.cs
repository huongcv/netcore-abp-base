using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services.Auth;
using System.Net;
using System.Text;
using System.Text.Json;

namespace Ord.Plugin.HostBase.Middlewares.Jwt
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
            if (path.Contains("api/auth/refresh-token"))
            {
                await _next(context);
                return;
            }

            var claims = context.User?.Claims;
            if (claims?.Any() == true)
            {
                var appFactory = context.RequestServices.GetRequiredService<IAppFactory>();
                var middlewareServices =
                    appFactory.GetServiceDependency<IEnumerable<ICheckClaimTokenJwtMiddlewareService>>();
               
                if (middlewareServices?.Any() == true)
                {
                    foreach (var ser in middlewareServices)
                    {
                        var errorMessage = await ser.CheckClaims(claims);
                        if (!string.IsNullOrEmpty(errorMessage))
                        {
                           
                            context.Response.Clear();
                            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                            context.Response.ContentType = "application/json";
                            var errorResponse = new CommonResultDto<object>()
                            {
                               Code = "401",
                               Message = appFactory.GetLocalizedMessage(errorMessage)
                            };
                            var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
                            {
                                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                            });

                            await context.Response.WriteAsync(jsonResponse, Encoding.UTF8);
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
