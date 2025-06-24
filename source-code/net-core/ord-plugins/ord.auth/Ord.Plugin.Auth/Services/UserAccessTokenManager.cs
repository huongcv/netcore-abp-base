using DeviceDetectorNET.Cache;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Ord.Contract.Entities;
using Ord.Domain.Entities.Auth;
using Ord.Domain.Enums;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Users;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Factories.Extensions;
using Ord.Plugin.Core.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using Volo.Abp.Caching;
using Volo.Abp.ObjectMapping;

namespace Ord.Plugin.Auth.Services
{
    public class UserAccessTokenManager : OrdAuthManagerBase, IUserAccessTokenManager
    {
        private IUserAccessTokenRepository TokenRepository =>
            AppFactory.GetServiceDependency<IUserAccessTokenRepository>();
        private ILogger<UserAccessTokenManager> _logger => AppFactory.GetServiceDependency<ILogger<UserAccessTokenManager>>();
        private IObjectMapper ObjectMapper => AppFactory.GetServiceDependency<IObjectMapper>();
        private IIdEncoderService<UserEntity, Guid> IdEncoderService => AppFactory.GetServiceDependency<IIdEncoderService<UserEntity, Guid>>();

        public async Task<UserAccessTokenDto> SaveTokenAsync(UserLoginDto user, JwtDto jwt)
        {
            try
            {
                // Extract token ID from JWT
                var tokenId = ExtractTokenIdFromJwt(jwt.AccessToken);
                if (string.IsNullOrEmpty(tokenId))
                {
                    tokenId = Guid.NewGuid().ToString();
                }

                // Get client information
                var clientInfo = AppFactory.GetClientInformation();

                // Create token entity
                var tokenEntity = new UserAccessTokenEntity
                {
                    UserId = jwt.UserId,
                    TenantId = jwt.TenantId,
                    TokenId = tokenId,
                    TokenHash = ComputeTokenHash(jwt.AccessToken),
                    ExpiresAt = jwt.ExpiresAt,
                    IpAddress = clientInfo.IpAddress,
                    UserAgent = clientInfo.UserAgent,
                    DeviceName = UserAgentUtil.GetDeviceNameFromUserAgent(clientInfo.UserAgent),
                    Platform = AppFactory.DetectPlatform(),
                    Status = TokenStatus.Active
                };

                var savedToken = await TokenRepository.InsertAsync(tokenEntity, autoSave: true);

                _logger.LogInformation("Access token saved for user {UserId}, TokenId: {TokenId}",
                    jwt.UserId, tokenId);

                return MapToDto(savedToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving access token for user {UserId}", user.Id);
                throw;
            }
        }

        public async Task<List<UserAccessTokenDto>> GetMyTokensAsync()
        {
            var currentUserId = AppFactory.CurrentUserId;
            var tokens = await TokenRepository.GetUserTokensAsync(currentUserId.Value);
            var currentTokenId = AppFactory.GetTokenIdFromJwt();

            return tokens.Select(token =>
            {
                var dto = MapToDto(token);
                dto.IsCurrentToken = token.TokenId == currentTokenId;
                return dto;
            }).ToList();
        }

        public async Task<CommonResultDto<bool>> RevokeTokenAsync(RevokeTokenDto input)
        {
            try
            {
                var token = await TokenRepository.GetByTokenIdAsync(input.TokenId);
                if (token == null)
                {
                    return CommonResultDto<bool>.Failed("Token not found");
                }

                // Kiểm tra quyền thu hồi token
                var currentUserId = AppFactory.CurrentUserId;
                var hasAdminPermission = await AppFactory.CheckPermissionAsync("Auth.Users.ManageTokens");

                if (!hasAdminPermission && token.UserId != currentUserId)
                {
                    return CommonResultDto<bool>.Forbidden("Cannot revoke other user's token");
                }

                await TokenRepository.RevokeTokenAsync(input.TokenId, input.Reason);

                _logger.LogInformation("Token {TokenId} revoked by user {UserId}",
                    input.TokenId, currentUserId);

                return CommonResultDto<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking token {TokenId}", input.TokenId);
                return CommonResultDto<bool>.ServerFailure(ex);
            }
        }


        public async Task<CommonResultDto<bool>> RevokeMultipleTokensAsync(RevokeMultipleTokensDto input)
        {
            try
            {
                var currentUserId = AppFactory.CurrentUserId;
                var hasAdminPermission = await AppFactory.CheckPermissionAsync("AuthPlugin.User.ManageTokens");
                var tokenIds = input.TokenIds.Distinct().ToList();

                // Nếu không phải admin, kiểm tra tất cả token có thuộc về user hiện tại không
                if (!hasAdminPermission && currentUserId.HasValue)
                {
                    foreach (var tokenId in tokenIds)
                    {
                        var token = await TokenRepository.GetByTokenIdAsync(tokenId);
                        if (token != null && token.UserId != currentUserId.Value)
                        {
                            return CommonResultDto<bool>.Forbidden("Cannot revoke other user's tokens");
                        }
                    }
                }
                if (!IdEncoderService.TryDecodeId(input.UserEncodedId, out var userId))
                {
                    ValidationExceptionHelper.ThrowNotFound();
                }

                await TokenRepository.RevokeMultipleTokensAsync(userId, tokenIds, input.Reason);
                var cache = AppFactory.LazyService<IDistributedCache<string>>();
                foreach (var tokenId in tokenIds)
                {
                    cache.SetAsync("RevokeToken:" + tokenId, "1", new DistributedCacheEntryOptions()
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(15)
                    });
                }
                _logger.LogInformation("{Count} tokens revoked by user {UserId}",
                    tokenIds.Count, currentUserId);

                return CommonResultDto<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking multiple tokens");
                return CommonResultDto<bool>.ServerFailure(ex);
            }
        }

