using AutoMapper;
using AutoMapper.QueryableExtensions;
using Ord.Domain.Entities.Auth;
using Ord.Domain.Enums;
using Ord.Plugin.Auth.Shared.Dtos.Users;

namespace Ord.EfCore.Default.Repository.Auth
{
    public class UserAccessTokenRepository(IAppFactory factory)
        : DefaultBaseRepository<UserAccessTokenEntity, Guid>(factory), IUserAccessTokenRepository
    {
        public async Task<PagedResultDto<UserAccessTokenDto>> GetPagedTokensAsync(Guid userId, GetUserAccessTokenPagedInput pagedInput)
        {
            var queryable = await GetQueryableAsNoTracking();
            queryable = queryable.Where(x => x.UserId == userId)
                .WhereIfHasValue(pagedInput.Status, x => x.Status == pagedInput.Status);
            var map = AppFactory.GetServiceDependency<IMapper>();
            var query = queryable.ProjectTo<UserAccessTokenDto>(map.ConfigurationProvider)
                .OrderByDescending(x => x.ExpiresAt);
            return await QueryPagedResultAsync(query, pagedInput);
        }

        public async Task<UserAccessTokenEntity?> GetByTokenIdAsync(string tokenId)
        {
            var queryable = await GetQueryableAsync();
            return await queryable.AsNoTracking().Where(x => x.TokenId == tokenId).FirstOrDefaultAsync();
        }

        public async Task<List<UserAccessTokenEntity>> GetUserTokensAsync(Guid userId)
        {
            var queryable = await GetQueryableAsync();
            var query = queryable.Where(x => x.UserId == userId);
            return await AsyncExecuter.ToListAsync(
                query.OrderByDescending(x => x.CreationTime));
        }

        public async Task<List<UserAccessTokenEntity>> GetActiveUserTokensAsync(Guid userId)
        {
            var queryable = await GetQueryableAsync();
            var now = DateTime.Now;
            return await AsyncExecuter.ToListAsync(
                queryable.Where(x => x.UserId == userId
                                     && x.Status == TokenStatus.Active
                                     && x.ExpiresAt > now)
                    .OrderByDescending(x => x.LastUsedAt ?? x.CreationTime));
        }

        public async Task RevokeTokenAsync(string tokenId, string? reason = null)
        {
            var token = await GetByTokenIdAsync(tokenId);
            if (token != null && token.Status == TokenStatus.Active)
            {
                token.Status = TokenStatus.Revoked;
                token.RevokeReason = reason;
                token.RevokedAt = DateTime.Now;
                token.ExpiresAt = DateTime.Now.AddSeconds(1);
                await UpdateAsync(token);
            }
        }

        public async Task RevokeMultipleTokensAsync(Guid userId, List<string> tokenIds, string? reason = null)
        {
            var queryable = await GetQueryableAsync();
            var tokens = await AsyncExecuter.ToListAsync(
                queryable.Where(x => x.UserId == userId 
                                     && tokenIds.Contains(x.TokenId)
                                     && x.Status == TokenStatus.Active));

            foreach (var token in tokens)
            {
                token.Status = TokenStatus.Revoked;
                token.RevokeReason = reason;
                token.RevokedAt = DateTime.UtcNow;
                token.ExpiresAt = DateTime.Now.AddSeconds(1);
            }

            await UpdateManyAsync(tokens);
        }

        public async Task RevokeAllUserTokensAsync(Guid userId, string? reason = null)
        {
            var queryable = await GetQueryableAsync();
            var tokens = await AsyncExecuter.ToListAsync(
                queryable.Where(x => x.UserId == userId && x.Status == TokenStatus.Active));

            foreach (var token in tokens)
            {
                token.Status = TokenStatus.Revoked;
                token.RevokeReason = reason;
                token.RevokedAt = DateTime.UtcNow;
                token.ExpiresAt = DateTime.Now.AddSeconds(1);
            }

            await UpdateManyAsync(tokens);
        }

        public async Task RevokeAllUserTokensExceptCurrentAsync(Guid userId, string currentTokenId, string? reason = null)
        {
            var queryable = await GetQueryableAsync();
            var tokens = await AsyncExecuter.ToListAsync(
                queryable.Where(x => x.UserId == userId
                                     && x.TokenId != currentTokenId
                                     && x.Status == TokenStatus.Active));

            foreach (var token in tokens)
            {
                token.Status = TokenStatus.Revoked;
                token.RevokeReason = reason ?? "Revoked by user";
                token.RevokedAt = DateTime.UtcNow;
                token.ExpiresAt = DateTime.Now.AddSeconds(1);
            }

            await UpdateManyAsync(tokens);
        }

        public async Task UpdateLastUsedAsync(string tokenId, string? ipAddress = null)
        {
            var token = await GetByTokenIdAsync(tokenId);
            if (token != null && token.IsValid)
            {
                token.LastUsedAt = DateTime.Now;
                if (!string.IsNullOrEmpty(ipAddress))
                {
                    token.IpAddress = ipAddress;
                }
                await UpdateAsync(token);
            }
        }
        public async Task<int> DeleteExpiredTokensAsync(Guid? userId)
        {
            var queryable = await GetQueryableAsync();
            var deleteEntities = await queryable
                .Where(x => x.ExpiresAt < DateTime.Now)
                .WhereIf(userId.HasValue, x => x.UserId == userId)
                .ToListAsync();
            await DeleteManyAsync(deleteEntities);
            return deleteEntities.Count;
        }
        public async Task<bool> IsTokenValidAsync(string tokenId)
        {
            var queryable = await GetQueryableAsync();
            return await AsyncExecuter.AnyAsync(
                queryable.Where(x => x.TokenId == tokenId
                                     && x.Status == TokenStatus.Active
                                     && x.ExpiresAt > DateTime.Now));
        }

        public async Task<int> GetActiveTokenCountAsync(Guid userId)
        {
            var queryable = await GetQueryableAsync();
            return await AsyncExecuter.CountAsync(
                queryable.Where(x => x.UserId == userId
                                     && x.Status == TokenStatus.Active
                                     && x.ExpiresAt > DateTime.Now));
        }
    }
}
