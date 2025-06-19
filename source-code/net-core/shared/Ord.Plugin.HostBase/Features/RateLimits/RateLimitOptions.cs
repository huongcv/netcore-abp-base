namespace Ord.Plugin.Core.Features.RateLimits
{
    public class RateLimitOptions
    {
    
        public const string SectionName = "RateLimit";
        public bool IsEnabled { get; set; } = false;
        public string KeyPrefix { get; set; } = "rate_limit";

        public IpRateLimitPolicy IpPolicy { get; set; } = new();
        public UserRateLimitPolicy UserPolicy { get; set; } = new();
        public TenantRateLimitPolicy TenantPolicy { get; set; } = new();

        public List<string?> EndpointWhitelist { get; set; } = new();
    }

    public class IpRateLimitPolicy
    {
        public bool IsEnabled { get; set; } = false;

        // IP trắng không bị giới hạn
        public List<string> Whitelist { get; set; } = new();

        // Rule mặc định cho tất cả IP
        public List<RateLimitRule> GlobalRules { get; set; } = new();

        // Rule riêng theo từng IP
        public Dictionary<string, List<RateLimitRule>> IpSpecificRules { get; set; } = new();
    }

    public class UserRateLimitPolicy
    {
        public bool IsEnabled { get; set; } = false;

        // Rule riêng theo từng UserId
        public Dictionary<string, List<RateLimitRule>> UserSpecificRules { get; set; } = new();
    }

    public class TenantRateLimitPolicy
    {
        public bool IsEnabled { get; set; } = false;

        // Rule riêng theo từng TenantId
        public Dictionary<string, List<RateLimitRule>> TenantSpecificRules { get; set; } = new();
    }
    public class RateLimitRule
    {
        public string Endpoint { get; set; } = default!;
        public int PermitLimit { get; set; }

        // Dùng khi đọc từ appsettings, ví dụ "1m", "10s"
        public string Period { get; set; } = "1m";

        // Chuyển từ Period sang Window cho middleware dùng
        public TimeSpan Window => ParsePeriodToTimeSpan(Period);

        private static TimeSpan ParsePeriodToTimeSpan(string period)
        {
            if (string.IsNullOrWhiteSpace(period))
                return TimeSpan.FromMinutes(1);

            if (TimeSpan.TryParse(period, out var ts))
                return ts;

            var number = int.Parse(new string(period.Where(char.IsDigit).ToArray()));
            var unit = new string(period.Where(char.IsLetter).ToArray()).ToLowerInvariant();

            return unit switch
            {
                "s" or "sec" or "secs" => TimeSpan.FromSeconds(number),
                "m" or "min" or "mins" => TimeSpan.FromMinutes(number),
                "h" or "hr" or "hrs" => TimeSpan.FromHours(number),
                "d" or "day" => TimeSpan.FromDays(number),
                _ => TimeSpan.FromMinutes(1),
            };
        }
    }
}
