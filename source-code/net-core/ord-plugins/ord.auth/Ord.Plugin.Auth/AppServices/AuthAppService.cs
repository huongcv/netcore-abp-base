using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Volo.Abp.Application.Services;
namespace Ord.Plugin.Auth.AppServices
{
    public class AuthAppService(IAppFactory appFactory) : ApplicationService
    {
        private IAuthManager AuthManager => appFactory.GetServiceDependency<IAuthManager>();
        public async Task<CommonResultDto<JwtDto>> Login(LoginInputDto input)
        {
            return await AuthManager.LoginAsync(input);
        }
        [OrdAuth]
        public  Task Logout()
        {
            return AuthManager.LogoutAsync();
        }
    }
}
