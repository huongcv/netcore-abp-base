using Ord.Plugin.Contract.Data;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Data
{
    public class DapperDefaultDbRepository : DapperRepositoryBase<OrdPluginCoreDbContext>, IDapperDefaultDbContext
    {

        public DapperDefaultDbRepository(IDbContextProvider<OrdPluginCoreDbContext> dbContextProvider) : base(dbContextProvider)
        {
        }
    }
}
