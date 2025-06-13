using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Features.RateLimits;
using Ord.Plugin.Contract.Utils;
using System.Security.Claims;
using System.Text.Json;
using System.Text.RegularExpressions;
using Volo.Abp.Security.Claims;

namespace Ord.Plugin.Core.Features.RateLimits
{
    public class RateLimitMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IRateLimitStore _store;
        private readonly RateLimitOptions _options;
        private readonly ILogger<RateLimitMiddleware> _logger;
        private string _endpointHash;
        private readonly IAppFactory _appFactory;

        public RateLimitMiddleware(
            RequestDelegate next,
            IRateLimitStore store,
            RateLimitOptions options,
            ILogger<RateLimitMiddleware> logger,
            IAppFactory appFactory)
        {
            _next = next;
            _store = store;
            _options = options;
            _logger = logger;
            _appFactory = appFactory;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var options = _options;
            var endpoint = GetEndpoint(context);
            var whiteListEndpoints = options.EndpointWhitelist;
            if (whiteListEndpoints?.Any() == true)
            {
                foreach (var ruleWhiteList in whiteListEndpoints)
                {
                    if (IsEndpointMatch(endpoint, ruleWhiteList))
                    {
                        await _next(context);
                        return;
                    }
                }
            }

            _endpointHash = SecurityHelper.Sha256(endpoint);
            // 1. Kiểm tra IP Policy
            if (options.IpPolicy.Enabled)
            {
                var ipAddress = GetClientIpAddress(context);

                // Kiểm tra IP whitelist
                if (!options.IpPolicy.Whitelist.Contains(ipAddress))
                {
                    // Kiểm tra IP specific rules trước
                    if (options.IpPolicy.IpSpecificRules.TryGetValue(ipAddress, out var ipSpecificRules) &&
                        ipSpecificRules?.Any() == true)
                    {
                        foreach (var rule in ipSpecificRules)
                        {
                            if (IsEndpointMatch(endpoint, rule.Endpoint))
                            {
                                var ipResult = await CheckIpRateLimit(ipAddress, rule);
                                if (!ipResult.IsAllowed)
                                {
                                    await HandleRateLimitExceeded(context, ipResult, "IP", ipAddress);
                                    return;
                                }
                                AddRateLimitHeaders(context, ipResult, "IP");
                            }
                        }
                    }
                    // Nếu không có rule riêng, áp dụng global rules
                    else if (options.IpPolicy.GlobalRules?.Any() == true)
                    {
                        foreach (var rule in options.IpPolicy.GlobalRules)
                        {
                            if (IsEndpointMatch(endpoint, rule.Endpoint))
                            {
                                var ipResult = await CheckIpRateLimit(ipAddress, rule);
                                if (!ipResult.IsAllowed)
                                {
                                    await HandleRateLimitExceeded(context, ipResult, "IP", ipAddress);
                                    return;
                                }
                                AddRateLimitHeaders(context, ipResult, "IP");
                            }
                        }
                    }
                }
                else
                {
                    _logger.LogDebug("IP {IpAddress} is whitelisted, skipping rate limit", ipAddress);
                }
            }

            // 2. Kiểm tra User Policy
            if (options.UserPolicy.Enabled)
            {
                var userId = GetUserId(context);
                if (!string.IsNullOrEmpty(userId))
                {
                    if (options.UserPolicy.UserSpecificRules.TryGetValue(userId, out var userRules) &&
                        userRules?.Any() == true)
                    {
                        foreach (var rule in userRules)
                        {
                            if (IsEndpointMatch(endpoint, rule.Endpoint))
                            {
                                var userResult = await CheckUserRateLimit(userId, rule);
                                if (!userResult.IsAllowed)
                                {
                                    await HandleRateLimitExceeded(context, userResult, "User", userId);
                                    return;
                                }
                                AddRateLimitHeaders(context, userResult, "User");
                            }
                        }
                    }
                }
            }

            // 3. Kiểm tra Tenant Policy
            if (options.TenantPolicy.Enabled)
            {
                var tenantId = GetTenantId(context);
                if (!string.IsNullOrEmpty(tenantId))
                {
                    if (options.TenantPolicy.TenantSpecificRules.TryGetValue(tenantId, out var tenantRules) &&
                        tenantRules?.Any() == true)
                    {
                        foreach (var rule in tenantRules)
                        {
                            if (IsEndpointMatch(endpoint, rule.Endpoint))
                            {
                                var tenantResult = await CheckTenantRateLimit(tenantId, rule);
                                if (!tenantResult.IsAllowed)
                                {
                                    await HandleRateLimitExceeded(context, tenantResult, "Tenant", tenantId);
                                    return;
                                }
                                AddRateLimitHeaders(context, tenantResult, "Tenant");
                            }
                        }
                    }
                }
            }

            await _next(context);
        }

