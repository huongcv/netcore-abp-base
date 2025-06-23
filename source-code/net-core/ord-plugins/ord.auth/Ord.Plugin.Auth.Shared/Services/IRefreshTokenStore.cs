using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Auth.Shared.Services
{
    /// <summary>
    /// Interface để quản lý lưu trữ refresh token
    /// Có thể implement với Cache hoặc Database
    /// </summary>
    public interface IRefreshTokenStore : IScopedDependency
    {
        /// <summary>
        /// Lưu refresh token
        /// </summary>
        /// <param name="refreshTokenInfo">Thông tin refresh token</param>
        /// <returns>True nếu lưu thành công</returns>
        Task<bool> StoreAsync(RefreshTokenInfo refreshTokenInfo);

        /// <summary>
        /// Lấy thông tin refresh token
        /// </summary>
        /// <param name="token">Refresh token</param>
        /// <returns>Thông tin refresh token nếu tồn tại</returns>
        Task<RefreshTokenInfo?> GetAsync(string token);

        /// <summary>
        /// Cập nhật thông tin refresh token
        /// </summary>
        /// <param name="refreshTokenInfo">Thông tin refresh token cần cập nhật</param>
        /// <returns>True nếu cập nhật thành công</returns>
        Task<bool> UpdateAsync(RefreshTokenInfo refreshTokenInfo);

        /// <summary>
        /// Xóa refresh token
        /// </summary>
        /// <param name="token">Refresh token cần xóa</param>
        /// <returns>True nếu xóa thành công</returns>
        Task<bool> RemoveAsync(string token);

        /// <summary>
        /// Lấy tất cả refresh token của user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>Danh sách refresh token</returns>
        Task<List<RefreshTokenInfo>> GetByUserIdAsync(Guid userId);

        /// <summary>
        /// Xóa tất cả refresh token của user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>True nếu xóa thành công</returns>
        Task<bool> RemoveAllByUserIdAsync(Guid userId);

        /// <summary>
        /// Xóa các token đã hết hạn
        /// </summary>
        /// <returns>Số lượng token đã xóa</returns>
        Task<int> CleanupExpiredTokensAsync();

        /// <summary>
        /// Đếm số lượng token active của user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>Số lượng token active</returns>
        Task<int> CountActiveTokensByUserAsync(Guid userId);

        /// <summary>
        /// Lấy thông tin refresh token bằng JWT ID
        /// </summary>
        /// <param name="jwtId">JWT ID từ access token</param>
        /// <returns>Thông tin refresh token nếu tồn tại</returns>
        Task<RefreshTokenInfo?> GetByJwtIdAsync(string jwtId);

        /// <summary>
        /// Kiểm tra token có tồn tại và hợp lệ không
        /// </summary>
        /// <param name="token">Refresh token</param>
        /// <returns>True nếu token hợp lệ</returns>
        Task<bool> IsValidAsync(string token);

        /// <summary>
        /// Validate cặp refresh token và JWT ID
        /// </summary>
        /// <param name="refreshToken">Refresh token</param>
        /// <param name="jwtId">JWT ID từ access token</param>
        /// <returns>True nếu cặp token hợp lệ</returns>
        Task<bool> ValidateTokenPairAsync(string refreshToken, string jwtId);
    }
}
