using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Features.Validation;
using Ord.Plugin.Contract.Localization;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Reflection;
using Volo.Abp.Validation;

namespace Ord.Plugin.HostBase.Filters;

public class AbpFluentValidationActionFilter(IAppFactory appFactory) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.ActionDescriptor.IsControllerAction() ||
            !context.GetRequiredService<IOptions<AbpAspNetCoreMvcOptions>>().Value.AutoModelValidation ||
            HasDisableValidationAttribute(context))
        {
            await next();
            return;
        }

        var controllerActionDescriptor = (ControllerActionDescriptor)context.ActionDescriptor;
        var serviceProvider = context.HttpContext.RequestServices;

        foreach (var parameter in controllerActionDescriptor.Parameters)
        {
            if (!context.ActionArguments.TryGetValue(parameter.Name, out var value)) continue;

            var parameterType = parameter.ParameterType;

            if (value != null && !TypeHelper.IsPrimitiveExtended(parameterType))
            {
                var modelType = value.GetType();
                var displayNameCache = new Dictionary<string, string>();

                // 1. FluentValidation
                if (serviceProvider.GetService(typeof(IValidator<>).MakeGenericType(parameterType)) is IValidator validator)
                {
                    var validationContext = new ValidationContext<object>(value);
                    var validationResult = await validator.ValidateAsync(validationContext, context.HttpContext.RequestAborted);

                    if (!validationResult.IsValid)
                    {
                        foreach (var error in validationResult.Errors)
                        {
                            var propertyName = error.PropertyName;
                            if (!displayNameCache.TryGetValue(propertyName, out var displayName))
                            {
                                displayName = GetLocalizedDisplayName(modelType, propertyName);
                                displayNameCache[propertyName] = displayName;
                            }

                            var errorMessage = error.ErrorMessage;
                            if (errorMessage.StartsWith(ValidationMessages.Prefix))
                            {
                                errorMessage = GetCommonErrorMessage(errorMessage, displayName, error);
                            }

                            context.ModelState.AddModelError(propertyName, errorMessage);
                        }
                    }
                }
            }
        }

        await next();
    }

    private static bool HasDisableValidationAttribute(ActionExecutingContext context)
    {
        var methodInfo = context.ActionDescriptor.GetMethodInfo();
        var controllerType = context.Controller.GetType();

        return ReflectionHelper.GetSingleAttributeOfMemberOrDeclaringTypeOrDefault<DisableValidationAttribute>(methodInfo) != null
            || ReflectionHelper.GetSingleAttributeOfMemberOrDeclaringTypeOrDefault<DisableValidationAttribute>(controllerType) != null
            || (
                methodInfo.DeclaringType != controllerType &&
                controllerType.GetMethods().FirstOrDefault(x =>
                    x.DeclaringType == controllerType &&
                    x.Name == methodInfo.Name &&
                    x.ReturnType == methodInfo.ReturnType &&
                    x.GetParameters().Select(p => p.ToString()).SequenceEqual(methodInfo.GetParameters().Select(p => p.ToString()))
                ) is { } overrideMethod &&
                ReflectionHelper.GetSingleAttributeOfMemberOrDeclaringTypeOrDefault<DisableValidationAttribute>(overrideMethod) != null
            );
    }

    private string GetCommonErrorMessage(string errorMessage, string propertyName, ValidationFailure error)
    {
        var prm = new List<object>
        {
            appFactory.GetLocalizedMessage(propertyName)
        };

        if (!string.IsNullOrEmpty(error.ErrorCode))
        {
            var parts = error.ErrorCode.Split(";")
                .Where(x => !string.IsNullOrWhiteSpace(x));
            prm.AddRange(parts);
        }

        return appFactory.GetLocalizedMessage(errorMessage, [.. prm]);
    }

    private void ValidationWithDataAnnotations(object value, ModelStateDictionary modelState, Type modelType)
    {
        var validationResults = DataAnnotationsValidator.ValidateObject(value, true);
        if (validationResults?.Any() == true)
        {
            foreach (var result in validationResults)
            {
                var memberName = result.MemberNames.FirstOrDefault() ?? "";
                var displayName = GetLocalizedDisplayName(modelType, memberName);
                var message = appFactory.GetLocalizedMessage(result.ErrorMessage, displayName);
                modelState.AddModelError(memberName, message);
            }
        }
    }

    private string GetLocalizedDisplayName(Type modelType, string propertyName)
    {
        var rawDisplayName = GetDisplayName(modelType, propertyName);
        var localizer = appFactory.GetServiceDependency<IOrdLocalizer>();
        return localizer[rawDisplayName];
    }

    private static string GetDisplayName(Type modelType, string propertyName)
    {
        var propertyInfo = modelType.GetProperty(propertyName);
        if (propertyInfo == null) return propertyName;

        // 1. [Display(Name = "...")]
        var displayAttr = propertyInfo.GetCustomAttributes(typeof(DisplayAttribute), true)
            .Cast<DisplayAttribute>()
            .FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(displayAttr?.Name)) return displayAttr.Name;

        // 2. [DisplayName("...")]
        var displayNameAttr = propertyInfo.GetCustomAttributes(typeof(DisplayNameAttribute), true)
            .Cast<DisplayNameAttribute>()
            .FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(displayNameAttr?.DisplayName)) return displayNameAttr.DisplayName;

        // 3. Fallback
        return propertyInfo.Name;
    }
}
