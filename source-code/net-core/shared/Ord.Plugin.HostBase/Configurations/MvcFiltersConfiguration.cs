using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Ord.Plugin.Core.Middlewares;
using Ord.Plugin.HostBase.Filters;
using System.Text.Json.Serialization;

namespace Ord.Plugin.Core.Configurations
{
    public static class MvcFiltersConfiguration
    {
        public static void AddMvcAndFilters(this IServiceCollection services)
        {
            var modelStateInvalidFilter = new ModelStateInvalidFilter(new ApiBehaviorOptions
            {
                InvalidModelStateResponseFactory = (ActionContext context) => new OkResult()
            }, NullLogger.Instance);
            services.Configure<MvcOptions>(options =>
            {
                // Add custom exception filter
                options.Filters.Add<TrimStringsActionFilter>();
                options.Filters.Add<GlobalExceptionFilter>();
                options.Filters.Add<AbpFluentValidationActionFilter>(modelStateInvalidFilter.Order - 1);
                ConfigureApiBehavior(options);
            });
            // Configure API versioning
            services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ApiVersionReader = ApiVersionReader.Combine(
                    new UrlSegmentApiVersionReader(),
                    new HeaderApiVersionReader("X-Version"),
                    new QueryStringApiVersionReader("version")
                );
            });
            services.Configure<JsonOptions>(options =>
            {
                //options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });
        }
        private static void ConfigureApiBehavior(MvcOptions options)
        {
            // Configure automatic model validation response
            options.SuppressAsyncSuffixInActionNames = false;
            options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
        }
    }
}
