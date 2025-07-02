using Ord.Plugin.Contract.Repositories;

namespace Ord.EfCore.Default.Repository.Shared
{
    public class BlacklistedRepository(IAppFactory appFactory) : DapperDefaultDbRepository(appFactory), IBlacklistedRepository
    {
        public Task<string> GetPasswordAsync(string password)
        {
            var sql = $@"SELECT `Value` from system_blacklisted where `Value` = @Value and `Name` = @Name";
            return QueryFirstOrDefaultAsync<string>(sql, new
            {
                Value = password,
                Name = "WEAK_PASSWORD"
            });
        }
    }
}
