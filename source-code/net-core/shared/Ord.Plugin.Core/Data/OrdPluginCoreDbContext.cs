using Microsoft.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Data
{
    public class OrdPluginCoreDbContext : AbpDbContext<OrdPluginCoreDbContext>
    {
        public OrdPluginCoreDbContext(DbContextOptions<OrdPluginCoreDbContext> options) : base(options)
        {
        }
    }
}
