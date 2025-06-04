using System.Collections;
using System.Globalization;
using System.Text;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace Ord.Plugin.HostBase.Util
{
    public class SwaggerEnumParameterFilter : IParameterFilter
    {
        public void Apply(OpenApiParameter parameter, ParameterFilterContext context)
        {
            var type = Nullable.GetUnderlyingType(context.ApiParameterDescription.Type) ?? context.ApiParameterDescription.Type;
            if (type.IsEnum)
            {
                AddEnumParamSpec(parameter, type, context);
                parameter.Required = type == context.ApiParameterDescription.Type;
            }
            else if (type.IsArray || (type.IsGenericType && type.GetInterfaces().Contains(typeof(IEnumerable))))
            {
                var itemType = type.GetElementType() ?? type.GenericTypeArguments.First();
                AddEnumSpec(parameter, itemType, context);
            }
        }

        private static void AddEnumSpec(OpenApiParameter parameter, Type type, ParameterFilterContext context)
        {
            var schema = context.SchemaRepository.Schemas.GetOrAdd($"#/definitions/{type.Name}", () =>
                context.SchemaGenerator.GenerateSchema(type, context.SchemaRepository)
            );

            if (schema.Reference == null || !type.IsEnum)
            {
                return;
            }

            parameter.Schema = schema;

            var enumNames = new OpenApiArray();
            enumNames.AddRange(Enum.GetNames(type).Select(_ => new OpenApiString(_)));
            schema.Extensions.Add("x-enumNames", enumNames);
        }

        private static void AddEnumParamSpec(OpenApiParameter parameter, Type type, ParameterFilterContext context)
        {
            var schema = context.SchemaGenerator.GenerateSchema(type, context.SchemaRepository);
            if (schema.Reference == null)
            {
                return;
            }

            parameter.Schema = schema;
            
            var enumNames = new OpenApiArray();
            enumNames.AddRange(Enum.GetNames(type).Select(_ => new OpenApiString(_)));
            schema.Extensions.Add("x-enumNames", enumNames);
        }
    }
    public class SwaggerEnumSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            var type = context.Type;
            if (!type.IsEnum || schema.Extensions.ContainsKey("x-enumNames"))
            {
                return;
            }

            var enumNames = new OpenApiArray();
            enumNames.AddRange(Enum.GetNames(type).Select(_ => new OpenApiString(_)));
            schema.Extensions.Add("x-enumNames", enumNames);
        }
    }
    public static class SwaggerExtensions
    {
        /// <summary>
        /// Injects ABP base URI into the index.html page
        /// </summary>
        /// <param name="options"></param>
        /// <param name="pathBase">base path (URL) to application API</param>
        public static void InjectBaseUrl(this SwaggerUIOptions options, string pathBase)
        {
            pathBase = pathBase.EnsureEndsWith('/');

            options.HeadContent = new StringBuilder(options.HeadContent)
                .AppendLine($"<script> var abp = abp || {{}}; abp.appPath = abp.appPath || '{pathBase}'; </script>")
                .ToString();
        }

        /// <summary>
        /// https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/752#issuecomment-467817189
        /// When Swashbuckle.AspNetCore 5.0 is released, we can remove it.
        /// </summary>
        /// <param name="options"></param>
        public static void CustomDefaultSchemaIdSelector(this SwaggerGenOptions options)
        {
            string SchemaIdSelector(Type modelType)
            {
                if (!modelType.IsConstructedGenericType)
                {
                    return modelType.Name;
                }

                var prefix = modelType.GetGenericArguments()
                    .Select(SchemaIdSelector)
                    .Aggregate<string>((previous, current) => previous + current);

                return modelType.Name.Split('`').First() + "Of" + prefix;
            }

            options.CustomSchemaIds(SchemaIdSelector);
        }
    }

    public class SwaggerOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.Parameters == null)
            {
                return;
            }

            for (var i = 0; i < operation.Parameters.Count; ++i)
            {
                var parameter = operation.Parameters[i];

                var enumType = context.ApiDescription.ParameterDescriptions[i].ParameterDescriptor.ParameterType;
                if (!enumType.IsEnum)
                {
                    continue;
                }

                var schema = context.SchemaRepository.Schemas.GetOrAdd($"#/definitions/{enumType.Name}", () =>
                    context.SchemaGenerator.GenerateSchema(enumType, context.SchemaRepository)
                );

                parameter.Schema = schema;
            }
        }
    }
    public class SwaggerOperationIdFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            operation.OperationId = FriendlyId(context.ApiDescription);
        }

        private static string FriendlyId(ApiDescription apiDescription)
        {
            var parts = (RelativePathSansQueryString(apiDescription) + "/" + apiDescription.HttpMethod.ToLower())
                .Split('/');

            var builder = new StringBuilder();
            foreach (var part in parts)
            {
                var trimmed = part.Trim('{', '}');
                builder.AppendFormat("{0}{1}",
                    (part.StartsWith("{") ? "By" : string.Empty),
                    CultureInfo.InvariantCulture.TextInfo.ToTitleCase(trimmed)
                );
            }

            return builder.ToString();
        }

        private static string RelativePathSansQueryString(ApiDescription apiDescription)
        {
            return apiDescription.RelativePath.Split('?').First();
        }
    }
}