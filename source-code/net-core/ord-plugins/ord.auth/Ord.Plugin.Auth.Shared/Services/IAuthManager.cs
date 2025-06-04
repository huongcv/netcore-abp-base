using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface IAuthManager : IDomainService
    {
        Task<CommonResultDto<JwtDto>> LoginAsync(LoginInputDto loginInput);
        Task LogoutAsync();
    }
}