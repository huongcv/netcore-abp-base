using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services.Auth;
using System.Text;
using System.Text.Json;

public static class AuthenticationConfiguration
{
    private const string SchemeSelector = "JWT_OR_COOKIE";
    private const string JwtScheme = "Local";
    private const string CookieJwtScheme = "LocalCookie";

    public static void AddAuthenticationServices(this IServiceCollection services)
    {
        var configuration = services.GetConfiguration();
        var tokenAuthConfig = configuration.GetSection("Authentication:JwtBearer").Get<TokenAuthConfiguration>();

        tokenAuthConfig.SecurityKey += "0r3nd@";
        tokenAuthConfig.AccessTokenExpiration = TimeSpan.FromSeconds(tokenAuthConfig.TimeLifeTokenSeconds);
        services.AddSingleton(tokenAuthConfig);

        var authenticationBuilder = services.AddAuthentication(SchemeSelector);

        authenticationBuilder.AddPolicyScheme(SchemeSelector, "Jwt or Cookie", options =>
        {
            options.ForwardDefaultSelector = ctx =>
            {
                var cookieToken = ctx.Request.Cookies["jwt"];
                if (!string.IsNullOrEmpty(cookieToken)) return CookieJwtScheme;

                var authHeader = ctx.Request.Headers["Authorization"].FirstOrDefault();
                return authHeader?.StartsWith("Bearer ") == true ? JwtScheme : CookieJwtScheme;
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
            options.ExpireTimeSpan = TimeSpan.FromDays(360);
#else
            options.ExpireTimeSpan = TimeSpan.FromDays(1);
#endif
        });

        authenticationBuilder.AddJwtBearer(JwtScheme, options =>
            ConfigureJwtBearerOptions(options, tokenAuthConfig, true));

        authenticationBuilder.AddJwtBearer(CookieJwtScheme, options =>
            ConfigureJwtBearerOptions(options, tokenAuthConfig, false));
    }

    private static void ConfigureJwtBearerOptions(JwtBearerOptions options, TokenAuthConfiguration config, bool checkHeader)
    {
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config.SecurityKey)),
            ValidateIssuer = true,
            ValidIssuer = config.Issuer,
            ValidateAudience = true,
            ValidAudience = config.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = ValidateJwtTokenAsync,
            OnChallenge = OnChallenge,
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetService<ILogger<JwtBearerEvents>>();
                logger?.LogWarning("JWT authentication failed: {Message}", context.Exception?.Message);
                return Task.CompletedTask;
            },
            OnMessageReceived = context =>
            {
                if (checkHeader)
                {
                    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                    {
                        context.Token = authHeader["Bearer ".Length..].Trim();
                        return Task.CompletedTask;
                    }
                }

                var cookieToken = context.HttpContext.Request.Cookies["jwt"];
                if (!string.IsNullOrEmpty(cookieToken))
                {
                    context.Token = cookieToken;
                }

                return Task.CompletedTask;
            }
        };
    }

    private static async Task ValidateJwtTokenAsync(TokenValidatedContext context)
    {
        var appFactory = context.HttpContext.RequestServices.GetService<IAppFactory>();
        var middlewares = appFactory.GetServiceDependency<IEnumerable<ICheckAccessTokenService>>();
        var claims = context.Principal?.Claims;

        if (middlewares != null && claims?.Any() == true)
        {
            foreach (var service in middlewares)
            {
                var error = await service.CheckClaims(claims);
                if (!string.IsNullOrEmpty(error))
                {
                    context.Fail(error);
                    return;
                }
            }
        }
    }

    private static Task OnChallenge(JwtBearerChallengeContext context)
    {
        var logger = context.HttpContext.RequestServices.GetService<ILogger<JwtBearerEvents>>();
        var appFactory = context.HttpContext.RequestServices.GetService<IAppFactory>();

        logger?.LogDebug("JWT challenge for path: {Path}", context.Request.Path);

        if (context.AuthenticateFailure != null)
        {
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            context.Response.Headers["WWW-Authenticate"] = "Bearer";
            var message = context.AuthenticateFailure?.Message ?? "exception.user_unauthorized";
            if (!message.StartsWith("exception"))
            {
                message = "exception.user_unauthorized";
            }

            var response = new
            {
                isSuccessful = false,
                code = "unauthorized",
                message = appFactory.GetLocalizedMessage(message)
            };

            context.HandleResponse();
            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }

        return Task.CompletedTask;
    }
}
