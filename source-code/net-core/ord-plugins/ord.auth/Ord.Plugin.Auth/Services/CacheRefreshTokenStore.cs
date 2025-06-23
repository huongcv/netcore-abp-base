using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Services;
using System.Text.Json;

namespace Ord.Plugin.Core.Services.Stores
{
    /// <summary>
    /// Implementation của IRefreshTokenStore sử dụng IDistributedCache
    /// Phù hợp cho performance cao và distributed system
    /// </summary>
    public class CacheRefreshTokenStore : IRefreshTokenStore
    {
        private readonly IDistributedCache _cache;
        private readonly ILogger<CacheRefreshTokenStore> _logger;

        private const string TOKEN_KEY_PREFIX = "refresh_token:";
        private const string USER_TOKENS_KEY_PREFIX = "user_refresh_tokens:";

        public CacheRefreshTokenStore(
            IDistributedCache cache,
            ILogger<CacheRefreshTokenStore> logger)
        {
            _cache = cache;
            _logger = logger;
        }

        public async Task<bool> StoreAsync(RefreshTokenInfo refreshTokenInfo)
        {
            try
            {
                var tokenKey = GetTokenKey(refreshTokenInfo.Token);
                var userTokensKey = GetUserTokensKey(refreshTokenInfo.UserId);
                var jwtIdKey = GetJwtIdMappingKey(refreshTokenInfo.JwtId);

                // Lưu thông tin token
                var tokenJson = JsonSerializer.Serialize(refreshTokenInfo);
                var tokenOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = refreshTokenInfo.ExpiresAt
                };
                await _cache.SetStringAsync(tokenKey, tokenJson, tokenOptions);

                // Lưu mapping JWT ID -> Token
                var jwtIdMappingJson = JsonSerializer.Serialize(refreshTokenInfo.Token);
                await _cache.SetStringAsync(jwtIdKey, jwtIdMappingJson, tokenOptions);

                // Cập nhật danh sách token của user
                await AddToUserTokenListAsync(refreshTokenInfo.UserId, refreshTokenInfo.Token);

                _logger.LogDebug("Stored refresh token for user {UserId} with JWT ID {JwtId}",
                    refreshTokenInfo.UserId, refreshTokenInfo.JwtId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error storing refresh token for user {UserId}", refreshTokenInfo.UserId);
                return false;
            }
        }

        public async Task<RefreshTokenInfo?> GetAsync(string token)
        {
            try
            {
                var tokenKey = GetTokenKey(token);
                var tokenJson = await _cache.GetStringAsync(tokenKey);

                if (string.IsNullOrEmpty(tokenJson))
                    return null;

                return JsonSerializer.Deserialize<RefreshTokenInfo>(tokenJson);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting refresh token");
                return null;
            }
        }

        public async Task<bool> UpdateAsync(RefreshTokenInfo refreshTokenInfo)
        {
            try
            {
                var tokenKey = GetTokenKey(refreshTokenInfo.Token);
                var tokenJson = JsonSerializer.Serialize(refreshTokenInfo);
                var tokenOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = refreshTokenInfo.ExpiresAt
                };

                await _cache.SetStringAsync(tokenKey, tokenJson, tokenOptions);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating refresh token");
                return false;
            }
        }

