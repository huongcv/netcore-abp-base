using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract.Dtos;
using System.Security.Claims;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface IJwtManager : IDomainService
    {
        JwtDto CreateJwt(UserLoginDto loginUser, IEnumerable<Claim> extendClaims = null);
        JwtDto CreateJwt(List<Claim> claims);
    }
}
