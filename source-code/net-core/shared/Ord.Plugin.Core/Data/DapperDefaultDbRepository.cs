using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Factories;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Data
{
    public class DapperDefaultDbRepository(IAppFactory appFactory)
        : DapperRepositoryBase<OrdPluginCoreDbContext>(appFactory)
    {

    }
}
