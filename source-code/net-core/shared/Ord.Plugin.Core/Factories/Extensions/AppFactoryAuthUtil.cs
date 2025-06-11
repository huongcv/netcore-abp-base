using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Exceptions;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Authorization;

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
    }
}
