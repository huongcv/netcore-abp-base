using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Ord.Plugin.Contract.Configurations;
using Polly;
using System.Text;

namespace Ord.Plugin.Core.Configurations;

public static class AuthenticationConfiguration
{
    public static void AddAuthenticationServices(this IServiceCollection services)
    {
        var configuration = services.GetConfiguration();
        var tokenAuthConfig = configuration.GetSection("Authentication:JwtBearer").Get<TokenAuthConfiguration>();
        tokenAuthConfig.SecurityKey = tokenAuthConfig.SecurityKey + "0r3nd@";
        tokenAuthConfig.AccessTokenExpiration = TimeSpan.FromSeconds(tokenAuthConfig.TimeLifeTokenSeconds);
        services.AddSingleton<TokenAuthConfiguration>(tokenAuthConfig);

        var authenticationBuilder = services.AddAuthentication("JWT_OR_COOKIE");
        authenticationBuilder.AddPolicyScheme("JWT_OR_COOKIE", "Jwt Bearer or Cookie", options =>
        {
            options.ForwardDefaultSelector = ctx =>
            {
                var cookieToken = ctx.Request.Cookies["jwt"];
                if (!string.IsNullOrEmpty(cookieToken))
                {
                    return "LocalCookie";
                }
                var authHeader = ctx.Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrEmpty(authHeader))
                {
                    return CookieAuthenticationDefaults.AuthenticationScheme;
                }
                var isJwtBearerAuth = authHeader?.StartsWith(JwtBearerDefaults.AuthenticationScheme) ?? false;
                if (!isJwtBearerAuth)
                {
                    return CookieAuthenticationDefaults.AuthenticationScheme;
                }

                return "Local";
            };
        });
        authenticationBuilder.AddCookie(options =>
        {
            options.LoginPath = new PathString("/Account/Login");
            options.AccessDeniedPath = new PathString("/Account/Login");
            options.LogoutPath = new PathString("/Account/Logout");
            options.Cookie.Name = "OrdPlugin.Identity";
            options.SlidingExpiration = true;
#if DEBUG
            options.ExpireTimeSpan = TimeSpan.FromDays(3600);
#else
                options.ExpireTimeSpan = TimeSpan.FromDays(1);
#endif

        });
        authenticationBuilder.AddJwtBearer("Local", options =>
        {
            options.SaveToken = true;
            options.TokenValidationParameters = CreateTokenValidationParameters(tokenAuthConfig);
            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = async context =>
                {
                    await ValidateJwtTokenAsync(context);
                },
                OnAuthenticationFailed = context =>
                {
                    LogAuthenticationFailure(context);
                    return Task.CompletedTask;
                },
                OnMessageReceived = context =>
                {
                    // ✅ Ưu tiên lấy từ Header nếu có
                    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                    {
                        context.Token = authHeader.Substring("Bearer ".Length).Trim();
                    }
                    else
                    {
                        // ✅ Nếu không có header, fallback sang Cookie
                        var cookieToken = context.HttpContext.Request.Cookies["jwt"];
                        if (!string.IsNullOrEmpty(cookieToken))
                        {
                            context.Token = cookieToken;
                        }
                    }

                    return Task.CompletedTask;
                }
            };
        });
        authenticationBuilder.AddJwtBearer("LocalCookie", options =>
        {
            options.SaveToken = true;
            options.TokenValidationParameters = CreateTokenValidationParameters(tokenAuthConfig);
            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = async context =>
                {
                    await ValidateJwtTokenAsync(context);
                },
                OnAuthenticationFailed = context =>
                {
                    LogAuthenticationFailure(context);
                    return Task.CompletedTask;
                },
                OnMessageReceived = context =>
                { 
                    // ✅ Nếu không có header, fallback sang Cookie
                    var cookieToken = context.HttpContext.Request.Cookies["jwt"];
                    if (!string.IsNullOrEmpty(cookieToken))
                    {
                        context.Token = cookieToken;
                    }

                    return Task.CompletedTask;
                }
            };
        });
    }
    private static TokenValidationParameters CreateTokenValidationParameters(TokenAuthConfiguration tokenAuthConfig)
    {
        return new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(tokenAuthConfig.SecurityKey)),

            ValidateIssuer = true,
            ValidIssuer = tokenAuthConfig.Issuer,

            ValidateAudience = true,
            ValidAudience = tokenAuthConfig.Audience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };
    }
    private static async Task ValidateJwtTokenAsync(TokenValidatedContext context)
    {
        var services = context.HttpContext.RequestServices;
    }
    private static void LogAuthenticationFailure(AuthenticationFailedContext context)
    {
        // TODO: Implement proper logging
        // var logger = context.HttpContext.RequestServices.GetService<ILogger<AuthenticationConfiguration>>();
        // logger?.LogWarning("Authentication failed: {Exception}", context.Exception.Message);
    }

}