        public async Task<CommonResultDto<bool>> RevokeAllOtherTokensAsync()
        {
            try
            {
                var currentUserId = AppFactory.CurrentUserId;
                if (!currentUserId.HasValue)
                {
                    return CommonResultDto<bool>.Unauthorized();
                }

                var currentTokenId = AppFactory.GetTokenIdFromJwt();
                if (string.IsNullOrEmpty(currentTokenId))
                {
                    return CommonResultDto<bool>.Failed("Current token ID not found");
                }

                await TokenRepository.RevokeAllUserTokensExceptCurrentAsync(
                    currentUserId.Value, currentTokenId, "Revoked by user - keep current session only");

                _logger.LogInformation("All other tokens revoked for user {UserId}, kept {TokenId}",
                    currentUserId.Value, currentTokenId);

                return CommonResultDto<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking all other tokens");
                return CommonResultDto<bool>.ServerFailure(ex);
            }
        }

        public async Task<CommonResultDto<bool>> RevokeAllUserTokensAsync(Guid userId)
        {
            try
            {
                // Kiểm tra quyền admin
                var hasPermission = await AppFactory.CheckPermissionAsync("AuthPlugin.User.ManageTokens");
                if (!hasPermission)
                {
                    return CommonResultDto<bool>.Forbidden("Insufficient permissions");
                }

                await TokenRepository.RevokeAllUserTokensAsync(userId, "Revoked by administrator");

                _logger.LogInformation("All tokens revoked for user {UserId} by admin {AdminId}",
                    userId, AppFactory.CurrentUserId);

                return CommonResultDto<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking all tokens for user {UserId}", userId);
                return CommonResultDto<bool>.ServerFailure(ex);
            }
        }

        public async Task UpdateTokenUsageAsync(string tokenId)
        {
            try
            {
                var clientInfo = AppFactory.GetClientInformation();
                await TokenRepository.UpdateLastUsedAsync(tokenId, clientInfo.IpAddress);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error updating token usage for {TokenId}", tokenId);
                // Không throw exception vì đây không phải lỗi critical
            }
        }

        public async Task<bool> IsTokenValidAsync(string tokenId)
        {
            try
            {
                return await TokenRepository.IsTokenValidAsync(tokenId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking token validity for {TokenId}", tokenId);
                return false;
            }
        }
        private string? ExtractTokenIdFromJwt(string jwtToken)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(jwtToken);
                return token.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to extract token ID from JWT");
                return null;
            }
        }
        private string ComputeTokenHash(string token)
        {
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
            return Convert.ToBase64String(hashBytes);
        }
        private UserAccessTokenDto MapToDto(UserAccessTokenEntity entity)
        {
            var dto = ObjectMapper.Map<UserAccessTokenEntity, UserAccessTokenDto>(entity);
            dto.IsExpired = entity.IsExpired;
            dto.IsValid = entity.IsValid;
            return dto;
        }
    }
}
