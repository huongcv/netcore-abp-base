namespace Ord.Plugin.Contract.Features.RateLimits
{
    public class RateLimitResult
    {
        public bool IsAllowed { get; set; }
        public int RemainingRequests { get; set; }
        public TimeSpan? RetryAfter { get; set; }
        public DateTime ResetTime { get; set; }
        public int TotalRequests { get; set; }
    }
}
