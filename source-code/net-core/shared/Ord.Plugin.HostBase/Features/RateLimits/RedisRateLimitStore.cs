using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Ord.Plugin.Contract.Features.RateLimits;
using StackExchange.Redis;

namespace Ord.Plugin.Core.Features.RateLimits;

public class RedisRateLimitStore : IRateLimitStore
{
    private readonly IDistributedCache _cache;
    private readonly IDatabase _database;
    private readonly RateLimitOptions _options;
    private readonly ILogger<RedisRateLimitStore> _logger;

    // Cached Lua scripts
    private readonly string _clearRateLimitScript;
    private string _checkRateLimitLua;
    private LuaScript _clearRateLimitLua;

    public RedisRateLimitStore(
        IDistributedCache cache,
        IConnectionMultiplexer connectionMultiplexer,
        IOptions<RateLimitOptions> options,
        ILogger<RedisRateLimitStore> logger)
    {
        _cache = cache;
        _database = connectionMultiplexer.GetDatabase();
        _options = options.Value;
        _logger = logger;

        // Lua script để check rate limit với sliding window
        _checkRateLimitLua = @"
            local key = KEYS[1]
            local window_start = tonumber(ARGV[1])
            local now = tonumber(ARGV[2])
            local limit = tonumber(ARGV[3])
            local window_seconds = tonumber(ARGV[4])
            
            -- Xóa các entries cũ hơn window
            redis.call('ZREMRANGEBYSCORE', key, 0, window_start)
            
            -- Đếm số requests hiện tại trong window
            local current_count = redis.call('ZCARD', key)
            local remaining = limit - current_count
            
            if remaining > 0 then
                -- Thêm request mới với timestamp unique
                local unique_score = now + (math.random() / 1000000)
                redis.call('ZADD', key, unique_score, unique_score)
                redis.call('EXPIRE', key, window_seconds + 10)
                return {1, remaining - 1, current_count + 1, window_seconds}
            else
                -- Tính thời gian reset dựa trên oldest entry
                local oldest_entries = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
                local reset_time = window_seconds
                if #oldest_entries > 0 then
                    local oldest_timestamp = tonumber(oldest_entries[2])
                    reset_time = math.max(0, oldest_timestamp + window_seconds - now)
                end
                return {0, 0, current_count, reset_time}
            end
        ";

        // Lua script để clear rate limit
        _clearRateLimitScript = @"
            local key = KEYS[1]
            return redis.call('DEL', key)
        ";

        // Prepare Lua scripts
        _clearRateLimitLua = LuaScript.Prepare(_clearRateLimitScript);
    }

    public async Task<bool> IsAllowedAsync(string key, int limit, TimeSpan window)
    {
        var result = await CheckRateLimitAsync(key, limit, window);
        return result.IsAllowed;
    }

    public async Task<RateLimitResult> CheckRateLimitAsync(string key, int limit, TimeSpan window)
    {
        try
        {
            var redisKey = $"{_options.KeyPrefix}:{key}";
            var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var windowStart = now - (long)window.TotalSeconds;

            // Sử dụng Lua script để đảm bảo atomic operations
            var result = await _database.ScriptEvaluateAsync(
                _checkRateLimitLua,
                new RedisKey[] { redisKey },
                new RedisValue[]
                {
                    windowStart,
                    now,
                    limit,
                    (int)window.TotalSeconds
                });

            var values = (RedisValue[])result;
            var isAllowed = values[0] == 1;
            var remaining = Math.Max(0, (int)values[1]);
            var totalRequests = (int)values[2];
            var resetSeconds = (double)values[3];

            return new RateLimitResult
            {
                IsAllowed = isAllowed,
                RemainingRequests = remaining,
                TotalRequests = totalRequests,
                RetryAfter = isAllowed ? null : TimeSpan.FromSeconds(resetSeconds),
                ResetTime = DateTimeOffset.FromUnixTimeSeconds(now + (long)resetSeconds).DateTime
            };
        }
        catch (RedisException ex)
        {
            _logger.LogError(ex, "Redis error checking rate limit for key: {Key}", key);
            return GetFallbackResult(limit, window);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error checking rate limit for key: {Key}", key);
            return GetFallbackResult(limit, window);
        }
    }

    public async Task<bool> ClearRateLimitAsync(string key)
    {
        try
        {
            var redisKey = $"{_options.KeyPrefix}:{key}";

            // Sử dụng IDistributedCache để remove
            await _cache.RemoveAsync(redisKey);

            // Hoặc sử dụng Lua script để clear sorted set
            var result = await _database.ScriptEvaluateAsync(
                _clearRateLimitLua,
                new RedisKey[] { redisKey });

            return (int)result >= 0; // DEL returns number of keys deleted
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing rate limit for key: {Key}", key);
            return false;
        }
    }

    public async Task<Dictionary<string, RateLimitResult>> GetRateLimitStatusAsync(
        IEnumerable<string> keys, int limit, TimeSpan window)
    {
        var results = new Dictionary<string, RateLimitResult>();

        try
        {
            // Check từng key một cách bất đồng bộ
            var tasks = keys.Select(async key =>
            {
                var result = await CheckRateLimitAsync(key, limit, window);
                return new { Key = key, Result = result };
            });

            var completedTasks = await Task.WhenAll(tasks);

            foreach (var task in completedTasks)
            {
                results[task.Key] = task.Result;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting rate limit status for multiple keys");
        }

        return results;
    }

    private RateLimitResult GetFallbackResult(int limit, TimeSpan window)
    {
        // Fallback: cho phép request khi có lỗi Redis
        _logger.LogWarning("Using fallback rate limit result due to Redis error");
        return new RateLimitResult
        {
            IsAllowed = true,
            RemainingRequests = limit - 1,
            TotalRequests = 1,
            RetryAfter = null,
            ResetTime = DateTime.UtcNow.Add(window)
        };
    }
}

