using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Localization;
using Ord.Plugin.Contract.Services;
using Ord.Plugin.Core.Utils;

namespace Ord.Plugin
{
    /// <summary>
    /// Orenda Authorize 
    /// Các policies (permission)
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class OrdAuthAttribute : AuthorizeAttribute, IAsyncAuthorizationFilter
    {
        public string PermissionName { get; private set; }

        public OrdAuthAttribute()
        {

        }
        public OrdAuthAttribute(string permissionName)
        {
            PermissionName = permissionName;
        }
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }
            if (string.IsNullOrEmpty(PermissionName))
            {
                return;
            }
            // Check if action allows anonymous access
            if (HasAllowAnonymousAttribute(context))
            {
                return;
            }
            var services = context.HttpContext.RequestServices;
            var logger = services.GetService<ILogger<OrdAuthAttribute>>();
            var factory = services.GetRequiredService<IAppFactory>();
            var currentUserId = factory.CurrentUserId;
            if (!currentUserId.HasValue)
            {
                logger?.LogWarning("No current user ID found for permission check: {PermissionName}", PermissionName);
                HandleUnauthorized(context);
                return;
            }
            if (factory.IsSuperAdminLevel())
            {
                logger?.LogDebug("Super admin access granted for permission: {PermissionName}", PermissionName);
                return;
            }
            var permissionChecker = factory.GetServiceDependency<IPermissionSharedManger>();
            var authorized = await permissionChecker.IsGranted(factory.CurrentUserId.Value, PermissionName);
            if (!authorized)
            {
                logger?.LogWarning("Access denied for user {UserId} to permission: {PermissionName}",
                    currentUserId.Value, PermissionName);
                HandleUnauthorized(context);
            }
            else
            {
                logger?.LogDebug("Access granted for user {UserId} to permission: {PermissionName}",
                    currentUserId.Value, PermissionName);
            }
        }
        private static bool HasAllowAnonymousAttribute(AuthorizationFilterContext context)
        {
            return context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
        }
        private static void HandleUnauthorized(AuthorizationFilterContext context)
        {
            var services = context.HttpContext.RequestServices;
            var factory = services.GetRequiredService<IAppFactory>();
            var l = factory.GetServiceDependency<IStringLocalizer<OrdLocalizationResource>>();
            // Option 3: Return custom JSON response (for API endpoints)
            context.Result = new JsonResult(new { code = "403", message = l["access_denied"].Value })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }

    }
}
