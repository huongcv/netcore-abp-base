using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Ord.Plugin.Core;
using Ord.Plugin.Core.Configurations;
using Ord.Plugin.Core.Features.RateLimits;
using Ord.Plugin.Core.Middlewares;
using Ord.Plugin.HostBase.Configurations;
using Ord.Plugin.HostBase.Middlewares;
using Ord.Plugin.HostBase.Middlewares.Jwt;
using System.IO.Compression;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.Caching;
using Volo.Abp.Caching.StackExchangeRedis;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Swashbuckle;
namespace Ord.Plugin.HostBase
{
    [DependsOn(
            typeof(AbpAutofacModule),
            typeof(AbpSwashbuckleModule),
            typeof(AbpAspNetCoreSerilogModule),
            typeof(AbpCachingStackExchangeRedisModule),
            typeof(AbpMultiTenancyModule),
            typeof(OrdPluginCoreModule)
        )
    ]
    public class OrdPluginHostBaseModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            PreConfigure<AbpAspNetCoreMvcOptions>(options =>
            {
                options.ConventionalControllers.Create(typeof(OrdPluginHostBaseModule).Assembly, opts =>
                {
                    opts.RootPath = "plugin-base";
                    opts.UrlActionNameNormalizer = normalizerContext => normalizerContext.Action.ActionName;
                });
            });
            base.PreConfigureServices(context);

        }
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            var configuration = context.Services.GetConfiguration();

            Configure<AbpMultiTenancyOptions>(options =>
            {
                options.IsEnabled = true;
            });
            services.AddMvcAndFilters();
            services.AddHttpContextAccessor();
            services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddSwagger();
            services.AddLanguageLocalization();
            ConfigureCors(services, configuration);
            ConfigureResponseCompression(services);
            ConfigureCache(services, configuration);
            services.AddRedisRateLimit(configuration);
            services.AddHealthCheckOpenTelemetry(configuration);
#if DEBUG
            services.AddHangfireMemory();
#else
            services.AddHangfireMysql();
#endif

        }
        void ConfigureCors(IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder
                        .WithOrigins(
                            configuration["App:CorsOrigins"]
                                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                                .Select(o => o.RemovePostFix("/"))
                                .ToArray()
                        )
                        .WithAbpExposedHeaders()
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });
        }
        void ConfigureResponseCompression(IServiceCollection services)
        {
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
                options.Providers.Add<BrotliCompressionProvider>();
                options.Providers.Add<GzipCompressionProvider>();
                options.MimeTypes =
                    ResponseCompressionDefaults.MimeTypes.Concat(
                        new[] { "image/svg+xml" });
            });
            services.Configure<BrotliCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });
            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.SmallestSize;
            });
        }

        private void ConfigureCache(IServiceCollection services, IConfiguration configuration)
        {

            Configure<AbpDistributedCacheOptions>(options =>
            {
                options.KeyPrefix = (configuration["App:Name"] ?? "OrdPlugin") + ":";
            });
        }
        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();
            var env = context.GetEnvironment();
            var configuration = context.GetConfiguration();

            ConfigureMiddlewares(app);
            ConfigureSwagger(app, configuration);
            ConfigurePrometheus(app, configuration);
            app.UseHangfireConfiguration(configuration);
        }

        private void ConfigureMiddlewares(IApplicationBuilder app)
        {
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors();
            app.UseResponseCompression();
            app.UseAuthentication();
            app.UseAbpClaimsMap();
            app.UseUnitOfWork();
            app.UseMiddleware<RateLimitMiddleware>();
            app.UseMiddleware<CheckTokenJWTLocalMiddleware>();
            app.UseMiddleware<LanguageMiddleware>();
            app.UseDynamicClaims();
            app.UseMiddleware<OrdMultiTenancyMiddleware>();
            app.UseAuditing();
            app.UseAntiforgery();
            app.UseAuthorization();
            app.UseAbpSerilogEnrichers();
            app.UseConfiguredEndpoints();
        }
        private void ConfigureSwagger(IApplicationBuilder app, IConfiguration configuration)
        {
            if (bool.TryParse(configuration["Swagger:IsEnabled"], out var isSwaggerEnabled) && isSwaggerEnabled)
            {
                app.UseSwagger(option =>
                {
                    option.RouteTemplate = "ord-doc-api/{documentName}/plugin-api.json";
                });

                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/ord-doc-api/v1/plugin-api.json", "Ord Web API");
                    options.RoutePrefix = "api-doc";
                });
            }
        }
        private void ConfigurePrometheus(IApplicationBuilder app, IConfiguration configuration)
        {
            if (configuration.TryParseBoolValue("Prometheus:IsEnabled"))
            {
                app.UseOpenTelemetryPrometheusScrapingEndpoint(configuration["Prometheus:Endpoint"]);
            }
        }
    }
}