        private async Task<RateLimitResult> CheckIpRateLimit(string ipAddress, RateLimitRule rule)
        {
            var ipKey = ipAddress.Replace(":", "_");
            var key = $"ip:{ipKey}:{_endpointHash}:{rule.Period}";
            return await _store.CheckRateLimitAsync(key, rule.PermitLimit, rule.Window);
        }

        private async Task<RateLimitResult> CheckUserRateLimit(string userId, RateLimitRule rule)
        {
            var key = $"user:{userId}:{_endpointHash}:{rule.Period}";
            return await _store.CheckRateLimitAsync(key, rule.PermitLimit, rule.Window);
        }

        private async Task<RateLimitResult> CheckTenantRateLimit(string tenantId, RateLimitRule rule)
        {
            var key = $"tenant:{tenantId}:{_endpointHash}:{rule.Period}";
            return await _store.CheckRateLimitAsync(key, rule.PermitLimit, rule.Window);
        }

        private string GetEndpoint(HttpContext context)
        {
            var method = context.Request.Method;
            var path = context.Request.Path.Value ?? "";
            return path.Trim('/');
        }

        private bool IsEndpointMatch(string currentEndpoint, string ruleEndpoint)
        {
            if (string.IsNullOrEmpty(ruleEndpoint))
                return false;
            ruleEndpoint = ruleEndpoint.Trim();
            // Xử lý pattern "*" - match tất cả
            if (ruleEndpoint == "*")
                return true;

            // Xử lý pattern "**" - match tất cả (giống *)
            if (ruleEndpoint == "**")
                return true;
            if (ruleEndpoint.StartsWith("*") && ruleEndpoint.EndsWith("*") && ruleEndpoint.Length > 2)
            {
                var containsText = ruleEndpoint.Substring(1, ruleEndpoint.Length - 2);
                containsText = containsText.Trim('/');
                containsText = "/" + containsText + "/";
                return currentEndpoint.Contains(containsText, StringComparison.OrdinalIgnoreCase);
            }

            // Xử lý pattern "api/**" - match những endpoint bắt đầu với 'api'
            if (ruleEndpoint.EndsWith("/**"))
            {
                var prefix = ruleEndpoint.Substring(0, ruleEndpoint.Length - 3); // Bỏ "/**"
                return currentEndpoint.Contains($"/{prefix}/", StringComparison.OrdinalIgnoreCase) ||
                       currentEndpoint.Contains($":{prefix}/", StringComparison.OrdinalIgnoreCase);
            }

            // Xử lý pattern có "*" ở cuối
            if (ruleEndpoint.EndsWith("*"))
            {
                var prefix = ruleEndpoint.Substring(0, ruleEndpoint.Length - 1);
                return currentEndpoint.StartsWith(prefix, StringComparison.OrdinalIgnoreCase);
            }

            if (ruleEndpoint.StartsWith("*"))
            {
                var suffix = ruleEndpoint[1..].Trim('/');
                return currentEndpoint.EndsWith(suffix, StringComparison.OrdinalIgnoreCase);
            }
            if (ruleEndpoint.StartsWith("**"))
            {
                var suffix = ruleEndpoint[2..].Trim('/');
                return currentEndpoint.EndsWith(suffix, StringComparison.OrdinalIgnoreCase);
            }


            // Xử lý pattern có "*" ở giữa
            if (ruleEndpoint.Contains("*"))
            {
                var pattern = "^" + Regex.Escape(ruleEndpoint).Replace("\\*", ".*") + "$";
                return Regex.IsMatch(currentEndpoint, pattern, RegexOptions.IgnoreCase);
            }

            ruleEndpoint = ruleEndpoint.Trim('/');
            // Exact match
            return string.Equals(currentEndpoint, ruleEndpoint, StringComparison.OrdinalIgnoreCase);
        }

        private string GetClientIpAddress(HttpContext context)
        {
            // Kiểm tra các headers proxy phổ biến theo thứ tự ưu tiên
            var headers = new[]
            {
                "CF-Connecting-IP",     // Cloudflare
                "X-Forwarded-For",      // Standard proxy header
                "X-Real-IP",            // Nginx
                "X-Client-IP",          // Apache
                "X-Forwarded",          // Squid
                "Forwarded-For",        // RFC 7239
                "Forwarded"             // RFC 7239
            };

            foreach (var header in headers)
            {
                var value = context.Request.Headers[header].FirstOrDefault();
                if (!string.IsNullOrEmpty(value))
                {
                    // Lấy IP đầu tiên trong danh sách (trường hợp có nhiều proxy)
                    var ip = value.Split(',')[0].Trim();
                    if (IsValidIpAddress(ip))
                    {
                        return ip;
                    }
                }
            }

            return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        }

