using System.Net;
using System.Security.Claims;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Services.Auth
{
    public interface ICheckClaimTokenJwtMiddlewareService:ITransientDependency
    {
        /// <summary>
        /// Trả về HttpStatusCode.Ok nếu check điều kiện thỏa mãn
        /// </summary>
        /// <param name="claims"></param>
        /// <returns></returns>
        Task<HttpStatusCode> CheckClaims(IEnumerable<Claim>? claims);
    }
}
