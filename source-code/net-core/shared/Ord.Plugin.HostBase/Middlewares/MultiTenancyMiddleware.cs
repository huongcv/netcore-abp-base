using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;

namespace Ord.Plugin.HostBase.Middlewares
{
    public class OrdMultiTenancyMiddleware : ITransientDependency
    {
        private readonly RequestDelegate _next;
        private readonly ICurrentTenant _currentTenant;
        public ILogger<OrdMultiTenancyMiddleware> Logger { get; set; }
        public OrdMultiTenancyMiddleware(ICurrentTenant currentTenant, RequestDelegate next)
        {
            _currentTenant = currentTenant;
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            TenantConfiguration? tenant = null;
            var claims = context?.User?.Claims;
            var tenantId = claims?.FirstOrDefault(x => x.Type == AbpClaimTypes.TenantId)?.Value;
            if (string.IsNullOrEmpty(tenantId))
            {
                await _next(context);
            }
            else
            {
                using (_currentTenant.Change(new Guid(tenantId)))
                {

                    await _next(context);
                }
            }
        }
    }
}
