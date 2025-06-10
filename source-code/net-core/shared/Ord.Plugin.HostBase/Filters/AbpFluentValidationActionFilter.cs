using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Localization;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Reflection;
using Volo.Abp.Validation;

namespace Ord.Plugin.HostBase.Filters
{
    public class AbpFluentValidationActionFilter(IAppFactory appFactory) : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.ActionDescriptor.IsControllerAction())
            {
                await next();
                return;
            }

            if (!context.GetRequiredService<IOptions<AbpAspNetCoreMvcOptions>>().Value.AutoModelValidation)
            {
                await next();
                return;
            }

            if (ReflectionHelper.GetSingleAttributeOfMemberOrDeclaringTypeOrDefault<DisableValidationAttribute>(context.ActionDescriptor.GetMethodInfo()) != null)
            {
                await next();
                return;
            }

            if (ReflectionHelper.GetSingleAttributeOfMemberOrDeclaringTypeOrDefault<DisableValidationAttribute>(context.Controller.GetType()) != null)
            {
                await next();
                return;
            }

            if (context.ActionDescriptor.GetMethodInfo().DeclaringType != context.Controller.GetType())
            {
                var baseMethod = context.ActionDescriptor.GetMethodInfo();

                var overrideMethod = context.Controller.GetType().GetMethods().FirstOrDefault(x =>
                    x.DeclaringType == context.Controller.GetType() &&
                    x.Name == baseMethod.Name &&
                    x.ReturnType == baseMethod.ReturnType &&
                    x.GetParameters().Select(p => p.ToString()).SequenceEqual(baseMethod.GetParameters().Select(p => p.ToString())));

                if (overrideMethod != null)
                {
                    if (ReflectionHelper.GetSingleAttributeOfMemberOrDeclaringTypeOrDefault<DisableValidationAttribute>(overrideMethod) != null)
                    {
                        await next();
                        return;
                    }
                }
            }

            var controllerActionDescriptor = (ControllerActionDescriptor)context.ActionDescriptor;
            var serviceProvider = context.HttpContext.RequestServices;

            foreach (var parameter in controllerActionDescriptor.Parameters)
            {
                if (context.ActionArguments.TryGetValue(parameter.Name, out var value))
                {
                    var parameterInfo = (parameter as ControllerParameterDescriptor)?.ParameterInfo;
                    var parameterType = parameter.ParameterType;

                    if (value != null &&
                        !TypeHelper.IsPrimitiveExtended(parameterType) &&
                        serviceProvider.GetService(typeof(IValidator<>).MakeGenericType(parameterType)) is IValidator validator)
                    {
                        var validationContext = new ValidationContext<object>(value);

                        var validationResult = await validator.ValidateAsync(validationContext, context.HttpContext.RequestAborted);

                        if (!validationResult.IsValid)
                        {

                            var displayNameCache = new Dictionary<string, string>();
                            var modelType = value.GetType();
                            foreach (var error in validationResult.Errors)
                            {
                                var errorMessage = error.ErrorMessage;
                                var propertyName = error.PropertyName;
                                if (!displayNameCache.TryGetValue(propertyName, out var displayName))
                                {
                                    var propertyInfo = modelType.GetProperty(propertyName);
                                    if (propertyInfo != null)
                                    {
                                        var displayAttr = propertyInfo.GetCustomAttributes(typeof(System.ComponentModel.DisplayNameAttribute), true)
                                            .Cast<System.ComponentModel.DisplayNameAttribute>()
                                            .FirstOrDefault();
                                        displayName = displayAttr?.DisplayName ?? propertyInfo.Name;
                                    }
                                    else
                                    {
                                        displayName = propertyName;
                                    }

                                    displayNameCache[propertyName] = displayName;
                                }

                                if (errorMessage.StartsWith("common_validation"))
                                {
                                    errorMessage = GetCommonErrorMessage(errorMessage, displayNameCache[propertyName], error);
                                }
                                context.ModelState.AddModelError(error.PropertyName, errorMessage);
                            }
                        }
                    }
                }
            }

            await next();
        }

        private string GetCommonErrorMessage(string errorMessage, string propertyName, ValidationFailure error)
        {
            var l = appFactory.GetServiceDependency<IStringLocalizer<OrdLocalizationResource>>();
            propertyName = l.GetLocalizedMessage(propertyName);
            List<object> prms = new List<object>()
            {
                propertyName
            };
            if (!string.IsNullOrEmpty(error.ErrorCode))
            {
                var parts = error.ErrorCode.Split(";")
                    .Where(x => !string.IsNullOrWhiteSpace(x));
                prms.AddRange(parts);
            }
            return l.GetLocalizedMessage(errorMessage, [.. prms]);
        }
    }
}
