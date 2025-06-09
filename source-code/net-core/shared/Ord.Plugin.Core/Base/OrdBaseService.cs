using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Authorization;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Base
{
    public class OrdBaseService(IAbpLazyServiceProvider lazyServiceProvider,
        IStringLocalizer localizer) : IScopedDependency
    {
        protected IAppFactory AppFactory => lazyServiceProvider.LazyGetRequiredService<IAppFactory>();
        protected IStringLocalizer L => localizer;

        #region Result Creation Methods

        /// <summary>
        /// Tạo kết quả thành công với dữ liệu và thông báo đã localize
        /// </summary>
        public CommonResultDto<T> CreateSuccessResult<T>(T data, string message = "", params object[] formatArgs)
        {
            return CommonResultDto<T>.Ok(data, GetLocalizedMessage(message, formatArgs));
        }

        /// <summary>
        /// Tạo kết quả lỗi với thông báo đã localize
        /// </summary>
        public CommonResultDto<T> CreateErrorResult<T>(string message, params object[] formatArgs)
        {
            return CommonResultDto<T>.Failed(GetLocalizedMessage(message, formatArgs));
        }

        /// <summary>
        /// Tạo kết quả không có quyền với thông báo đã localize
        /// </summary>
        public CommonResultDto<T> CreateUnauthorizedResult<T>(string message = "Unauthorized", params object[] formatArgs)
        {
            return CommonResultDto<T>.Unauthorized(GetLocalizedMessage(message, formatArgs));
        }

        #endregion

        #region Localization Methods

        /// <summary>
        /// Lấy thông báo đã localize
        /// </summary>
        public string GetLocalizedMessage(string key, params object[] formatArgs)
        {
            return L.GetLocalizedMessage(key, formatArgs);
        }

        /// <summary>
        /// Lấy thông báo đã localize hoặc giá trị mặc định
        /// </summary>
        public string GetLocalizedMessageOrDefault(string key, string defaultValue = "", params object[] formatArgs)
        {
            try
            {
                var localizedString = formatArgs?.Length > 0
                    ? L[key, formatArgs]
                    : L[key];

                return localizedString.ResourceNotFound ? defaultValue : localizedString.Value;
            }
            catch
            {
                return defaultValue;
            }
        }

        #endregion

        #region Permission Methods

        /// <summary>
        /// Kiểm tra quyền của người dùng hiện tại
        /// </summary>
        public virtual async Task<bool> CheckPermissionAsync(string permissionName)
        {
            return await AppFactory.CheckPermissionAsync(permissionName);
        }

        /// <summary>
        /// Đảm bảo người dùng có quyền, throw exception nếu không có
        /// </summary>
        public virtual async Task EnsurePermissionAsync(string permissionName, string errorMessage = "")
        {
            var hasPermission = await CheckPermissionAsync(permissionName);
            if (!hasPermission)
            {
                var message = string.IsNullOrWhiteSpace(errorMessage)
                    ? GetLocalizedMessage("err_403")
                    : GetLocalizedMessage(errorMessage);
                throw new AbpAuthorizationException(message);
            }
        }

        /// <summary>
        /// Đảm bảo người dùng hiện tại có quyền, throw exception nếu không có quyền
        /// </summary>
        /// <param name="permissionName">Tên quyền cần kiểm tra</param>
        /// <param name="errorMessage">Thông báo lỗi tùy chỉnh (key localization)</param>
        /// <exception cref="AbpAuthorizationException">Khi người dùng không có quyền</exception>
        public async Task<CommonResultDto<T>> CheckPermissionAndExecuteAsync<T>(
            string permissionName,
            Func<Task<CommonResultDto<T>>> action,
            string errorMessage = "")
        {
            try
            {
                await EnsurePermissionAsync(permissionName, errorMessage);
                return await action();
            }
            catch (AbpAuthorizationException ex)
            {
                await AppFactory.CurrentUnitOfWork.RollbackAsync();
                var message = string.IsNullOrWhiteSpace(errorMessage)
                    ? GetLocalizedMessage("err_403")
                    : GetLocalizedMessage(errorMessage);
                return CommonResultDto<T>.Forbidden(message);
            }
        }
        #endregion
    }
}
