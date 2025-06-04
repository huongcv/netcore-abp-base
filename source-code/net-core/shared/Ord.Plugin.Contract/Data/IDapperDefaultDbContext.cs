using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Data
{
    /// <summary>
    /// Dapper truy vấn db connect string Default
    /// </summary>
    public interface IDapperDefaultDbContext : IDapperDbContext,ITransientDependency
    {
     
    }
}
