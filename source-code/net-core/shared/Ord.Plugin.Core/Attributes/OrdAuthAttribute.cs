using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services;
using System.Text;

namespace Ord.Plugin
{
    /// <summary>
    /// Orenda Authorize 
    /// Các policies (permission)
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class OrdAuthAttribute : AuthorizeAttribute, IAsyncAuthorizationFilter
    {
        public string PermissionName  { get; private set; } 

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

            var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any()
                                 || context.ActionDescriptor.EndpointMetadata
                                     .Any(em => em.GetType() == typeof(AllowAnonymousAttribute));
            if (allowAnonymous) return;
            var factory = context.HttpContext.RequestServices.GetRequiredService<IAppFactory>();
            if (string.IsNullOrEmpty(PermissionName))
            {
                return;
            }
            var isSuperAdmin = context.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == OrdClaimsTypes.IsSuperAdmin)?.Value;
            if (isSuperAdmin == "1")
            {
                return;
            }

            var permissionChecker = factory.GetServiceDependency<IOrdPermissionCheckerService>();
            var authorized = await permissionChecker.IsGranted(factory.CurrentUserId.Value, PermissionName);
            if (!authorized)
            {
               // context.Result = new ForbidResult("Không có quyền truy cập");
                await WriteAuthorizeErrorResponse(context.HttpContext, StatusCodes.Status403Forbidden, "not_auth", "Không có quyền truy cập dữ liệu");
            }
        }
        private Task WriteAuthorizeErrorResponse(HttpContext httpContext, int statusCodes, object code, string message)
        {
            httpContext.Response.StatusCode = statusCodes;
            httpContext.Response.ContentType = "application/json; charset=utf-8";
            byte[] data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new
            {
                error = new
                {
                    code = code,
                    message = message
                }
            }));
            return httpContext.Response.Body.WriteAsync(data, 0, data.Length);
        }

    }
}
