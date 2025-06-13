using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Ord.Plugin.HostBase.Util;
namespace Ord.Plugin.HostBase.Configurations
{
    public static class SwaggerConfiguration
    {
       public static void AddSwagger(this IServiceCollection services)
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
    }
}
