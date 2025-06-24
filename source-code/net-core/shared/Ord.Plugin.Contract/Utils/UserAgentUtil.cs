using System.Text.RegularExpressions;

namespace Ord.Plugin.Contract.Utils
{
    public static class UserAgentUtil
    {
        public static string GetDeviceNameFromUserAgent(string? userAgent)
        {
            if (string.IsNullOrEmpty(userAgent))
                return "Unknown Device";

            userAgent = userAgent.ToLower();

            // Detect mobile devices
            if (userAgent.Contains("mobile") || userAgent.Contains("android") || userAgent.Contains("iphone"))
            {
                if (userAgent.Contains("android"))
                    return "Android Device";
                if (userAgent.Contains("iphone"))
                    return "iPhone";
                return "Mobile Device";
            }

            // Detect browsers
            if (userAgent.Contains("chrome"))
                return "Chrome Browser";
            if (userAgent.Contains("firefox"))
                return "Firefox Browser";
            if (userAgent.Contains("safari"))
                return "Safari Browser";
            if (userAgent.Contains("edge"))
                return "Edge Browser";

            return "Web Browser";
        }

        public static bool IsMobileApp(string userAgent)
        {
            // React Native
            if (userAgent.Contains("react-native"))
                return true;

            // Flutter
            if (userAgent.Contains("flutter"))
                return true;

            // Custom mobile app identifiers
            var mobileAppPatterns = new[]
            {
                @"myapp[\s/]",           // Custom app name pattern
                @"ordapp[\s/]",          // Your specific app
                @"mobile[\s/]app",       // Generic mobile app
                @"android.*app",         // Android app
                @"ios.*app",             // iOS app
                @"cfnetwork",            // iOS native networking
                @"alamofire",            // iOS networking library
                @"okhttp",               // Android networking library
            };

            return mobileAppPatterns.Any(pattern =>
                Regex.IsMatch(userAgent, pattern, RegexOptions.IgnoreCase));
        }

        public static bool IsDesktopApp(string userAgent)
        {
            var desktopAppPatterns = new[]
            {
                @"electron",             // Electron apps
                @"nwjs",                 // NW.js apps
                @"tauri",                // Tauri apps
                @"desktop.*app",         // Generic desktop app
                @"win32.*app",           // Windows desktop app
                @"macos.*app",           // macOS desktop app
                @"linux.*app",           // Linux desktop app
            };

            return desktopAppPatterns.Any(pattern =>
                Regex.IsMatch(userAgent, pattern, RegexOptions.IgnoreCase));
        }

        public static bool IsMobileWebBrowser(string userAgent)
        {
            var mobilePatterns = new[]
            {
                @"mobile",
                @"android",
                @"iphone",
                @"ipod",
                @"ipad",
                @"blackberry",
                @"windows phone",
                @"webos",
                @"opera mini",
                @"palm",
                @"symbian"
            };

            return mobilePatterns.Any(pattern =>
                userAgent.Contains(pattern, StringComparison.OrdinalIgnoreCase));
        }

        public static bool IsDesktopWebBrowser(string userAgent)
        {
            var browserPatterns = new[]
            {
                @"mozilla",
                @"chrome",
                @"firefox",
                @"safari",
                @"edge",
                @"opera"
            };

            // Phải có browser pattern và không phải mobile
            return browserPatterns.Any(pattern =>
                userAgent.Contains(pattern, StringComparison.OrdinalIgnoreCase))
                && !IsMobileWebBrowser(userAgent);
        }

        public static bool IsApiClient(string userAgent)
        {
            var apiClientPatterns = new[]
            {
                @"postman",
                @"insomnia",
                @"curl",
                @"wget",
                @"httpclient",
                @"restsharp",
                @"axios",
                @"fetch",
                @"python-requests",
                @"java",
                @"go-http-client",
                @"ruby",
                @"php",
                @"node",
                @"python",
                @"bot",
                @"crawler",
                @"spider"
            };

            return apiClientPatterns.Any(pattern =>
                userAgent.Contains(pattern, StringComparison.OrdinalIgnoreCase));
        }
    }
}
