using Ord.Domain.Entities.Auth;
using Ord.Plugin.Auth.Shared.Dtos.Users;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IUserAccessTokenRepository : IBasicRepository<UserAccessTokenEntity, Guid>
    {
        Task<PagedResultDto<UserAccessTokenDto>> GetPagedTokensAsync(Guid userId, GetUserAccessTokenPagedInput pagedInput);
        Task<List<CounterByStatusItemDto>> GetCountByStatus(Guid userId, GetUserAccessTokenPagedInput pagedInput);
        /// <summary>
        /// Lấy token theo TokenId
        /// </summary>
        Task<UserAccessTokenEntity?> GetByTokenIdAsync(string tokenId);

        /// <summary>
        /// Lấy danh sách token của user
        /// </summary>
        Task<List<UserAccessTokenEntity>> GetUserTokensAsync(Guid userId);

        /// <summary>
        /// Lấy token đang hoạt động của user
        /// </summary>
        Task<List<UserAccessTokenEntity>> GetActiveUserTokensAsync(Guid userId);

        /// <summary>
        /// Thu hồi token
        /// </summary>
        Task RevokeTokenAsync(string tokenId, string? reason = null);

        /// <summary>
        /// Thu hồi nhiều token
        /// </summary>
        Task RevokeMultipleTokensAsync(Guid userId, List<string> tokenIds, string? reason = null);

        /// <summary>
        /// Thu hồi tất cả token của user
        /// </summary>
        Task RevokeAllUserTokensAsync(Guid userId, string? reason = null);

        /// <summary>
        /// Thu hồi tất cả token của user trừ token hiện tại
        /// </summary>
        Task RevokeAllUserTokensExceptCurrentAsync(Guid userId, string currentTokenId, string? reason = null);

        /// <summary>
        /// Cập nhật thời gian sử dụng token cuối
        /// </summary>
        Task UpdateLastUsedAsync(string tokenId, string? ipAddress = null);

        /// <summary>
        /// Xóa token đã hết hạn
        /// </summary>
        Task<int> DeleteExpiredTokensAsync(Guid? userId);
        /// <summary>
        /// Kiểm tra token có tồn tại và hợp lệ không
        /// </summary>
        Task<bool> IsTokenValidAsync(string tokenId);
        /// <summary>
        /// Lấy số lượng token đang hoạt động của user
        /// </summary>
        Task<int> GetActiveTokenCountAsync(Guid userId);
    }
}
