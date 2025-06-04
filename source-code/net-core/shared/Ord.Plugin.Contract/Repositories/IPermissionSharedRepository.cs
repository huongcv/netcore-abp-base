using Ord.Plugin.Contract.Dtos.Auth;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Repositories
{
    public interface IPermissionSharedRepository : IScopedDependency
    {
        /// <summary>
        /// Hàm này lấy permissions thông qua các roles được assign trực tiếp cho user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<IEnumerable<string>> GetRoleBasedPermissionsAsync(Guid userId);
        /// <summary>
        /// Hàm này lấy các permissions được grant/revoke trực tiếp cho user, không thông qua roles,
        /// Và có độ ưu tiên cao hơn role-based
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<IEnumerable<UserPermissionGrantedDto>> GetDirectUserPermissionsAsync(Guid userId);
    }
}
