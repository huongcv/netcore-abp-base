using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Volo.Abp.Application.Services;

namespace Ord.Plugin.Core.Base
{
    public abstract class OrdAppServiceBase : ApplicationService
    {
        private OrdBaseService _baseService;
        protected OrdBaseService BaseService => _baseService ??= new OrdBaseService(LazyServiceProvider, GetMainLocalizer());
        protected IStringLocalizer L => GetMainLocalizer();
        protected IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();

        protected CommonResultDto<T> CreateSuccessResult<T>(T data, string message = "", params object[] formatArgs)
            => BaseService.CreateSuccessResult(data, message, formatArgs);

        protected CommonResultDto<T> CreateErrorResult<T>(string message, params object[] formatArgs)
            => BaseService.CreateErrorResult<T>(message, formatArgs);

        protected CommonResultDto<T> CreateUnauthorizedResult<T>(string message = "Unauthorized", params object[] formatArgs)
            => BaseService.CreateUnauthorizedResult<T>(message, formatArgs);

        protected CommonResultDto<T> CreateNotFoundResult<T>(string message = "not_found", params object[] formatArgs)
            => BaseService.CreateNotFoundResult<T>(message, formatArgs);

        protected string GetLocalizedMessage(string key, params object[] formatArgs)
            => BaseService.GetLocalizedMessage(key, formatArgs);

        protected string GetLocalizedMessageOrDefault(string key, string defaultValue = "", params object[] formatArgs)
            => BaseService.GetLocalizedMessageOrDefault(key, defaultValue, formatArgs);

        protected Task<bool> CheckPermissionAsync(string permissionName)
            => BaseService.CheckPermissionAsync(permissionName);

        protected Task EnsurePermissionAsync(string permissionName, string errorMessage = "")
            => BaseService.EnsurePermissionAsync(permissionName, errorMessage);

        protected Task<CommonResultDto<T>> CheckPermissionAndExecuteAsync<T>(
            string permissionName,
            Func<Task<CommonResultDto<T>>> action,
            string errorMessage = "")
            => BaseService.CheckPermissionAndExecuteAsync(permissionName, action, errorMessage);



        protected abstract IStringLocalizer GetMainLocalizer();
    }
}
