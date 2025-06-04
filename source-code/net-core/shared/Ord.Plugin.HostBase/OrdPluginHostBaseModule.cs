using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.OpenApi.Models;
using Ord.Plugin.Core;
using Ord.Plugin.Core.Middlewares;
using Ord.Plugin.HostBase.Configurations;
using Ord.Plugin.HostBase.Filters;
using Ord.Plugin.HostBase.Middlewares;
using Ord.Plugin.HostBase.Util;
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
            ConfigureMvcFilter(services);
            services.AddHttpContextAccessor();
            services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();
            ConfigureSwaggerServices(services);
            ConfigureCors(services, configuration);
            ConfigureResponseCompression(services);
            ConfigureCache(configuration);
            ConfigureLanguage(services);
            services.ConfigureHangfire();
        }

        void ConfigureMvcFilter(IServiceCollection services)
        {
            var modelStateInvalidFilter = new ModelStateInvalidFilter(new ApiBehaviorOptions
            {
                InvalidModelStateResponseFactory = (ActionContext context) => new OkResult()
            }, NullLogger.Instance);
            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add<GlobalExceptionFilter>();
                options.Filters.Add<AbpFluentValidationActionFilter>(modelStateInvalidFilter.Order - 1);
            });
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
        void ConfigureSwaggerServices(IServiceCollection services)
        {
            services.AddAbpSwaggerGen(
                swagger =>
                {
                    swagger.HideAbpEndpoints();

                    swagger.SwaggerDoc("v1", new OpenApiInfo { Title = "OrdWebApp API", Version = "v1" });
                    swagger.DocInclusionPredicate((docName, description) => true);
                    swagger.CustomSchemaIds(type => type.FullName);

                    swagger.ParameterFilter<SwaggerEnumParameterFilter>();
                    swagger.SchemaFilter<SwaggerEnumSchemaFilter>();
                    swagger.OperationFilter<SwaggerOperationIdFilter>();
                    swagger.OperationFilter<SwaggerOperationFilter>();
                    swagger.CustomDefaultSchemaIdSelector();

                    swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                    {
                        Name = "Authorization",
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer",
                        BearerFormat = "JWT",
                        In = ParameterLocation.Header,
                        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
                    });
                    swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] {}

                        }
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

        private void ConfigureCache(IConfiguration configuration)
        {
            Configure<AbpDistributedCacheOptions>(options =>
            {
                options.KeyPrefix = (configuration["App:Name"] ?? "OrdPlugin") + ":";
            });
        }


        void ConfigureLanguage(IServiceCollection services)
        {
            services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[] { "en", "vi" };
                options.SetDefaultCulture("vi")
                    .AddSupportedCultures(supportedCultures)
                    .AddSupportedUICultures(supportedCultures);

                // Accept language from header, query, cookie
                options.RequestCultureProviders.Clear();
                options.RequestCultureProviders.Add(new QueryStringRequestCultureProvider());
                options.RequestCultureProviders.Add(new CookieRequestCultureProvider());
                options.RequestCultureProviders.Add(new AcceptLanguageHeaderRequestCultureProvider());
            });
        }

        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();
            var env = context.GetEnvironment();
            var configuration = context.GetConfiguration();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors();
            app.UseResponseCompression();
            app.UseAuthentication();
            app.UseAbpClaimsMap();
            app.UseUnitOfWork();
            app.UseMiddleware<CheckTokenJWTLocalMiddleware>();
            app.UseMiddleware<LanguageMiddleware>();
            app.UseDynamicClaims();
            app.UseMiddleware<OrdMultiTenancyMiddleware>();
            app.UseAuditing();
            app.UseAntiforgery();
            app.UseAuthorization();

            app.UseAbpSerilogEnrichers();
            app.UseConfiguredEndpoints();
            app.UseHangfireConfiguration(configuration);
       

            if (configuration["Swagger:IsEnabled"] == "true" || configuration["Swagger:IsEnabled"] == "1")
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


    }
}
