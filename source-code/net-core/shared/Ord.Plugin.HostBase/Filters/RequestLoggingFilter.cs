using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace Ord.Plugin.HostBase.Filters
{
    public class RequestLoggingFilter : ActionFilterAttribute
    {
        private readonly ILogger<RequestLoggingFilter> _logger;

        public RequestLoggingFilter(ILogger<RequestLoggingFilter> logger)
        {
            _logger = logger;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var controllerName = context.Controller.GetType().Name;
            var actionName = context.ActionDescriptor.DisplayName;
            var parameters = context.ActionArguments;

            _logger.LogInformation(
                "Executing action {ControllerName}.{ActionName} with parameters: {@Parameters}",
                controllerName, actionName, parameters);

            base.OnActionExecuting(context);
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var controllerName = context.Controller.GetType().Name;
            var actionName = context.ActionDescriptor.DisplayName;

            if (context.Exception != null)
            {
                _logger.LogError(context.Exception,
                    "Action {ControllerName}.{ActionName} failed with exception",
                    controllerName, actionName);
            }
            else
            {
                _logger.LogInformation(
                    "Action {ControllerName}.{ActionName} completed successfully",
                    controllerName, actionName);
            }

            base.OnActionExecuted(context);
        }
    }

}
