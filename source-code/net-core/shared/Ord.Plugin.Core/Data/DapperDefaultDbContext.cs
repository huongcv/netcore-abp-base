using Ord.Plugin.Contract.Data;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Data
{
    public class DapperDefaultDbContext:DapperDbcontext<OrdPluginCoreDbContext>, IDapperDefaultDbContext
    {

        public DapperDefaultDbContext(IDbContextProvider<OrdPluginCoreDbContext> dbContextProvider) : base(dbContextProvider)
        {
        }
    }
}
