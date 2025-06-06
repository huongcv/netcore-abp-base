using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Core.Base
{
    public abstract class OrdManagerBase : DomainService
    {
        protected IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
        protected IStringLocalizer L => GetMainLocalizer();


        /// <summary>
        /// Tạo kết quả thành công với dữ liệu và thông báo đã localize
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu trả về</typeparam>
        /// <param name="data">Dữ liệu trả về</param>
        /// <param name="message">Thông báo (key localization)</param>
        /// <param name="formatArgs">Tham số format cho thông báo</param>
        /// <returns>CommonResultDto với trạng thái thành công</returns>
        protected CommonResultDto<T> CreateSuccessResult<T>(T data, string message = "", params object[] formatArgs)
        {
            return CommonResultDto<T>.Ok(data, GetLocalizedMessage(message));
        }
        /// <summary>
        /// Tạo kết quả lỗi với thông báo đã localize
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu trả về</typeparam>
        /// <param name="message">Thông báo lỗi (key localization)</param>
        /// <param name="formatArgs">Tham số format cho thông báo</param>
        /// <returns>CommonResultDto với trạng thái lỗi</returns>
        protected CommonResultDto<T> CreateErrorResult<T>(string message, params object[] formatArgs)
        {
            return CommonResultDto<T>.Failed(GetLocalizedMessage(message));
        }
        /// <summary>
        /// Tạo kết quả không có quyền với thông báo đã localize
        /// </summary>
        /// <typeparam name="T">Kiểu dữ liệu trả về</typeparam>
        /// <param name="message">Thông báo không có quyền (key localization)</param>
        /// <param name="formatArgs">Tham số format cho thông báo</param>
        /// <returns>CommonResultDto với trạng thái không có quyền</returns>
        protected CommonResultDto<T> CreateUnauthorizedResult<T>(string message = "Unauthorized", params object[] formatArgs)
        {
            return CommonResultDto<T>.Unauthorized(GetLocalizedMessage(message, formatArgs));
        }

        protected string GetLocalizedMessage(string key, params object[] formatArgs)
        {
            return L.GetLocalizedMessage(key, formatArgs);
        }
        protected string GetLocalizedMessageOrDefault(string key, string defaultValue = "", params object[] formatArgs)
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
        /// <summary>
        /// Kiểm tra quyền của người dùng hiện tại
        /// </summary>
        /// <param name="permissionName">Tên quyền cần kiểm tra</param>
        /// <param name="throwEx">Có throw exception khi không có quyền hay không</param>
        /// <returns>True nếu có quyền, False nếu không có quyền</returns>
        protected async Task<bool> CheckPermissionAsync(string permissionName, bool throwEx = false)
        {
            var hasPermission = await AppFactory.CheckPermissionAsync(permissionName);
            if (!hasPermission)
            {
                throw new AbpAuthorizationException(GetLocalizedMessage("err_403"));
            }
            return hasPermission;
        }
        protected async Task EnsurePermissionAsync(string permissionName, string errorMessage = "")
        {
           
        }
        /// <summary>
        /// Đảm bảo người dùng hiện tại có quyền, throw exception nếu không có quyền
        /// </summary>
        /// <param name="permissionName">Tên quyền cần kiểm tra</param>
        /// <param name="errorMessage">Thông báo lỗi tùy chỉnh (key localization)</param>
        /// <exception cref="AbpAuthorizationException">Khi người dùng không có quyền</exception>
        protected async Task<CommonResultDto<T>> CheckPermissionAndExecuteAsync<T>(
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
                var message = string.IsNullOrWhiteSpace(errorMessage)
                    ? GetLocalizedMessage("err_403")
                    : GetLocalizedMessage(errorMessage);
                return CommonResultDto<T>.Unauthorized(message);
            }
        }
        protected abstract IStringLocalizer GetMainLocalizer();
    }
}
