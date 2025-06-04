using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Localization;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Contract.Services;
using Ord.Plugin.Core.Base;
using Volo.Abp.Caching;

namespace Ord.Plugin.Core.Services
{
    public class AppSharedManger : OrdManagerBase, IAppSharedManger
    {
        private IUserSharedRepository UserSharedRepository => AppFactory.GetServiceDependency<IUserSharedRepository>();
        public async Task<UserInformationDto?> GetUserCurrentAsync()
        {
            var userId = AppFactory.CurrentUserId;
            if (!userId.HasValue)
            {
                return null;
            }
            var cache = AppFactory.GetServiceDependency<IDistributedCache<UserInformationDto>>();
            return await cache.GetOrAddAsync(userId.Value.ToString(), () => DoGetUserAsync(userId.Value));
        }

        public Task<UserInformationDto?> GetUserAsync(Guid userId)
        {
            return DoGetUserAsync(userId);
        }
        protected async Task<UserInformationDto?> DoGetUserAsync(Guid userId)
        {
            var user = await UserSharedRepository.GetById(userId);
            return user;
        }


        protected override IStringLocalizer GetMainLocalizer()
        {
            return AppFactory.GetServiceDependency<IStringLocalizer<OrdLocalizationResource>>();
        }
    }
}
