using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Features.RateLimits
{
    public interface IRateLimitStore : ITransientDependency
    {
        Task<bool> IsAllowedAsync(string key, int limit, TimeSpan window);
        Task<RateLimitResult> CheckRateLimitAsync(string key, int limit, TimeSpan window);
        Task<bool> ClearRateLimitAsync(string key);
        Task<Dictionary<string, RateLimitResult>> GetRateLimitStatusAsync(IEnumerable<string> keys, int limit, TimeSpan window);
    }
}
