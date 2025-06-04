using Dapper;
using kp.Dapper.Handlers;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Ord.Plugin.Contract;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Services.Auth;
using Ord.Plugin.Core.Data;
using Ord.Plugin.Core.Middlewares;
using Ord.Plugin.HostBase.Middlewares;
using System.Text;
using Volo.Abp;
using Volo.Abp.Autofac;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Core
{
    [DependsOn(typeof(AbpAutoMapperModule),
        typeof(AbpAutofacModule),
        typeof(OrdPluginContractModule)
        )
    ]
    public class OrdPluginCoreModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            var configuration = context.Services.GetConfiguration();
            JwtConfiguration(services);
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<OrdPluginCoreModule>(validate: false);
            });
            Configure<AbpMultiTenancyOptions>(options =>
            {
                options.IsEnabled = true;
            });
            services.AddAbpDbContext<OrdPluginCoreDbContext>(options =>
            {
                options.AddDefaultRepositories(includeAllEntities: true);
            });
            services.AddTransient<ICheckClaimTokenJwtMiddlewareService, CheckPasswordChangeTokenMiddlewareService>();
            services.AddTransient<ICheckClaimTokenJwtMiddlewareService, CheckTokenRevokeMiddlewareService>();
            services.AddHttpContextAccessor();
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(OrdPluginCoreModule).Assembly));
            context.Services.AddControllersWithViews(options =>
            {
                // Xóa filter mặc định
                // options.Filters.RemoveAll(f => f is AbpExceptionFilter);
                // Thêm filter custom
                options.Filters.Add<OrdExceptionFilter>();
            });

            services.AddControllers(options =>
            {
                // options.Filters.Add<TranslateResultFilter>();
                //options.Filters.Add<TrimStringsActionFilter>();
            });
            SqlMapper.AddTypeHandler(new SqlDateOnlyTypeHandler());
            SqlMapper.AddTypeHandler(new SqlTimeOnlyTypeHandler());
            //Sync 24.1.47
            Syncfusion.Licensing.SyncfusionLicenseProvider.RegisterLicense("Ngo9BigBOggjHTQxAR8/V1NAaF1cXmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjW31XcHBUQmNeVEx2Ww==");


        }

        private void JwtConfiguration(IServiceCollection services)
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
                options.TokenValidationParameters = new TokenValidationParameters
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
            });
        }
    }
}
