using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface IUserImpersonationManager : IDomainService
    {
        Task<CommonResultDto<JwtDto>> LoginAsUserAsync(LoginAsUserInputDto input);
        Task<CommonResultDto<UserLoginDto>> ValidateImpersonationPermissionAsync(Guid targetUserId);
    }
}
