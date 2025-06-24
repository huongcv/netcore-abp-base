using Microsoft.AspNetCore.Http;
using Ord.Domain.Enums;
using Ord.Plugin.Contract.Dtos.Auth;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Utils;

namespace Ord.Plugin.Core.Factories.Extensions
{
    public static class AppFactoryHttpContextUtil
    {
        public static ClientInformation GetClientInformation(this IAppFactory factory)
        {
            var context = factory.HttpContextAccessor()?.HttpContext;
            if (context == null)
                return new ClientInformation();

            var ipAddress = GetClientIpAddress(factory);
            var userAgent = context.Request.Headers["User-Agent"].FirstOrDefault();

            return new ClientInformation
            {
                IpAddress = ipAddress,
                UserAgent = userAgent
            };
        }
        public static string? GetClientIpAddress(this IAppFactory factory)
        {
            // Kiểm tra các header proxy phổ biến
            var context = factory.HttpContextAccessor()?.HttpContext;
            var ipAddress = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(ipAddress))
            {
                return ipAddress.Split(',')[0].Trim();
            }

            ipAddress = context.Request.Headers["X-Real-IP"].FirstOrDefault();
            if (!string.IsNullOrEmpty(ipAddress))
            {
                return ipAddress;
            }

            return context.Connection.RemoteIpAddress?.ToString();
        }
        public static string DetectPlatform(this IAppFactory factory)
        {
            var context = factory.HttpContextAccessor()?.HttpContext;
            if (context == null)
                return TokenPlatform.Api;

            // Lấy User Agent
            var userAgent = context.Request.Headers["User-Agent"].FirstOrDefault();
            if (string.IsNullOrEmpty(userAgent))
                return TokenPlatform.Api;

            // Kiểm tra custom headers từ mobile app
            var customPlatform = context.Request.Headers["X-Platform"].FirstOrDefault();
            if (!string.IsNullOrEmpty(customPlatform))
            {
                return customPlatform.ToLower() switch
                {
                    "ios" => TokenPlatform.Mobile,
                    "android" => TokenPlatform.Mobile,
                    "mobile" => TokenPlatform.Mobile,
                    "desktop" => TokenPlatform.Desktop,
                    "web" => TokenPlatform.Web,
                    _ => TokenPlatform.Api
                };
            }

            // Detect từ User Agent
            return factory.DetectPlatformFromUserAgent(userAgent);
        }
        public static string DetectPlatformFromUserAgent(this IAppFactory factory, string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent))
                return TokenPlatform.Api;

            userAgent = userAgent.ToLowerInvariant();

            // Mobile Apps (React Native, Flutter, Native Apps)
            if (UserAgentUtil.IsMobileApp(userAgent))
                return TokenPlatform.Mobile;

            // Desktop Applications (Electron, Native Desktop Apps)
            if (UserAgentUtil.IsDesktopApp(userAgent))
                return TokenPlatform.Desktop;

            // Mobile Web Browsers
            if (UserAgentUtil.IsMobileWebBrowser(userAgent))
                return TokenPlatform.Mobile;

            // Desktop Web Browsers
            if (UserAgentUtil.IsDesktopWebBrowser(userAgent))
                return TokenPlatform.Web;

            // API calls (Postman, curl, HTTPClient, etc.)
            if (UserAgentUtil.IsApiClient(userAgent))
                return TokenPlatform.Api;

            // Default fallback
            return TokenPlatform.Web;
        }

    }
}