        private bool IsValidIpAddress(string ip)
        {
            return System.Net.IPAddress.TryParse(ip, out var address) &&
                   !address.Equals(System.Net.IPAddress.None);
        }

        private string? GetUserId(HttpContext context)
        {
            // Lấy userId từ JWT token claims theo thứ tự ưu tiên
            var claims = new[]
            {
                "sub",                      // Subject (standard JWT claim)
                "userId",                   // Custom user ID claim
                "user_id",                  // Alternative user ID claim
                "id",                       // Simple ID claim
                "nameidentifier",           // ASP.NET Identity claim
                ClaimTypes.NameIdentifier   // Standard .NET claim
            };

            foreach (var claim in claims)
            {
                var value = context.User?.FindFirst(claim)?.Value;
                if (!string.IsNullOrEmpty(value))
                {
                    return value;
                }
            }

            return "anonymous";
        }

        private string? GetTenantId(HttpContext context)
        {
            // Lấy tenantId từ các nguồn khác nhau

            // 1. Từ JWT claims
            var tenantClaims = new[] { AbpClaimTypes.TenantId, "tenantId", "tenant_id", "tid", "organization", "org" };
            foreach (var claim in tenantClaims)
            {
                var value = context.User?.FindFirst(claim)?.Value;
                if (!string.IsNullOrEmpty(value))
                {
                    return value;
                }
            }

            // 2. Từ headers
            var tenantHeaders = new[] { "X-Tenant-ID", "X-Organization-ID", "Tenant-ID" };
            foreach (var header in tenantHeaders)
            {
                var value = context.Request.Headers[header].FirstOrDefault();
                if (!string.IsNullOrEmpty(value))
                {
                    return value;
                }
            }

            // 3. Từ query parameters
            var tenantFromQuery = context.Request.Query["tenantId"].FirstOrDefault() ??
                                 context.Request.Query["tenant"].FirstOrDefault();
            if (!string.IsNullOrEmpty(tenantFromQuery))
            {
                return tenantFromQuery;
            }

            // 4. Từ route values
            if (context.Request.RouteValues.TryGetValue("tenantId", out var tenantFromRoute))
            {
                return tenantFromRoute?.ToString();
            }

            return "host";
        }

        private void AddRateLimitHeaders(HttpContext context, RateLimitResult result, string policy)
        {
            var headers = context.Response.Headers;

            //headers.Add($"X-RateLimit-{policy}-Limit", result.TotalRequests.ToString());
            //headers.Add($"X-RateLimit-{policy}-Remaining", result.RemainingRequests.ToString());
            //headers.Add($"X-RateLimit-{policy}-Reset", result.ResetTime.ToString("O"));

            //if (result.RetryAfter.HasValue)
            //{
            //    headers.Add($"X-RateLimit-{policy}-Retry-After",
            //        ((int)result.RetryAfter.Value.TotalSeconds).ToString());
            //}
        }

        private async Task HandleRateLimitExceeded(HttpContext context, RateLimitResult result,
            string policy, string identifier)
        {
            context.Response.StatusCode = 429;
            context.Response.ContentType = "application/json";

            if (result.RetryAfter.HasValue)
            {
                context.Response.Headers.Add("Retry-After",
                    ((int)result.RetryAfter.Value.TotalSeconds).ToString() + "s");
            }

            var identifierInfor = _appFactory.GetLocalizedMessage("message.RateLimit.PolicyName." + policy);
            identifierInfor = identifierInfor + ": (" + identifier + ")";
            var response = new CommonResultDto<object>()
            {
                Code = "429",
                Message = _appFactory.GetLocalizedMessage("message.RateLimit.RateLimitExceeded"),
                Extend = new
                {
                    message = _appFactory.GetLocalizedMessage("message.RateLimit.RateLimitExceededDetail", identifierInfor),
                    policy = policy.ToLower(),
                    identifier = identifier,
                    totalRequests = result.TotalRequests
                }
            };
            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);

            _logger.LogWarning("Rate limit exceeded for {Policy}: {Identifier}. Total requests: {Total}, Reset time: {ResetTime}",
                policy, identifier, result.TotalRequests, result.ResetTime);
        }
    }
}