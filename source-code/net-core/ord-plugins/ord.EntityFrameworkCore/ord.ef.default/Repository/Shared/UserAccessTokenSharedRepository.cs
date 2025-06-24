using Ord.Domain.Enums;
using Ord.Plugin.Contract.Repositories;
using System.Text;

namespace Ord.EfCore.Default.Repository.Shared
{
    public class UserAccessTokenSharedRepository(IAppFactory appFactory) : DapperDefaultDbRepository(appFactory), IUserAccessTokenSharedRepository
    {
        public async Task<bool> CheckAccessTokenInActive(string tokenId)
        {
            var sql = new StringBuilder($"SELECT Status FROM user_access_tokens WHERE TokenId = @TokenId and IsDeleted = 0");
            var status = await QueryFirstOrDefaultAsync<string>(sql.ToString(), new
            {
                TokenId = tokenId
            });
            return !string.Equals(status, TokenStatus.Active);
        }
    }
}
