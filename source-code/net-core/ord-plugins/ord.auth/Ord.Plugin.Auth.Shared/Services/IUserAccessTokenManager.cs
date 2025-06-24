using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Users;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface IUserAccessTokenManager : IDomainService
    {
        /// <summary>
        /// Lưu thông tin token mới
        /// </summary>
        Task<UserAccessTokenDto> SaveTokenAsync(UserLoginDto user, JwtDto jwt);
        /// <summary>
        /// Lấy danh sách token của user hiện tại
        /// </summary>
        Task<List<UserAccessTokenDto>> GetMyTokensAsync();
        /// <summary>
        /// Thu hồi token
        /// </summary>
        Task<CommonResultDto<bool>> RevokeTokenAsync(RevokeTokenDto input);
        /// <summary>
        /// Thu hồi nhiều token
        /// </summary>
        Task<CommonResultDto<bool>> RevokeMultipleTokensAsync(RevokeMultipleTokensDto input);
        /// <summary>
        /// Thu hồi tất cả token khác (giữ lại token hiện tại)
        /// </summary>
        Task<CommonResultDto<bool>> RevokeAllOtherTokensAsync();
        /// <summary>
        /// Thu hồi tất cả token của user
        /// </summary>
        Task<CommonResultDto<bool>> RevokeAllUserTokensAsync(Guid userId);
        /// <summary>
        /// Cập nhật thời gian sử dụng token
        /// </summary>
        Task UpdateTokenUsageAsync(string tokenId);

        /// <summary>
        /// Kiểm tra token có hợp lệ không
        /// </summary>
        Task<bool> IsTokenValidAsync(string tokenId);

    }
}
