using Ord.EfCore.Default.EntityFrameworkCore;
using Ord.Plugin.Core.Data;

namespace Ord.EfCore.Default.Data
{
    public class DapperDefaultDbRepository(IAppFactory appFactory) : DapperRepositoryBase<OrdDefaultDbContext>(appFactory)
    {

    }
}
