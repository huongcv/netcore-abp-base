using Ord.Plugin.Auth.Data;
using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Core.Data
{
    public class DapperDefaultDbRepository(IAppFactory appFactory) : DapperRepositoryBase<OrdDefaultDbContext>(appFactory)
    {

    }
}