        public async Task<bool> RemoveAsync(string token)
        {
            try
            {
                // Lấy thông tin token trước khi xóa
                var tokenInfo = await GetAsync(token);
                if (tokenInfo == null)
                    return false;

                var tokenKey = GetTokenKey(token);
                var jwtIdKey = GetJwtIdMappingKey(tokenInfo.JwtId);

                await _cache.RemoveAsync(tokenKey);
                await _cache.RemoveAsync(jwtIdKey);

                // Xóa khỏi danh sách token của user
                await RemoveFromUserTokenListAsync(tokenInfo.UserId, token);

                _logger.LogDebug("Removed refresh token for user {UserId} with JWT ID {JwtId}",
                    tokenInfo.UserId, tokenInfo.JwtId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing refresh token");
                return false;
            }
        }

        public async Task<List<RefreshTokenInfo>> GetByUserIdAsync(Guid userId)
        {
            try
            {
                var userTokensKey = GetUserTokensKey(userId);
                var tokensJson = await _cache.GetStringAsync(userTokensKey);

                if (string.IsNullOrEmpty(tokensJson))
                    return new List<RefreshTokenInfo>();

                var tokens = JsonSerializer.Deserialize<List<string>>(tokensJson) ?? new List<string>();
                var result = new List<RefreshTokenInfo>();

                foreach (var token in tokens)
                {
                    var tokenInfo = await GetAsync(token);
                    if (tokenInfo != null)
                    {
                        result.Add(tokenInfo);
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting refresh tokens for user {UserId}", userId);
                return new List<RefreshTokenInfo>();
            }
        }

        public async Task<bool> RemoveAllByUserIdAsync(Guid userId)
        {
            try
            {
                var userTokens = await GetByUserIdAsync(userId);

                foreach (var tokenInfo in userTokens)
                {
                    await RemoveAsync(tokenInfo.Token);
                }

                // Xóa danh sách token của user
                var userTokensKey = GetUserTokensKey(userId);
                await _cache.RemoveAsync(userTokensKey);

                _logger.LogInformation("Removed all refresh tokens for user {UserId}", userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing all refresh tokens for user {UserId}", userId);
                return false;
            }
        }

        public async Task<int> CleanupExpiredTokensAsync()
        {
            // Cache tự động cleanup khi expired, không cần implement
            // Hoặc có thể implement background service để cleanup
            await Task.CompletedTask;
            return 0;
        }

        public async Task<int> CountActiveTokensByUserAsync(Guid userId)
        {
            try
            {
                var userTokens = await GetByUserIdAsync(userId);
                return userTokens.Count(t => t.IsValid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error counting active tokens for user {UserId}", userId);
                return 0;
            }
        }

        public async Task<bool> IsValidAsync(string token)
        {
            try
            {
                var tokenInfo = await GetAsync(token);
                return tokenInfo?.IsValid == true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating refresh token");
                return false;
            }
        }

        public async Task<RefreshTokenInfo?> GetByJwtIdAsync(string jwtId)
        {
            try
            {
                // Trong cache implementation, ta cần scan qua các user tokens
                // Hoặc maintain thêm mapping jwtId -> token
                var jwtIdKey = $"jwt_id_mapping:{jwtId}";
                var tokenJson = await _cache.GetStringAsync(jwtIdKey);

                if (string.IsNullOrEmpty(tokenJson))
                    return null;

                var token = JsonSerializer.Deserialize<string>(tokenJson);
                return await GetAsync(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting refresh token by JWT ID {JwtId}", jwtId);
                return null;
            }
        }

        public async Task<bool> ValidateTokenPairAsync(string refreshToken, string jwtId)
        {
            try
            {
                var tokenInfo = await GetAsync(refreshToken);
                if (tokenInfo == null || !tokenInfo.IsValid)
                    return false;

                return tokenInfo.JwtId == jwtId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token pair");
                return false;
            }
        }

        #region Private Methods

        private string GetTokenKey(string token) => $"{TOKEN_KEY_PREFIX}{token}";
        private string GetUserTokensKey(Guid userId) => $"{USER_TOKENS_KEY_PREFIX}{userId}";
        private string GetJwtIdMappingKey(string jwtId) => $"jwt_id_mapping:{jwtId}";

        private async Task AddToUserTokenListAsync(Guid userId, string token)
        {
            try
            {
                var userTokensKey = GetUserTokensKey(userId);
                var tokensJson = await _cache.GetStringAsync(userTokensKey);

                List<string> tokens;
                if (string.IsNullOrEmpty(tokensJson))
                {
                    tokens = new List<string>();
                }
                else
                {
                    tokens = JsonSerializer.Deserialize<List<string>>(tokensJson) ?? new List<string>();
                }

                if (!tokens.Contains(token))
                {
                    tokens.Add(token);

                    // Giới hạn số lượng token per user
                    const int maxTokensPerUser = 10;
                    if (tokens.Count > maxTokensPerUser)
                    {
                        var oldTokens = tokens.Take(tokens.Count - maxTokensPerUser).ToList();
                        foreach (var oldToken in oldTokens)
                        {
                            await RemoveAsync(oldToken);
                        }
                        tokens = tokens.Skip(oldTokens.Count).ToList();
                    }

                    var updatedTokensJson = JsonSerializer.Serialize(tokens);
                    await _cache.SetStringAsync(userTokensKey, updatedTokensJson, new DistributedCacheEntryOptions
                    {
                        SlidingExpiration = TimeSpan.FromDays(30)
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding token to user list");
            }
        }

        private async Task RemoveFromUserTokenListAsync(Guid userId, string token)
        {
            try
            {
                var userTokensKey = GetUserTokensKey(userId);
                var tokensJson = await _cache.GetStringAsync(userTokensKey);

                if (string.IsNullOrEmpty(tokensJson))
                    return;

                var tokens = JsonSerializer.Deserialize<List<string>>(tokensJson);
                if (tokens == null)
                    return;

                tokens.Remove(token);

                if (tokens.Any())
                {
                    var updatedTokensJson = JsonSerializer.Serialize(tokens);
                    await _cache.SetStringAsync(userTokensKey, updatedTokensJson, new DistributedCacheEntryOptions
                    {
                        SlidingExpiration = TimeSpan.FromDays(30)
                    });
                }
                else
                {
                    await _cache.RemoveAsync(userTokensKey);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing token from user list");
            }
        }

        #endregion
    }
}