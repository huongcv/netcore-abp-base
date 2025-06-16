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
using Ord.Plugin.Contract.Utils;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Reflection;
using Volo.Abp.Validation;

namespace Ord.Plugin.HostBase.Filters;

public class AbpFluentValidationActionFilter(IAppFactory appFactory) : IAsyncActionFilter
{
    private Dictionary<string, string> _displayNameCache;
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (ShouldSkipValidation(context))
        {
            await next();
            return;
        }
        await ValidateActionParametersAsync(context);
        await next();
    }
    private static bool ShouldSkipValidation(ActionExecutingContext context)
    {
        return !context.ActionDescriptor.IsControllerAction() ||
               !context.GetRequiredService<IOptions<AbpAspNetCoreMvcOptions>>().Value.AutoModelValidation ||
               HasDisableValidationAttribute(context);
    }
    private async Task ValidateActionParametersAsync(ActionExecutingContext context)
    {
        var controllerActionDescriptor = (ControllerActionDescriptor)context.ActionDescriptor;
        var serviceProvider = context.HttpContext.RequestServices;
        _displayNameCache = new();
        foreach (var parameter in controllerActionDescriptor.Parameters)
        {
            if (ShouldValidateParameter(context, parameter, out var value))
            {
                await ValidateParameterAsync(context, serviceProvider, parameter, value);
            }
        }
    }
    private static bool ShouldValidateParameter(ActionExecutingContext context, ParameterDescriptor parameter, out object? value)
    {
        if (!context.ActionArguments.TryGetValue(parameter.Name, out value) || value == null)
        {
            return false;
        }
        var parameterType = parameter.ParameterType;
        return !TypeHelper.IsPrimitiveExtended(parameterType);
    }
    private async Task ValidateParameterAsync(
        ActionExecutingContext context,
        IServiceProvider serviceProvider,
        ParameterDescriptor parameter,
        object value)
    {
        var parameterType = parameter.ParameterType;
        var modelType = value.GetType();
        // FluentValidation
        await ValidateWithFluentValidationAsync(context, serviceProvider, parameterType, modelType, value);

        // DataAnnotations validation can be added here if needed
        // ValidateWithDataAnnotations(context, value, modelType);
    }

    private async Task ValidateWithFluentValidationAsync(
       ActionExecutingContext context,
       IServiceProvider serviceProvider,
       Type parameterType,
       Type modelType,
       object value)
    {
        var validatorType = typeof(IValidator<>).MakeGenericType(parameterType);

        if (serviceProvider.GetService(validatorType) is not IValidator validator)
            return;

        var validationContext = new ValidationContext<object>(value);
        var validationResult = await validator.ValidateAsync(
            validationContext,
            context.HttpContext.RequestAborted);

        if (validationResult.IsValid)
            return;

        foreach (var error in validationResult.Errors)
        {
            var propertyName = error.PropertyName;
            var displayName = GetCachedDisplayName(modelType, propertyName);
            var errorMessage = GetProcessedErrorMessage(error, displayName);

            context.ModelState.AddModelError(propertyName, errorMessage);
        }
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

    private string GetCachedDisplayName(Type modelType, string propertyName)
    {
        var cacheKey = $"{modelType.FullName}.{propertyName}";

        if (_displayNameCache.TryGetValue(cacheKey, out var cachedDisplayName))
            return cachedDisplayName;

        var displayName = GetLocalizedDisplayName(modelType, propertyName);
        _displayNameCache[cacheKey] = displayName;

        return displayName;
    }

    private string GetProcessedErrorMessage(ValidationFailure error, string displayName)
    {
        var errorMessage = error.ErrorMessage;

        if (errorMessage.StartsWith(ValidationMessages.Prefix))
        {
            return GetCommonErrorMessage(errorMessage, displayName, error);
        }

        return errorMessage;
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

    private string GetLocalizedDisplayName(Type modelType, string propertyName)
    {
        var rawDisplayName = GetDisplayName(modelType, propertyName);
        rawDisplayName = StringUtil.AddPrefixForFieldNameLocalized(rawDisplayName);
        return appFactory.GetLocalizedMessage(rawDisplayName);
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
