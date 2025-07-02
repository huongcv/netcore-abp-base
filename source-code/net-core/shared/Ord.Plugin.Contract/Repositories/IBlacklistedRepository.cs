using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Repositories
{
    public interface IBlacklistedRepository : IScopedDependency
    {
        Task<string> GetPasswordAsync(string password);
    }
}
