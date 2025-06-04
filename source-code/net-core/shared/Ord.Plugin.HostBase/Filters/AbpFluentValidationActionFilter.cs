using FluentValidation;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Reflection;
using Volo.Abp.Validation;

namespace Ord.Plugin.HostBase.Filters
{
    public class AbpFluentValidationActionFilter : IAsyncActionFilter
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
                            foreach (var error in validationResult.Errors)
                            {
                                context.ModelState.AddModelError(error.PropertyName, error.ErrorMessage);
                            }
                        }
                    }
                }
            }

            await next();
        }
    }
}
