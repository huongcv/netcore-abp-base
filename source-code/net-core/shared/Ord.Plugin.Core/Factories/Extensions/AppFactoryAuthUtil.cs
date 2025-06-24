using Microsoft.AspNetCore.Http;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Exceptions;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Factories;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Authorization;
using Volo.Abp.Validation;

namespace Ord
{
    public static class AppFactoryAuthUtil
    {

        /// <summary>
        /// Đảm bảo người dùng hiện tại có quyền, throw exception nếu không có quyền
        /// </summary>
        /// <param name="permissionName">Tên quyền cần kiểm tra</param>
        /// <param name="errorMessage">Thông báo lỗi tùy chỉnh (key localization)</param>
        /// <exception cref="AbpAuthorizationException">Khi người dùng không có quyền</exception>
        public static async Task<CommonResultDto<T>> CheckPermissionAndExecuteAsync<T>(
            this IAppFactory factory,
            string permissionName,
            Func<Task<CommonResultDto<T>>> action,
            string errorMessage = "")
        {
            var hasPermission = await factory.CheckPermissionAsync(permissionName);
            if (hasPermission)
            {
                return await action();
            }
            var message = string.IsNullOrWhiteSpace(errorMessage)
                ? factory.GetLocalizedMessage("err_403")
                : factory.GetLocalizedMessage(errorMessage);
            return CommonResultDto<T>.Forbidden(message);
        }

        public static void CheckHostUser(this IAppFactory factory)
        {
            var currentTenantId = factory.CurrentTenantId;
            if (currentTenantId.HasValue)
            {
                throw new NotAccessPermissionException(factory.GetLocalizedMessage("auth.not_access_to_host_feature"));
            }
        }
        public static async Task ValidateUserCanGrantPermissionsAsync(this IAppFactory factory, IEnumerable<string> listOfPermissions)
        {
            var userSession = await factory.GetUserSessionAsync();
            if (userSession == null)
            {
                throw new AbpValidationException(factory.GetLocalizedMessage("common.user_session_not_found"));
            }
            if (!factory.IsSuperAdminLevel())
            {
                var listPermission = userSession.ListPermission;
                if (listPermission?.Any() != true)
                {
                    throw new AbpValidationException(factory.GetLocalizedMessage("common.user_has_no_permissions"));
                }
                foreach (var permissionName in listOfPermissions)
                {
                    if (listPermission?.Any(s => string.Equals(s, permissionName, StringComparison.OrdinalIgnoreCase)) != true)
                    {
                        throw new AbpValidationException(factory.GetLocalizedMessage("common.user_missing_permissions", permissionName));
                    }
                }
            }
        }
        public static void ClearJwtCookie(this IAppFactory factory)
        {
            var httpContext = factory.HttpContextAccessor().HttpContext;
            if (httpContext == null) return;
            var isHttps = httpContext.Request.IsHttps;
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(-1), // Set thời gian quá khứ để xóa cookie
                Path = "/"
            };

            httpContext.Response.Cookies.Append("jwt", "", cookieOptions);
            httpContext.Response.Cookies.Append("refresh_token", "", cookieOptions);
        }

    }
}
