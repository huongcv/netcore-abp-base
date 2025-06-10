using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Localization;
using System.Collections.Concurrent;
using System.Globalization;
using System.Text.Json;

namespace Ord.Plugin.HostBase.Localization
{
    public class OrdLocalizer : IOrdLocalizer
    {
        private readonly ILogger<OrdLocalizer> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly string _resourcesPath;
        private static readonly ConcurrentDictionary<string, Dictionary<string, string>> _cache = new();
        private readonly object _lock = new object();

        public OrdLocalizer(ILogger<OrdLocalizer> logger, IWebHostEnvironment webHostEnvironment)
        {
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
            _resourcesPath = Path.Combine(_webHostEnvironment.WebRootPath, "i18n");
        }

        // Static methods để hỗ trợ preloader
        public static bool HasCachedData(string cacheKey)
        {
            return _cache.ContainsKey(cacheKey);
        }

        public static void AddToCache(string cacheKey, Dictionary<string, string> resources)
        {
            _cache.TryAdd(cacheKey, resources);
        }

        public static void ClearCache()
        {
            _cache.Clear();
        }

        public static int CacheCount => _cache.Count;

        // Các methods khác giữ nguyên như cũ...
        public string this[string key] => GetLocalizedString(key);
        public string this[string key, params object[] arguments] => GetLocalizedString(key, arguments);

        public string GetString(string module, string key)
        {
            return GetLocalizedString($"{module}.{key}");
        }

        public string GetString(string module, string key, params object[] arguments)
        {
            return GetLocalizedString($"{module}.{key}", arguments);
        }

        public Dictionary<string, string> GetAllStrings(string module)
        {
            var culture = CultureInfo.CurrentUICulture.Name;
            var moduleResources = GetModuleResources(culture, module);
            return new Dictionary<string, string>(moduleResources);
        }

        public bool Exists(string key)
        {
            var culture = CultureInfo.CurrentUICulture.Name;
            var (module, actualKey) = ParseKey(key);
            var resources = GetModuleResources(culture, module);
            return resources.ContainsKey(actualKey);
        }

        public bool Exists(string module, string key)
        {
            var culture = CultureInfo.CurrentUICulture.Name;
            var resources = GetModuleResources(culture, module);
            return resources.ContainsKey(key);
        }

        private string GetLocalizedString(string key, params object[] arguments)
        {
            var culture = CultureInfo.CurrentUICulture.Name;
            var (module, actualKey) = ParseKey(key);
            var resources = GetModuleResources(culture, module);

            if (resources.TryGetValue(actualKey, out var value))
            {
                if (arguments?.Length > 0)
                {
                    try
                    {
                        value = string.Format(value, arguments);
                    }
                    catch (FormatException ex)
                    {
                        _logger.LogWarning(ex, "Error formatting localized string '{Key}' for culture '{Culture}'", key,
                            culture);
                        return key;
                    }
                }

                return value;
            }

            _logger.LogWarning("Localization key '{Key}' not found for culture '{Culture}' in module '{Module}'",
                actualKey, culture, module);
            return key;
        }

        private (string module, string key) ParseKey(string fullKey)
        {
            var parts = fullKey.Split('.', 2);
            if (parts.Length == 2)
            {
                return (parts[0], parts[1]);
            }

            return ("common", fullKey);
        }

        private Dictionary<string, string> GetModuleResources(string culture, string module)
        {
            var cacheKey = $"{culture}_{module}";

            if (_cache.TryGetValue(cacheKey, out var cachedResources))
            {
                return cachedResources;
            }

            // Nếu chưa có trong cache, load từ file (fallback)
            lock (_lock)
            {
                if (_cache.TryGetValue(cacheKey, out cachedResources))
                {
                    return cachedResources;
                }

                var resources = LoadModuleResources(culture, module);
                _cache.TryAdd(cacheKey, resources);
                return resources;
            }
        }

        private Dictionary<string, string> LoadModuleResources(string culture, string module)
        {
            var resources = new Dictionary<string, string>();
            var culturesToTry = GetCultureFallbackChain(culture);

            foreach (var cultureCode in culturesToTry)
            {
                var filePath = Path.Combine(_resourcesPath, cultureCode, $"{module.ToLowerInvariant()}.json");

                if (File.Exists(filePath))
                {
                    try
                    {
                        var json = File.ReadAllText(filePath);
                        var jsonResources = JsonSerializer.Deserialize<Dictionary<string, object>>(json);

                        if (jsonResources != null)
                        {
                            FlattenJsonObject(jsonResources, resources);
                            break;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error loading localization file: {FilePath}", filePath);
                    }
                }
            }

            return resources;
        }

        private string[] GetCultureFallbackChain(string culture)
        {
            var cultures = new List<string> { culture };

            if (culture.Contains('-'))
            {
                cultures.Add(culture.Split('-')[0]);
            }

            if (!cultures.Contains("vi"))
            {
                cultures.Add("vi");
            }

            if (!cultures.Contains("en"))
            {
                cultures.Add("en");
            }

            return cultures.ToArray();
        }

        private void FlattenJsonObject(Dictionary<string, object> source, Dictionary<string, string> target,
            string prefix = "")
        {
            foreach (var item in source)
            {
                var key = string.IsNullOrEmpty(prefix) ? item.Key : $"{prefix}.{item.Key}";

                if (item.Value is JsonElement element)
                {
                    if (element.ValueKind == JsonValueKind.Object)
                    {
                        var nestedDict = JsonSerializer.Deserialize<Dictionary<string, object>>(element.GetRawText());
                        if (nestedDict != null)
                        {
                            FlattenJsonObject(nestedDict, target, key);
                        }
                    }
                    else
                    {
                        target[key] = element.GetString() ?? string.Empty;
                    }
                }
                else if (item.Value is Dictionary<string, object> nestedObject)
                {
                    FlattenJsonObject(nestedObject, target, key);
                }
                else
                {
                    target[key] = item.Value?.ToString() ?? string.Empty;
                }
            }
        }
    }
}
