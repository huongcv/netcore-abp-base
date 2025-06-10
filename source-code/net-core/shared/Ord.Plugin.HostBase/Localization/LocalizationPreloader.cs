using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Localization;
using System.Text.Json;

namespace Ord.Plugin.HostBase.Localization
{
    public class LocalizationPreloader : ILocalizationPreloader
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<LocalizationPreloader> _logger;
        private readonly string _resourcesPath;
        private static bool _isPreloaded = false;
        private static readonly object _lock = new object();

        public LocalizationPreloader(
            IWebHostEnvironment webHostEnvironment,
            ILogger<LocalizationPreloader> logger)
        {
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
            _resourcesPath = Path.Combine(_webHostEnvironment.WebRootPath, "i18n");
        }

        public bool IsPreloaded => _isPreloaded;

        public async Task PreloadAllLocalizationDataAsync()
        {
            if (_isPreloaded) return;

            await Task.Run(() => PreloadAllLocalizationData());
        }

        public void PreloadAllLocalizationData()
        {
            if (_isPreloaded) return;

            lock (_lock)
            {
                if (_isPreloaded) return;

                try
                {
                    var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                    _logger.LogInformation("Starting localization data preload...");

                    if (!Directory.Exists(_resourcesPath))
                    {
                        _logger.LogWarning("Localization directory not found: {Path}", _resourcesPath);
                        return;
                    }

                    var cultureDirs = Directory.GetDirectories(_resourcesPath);
                    var totalFiles = 0;

                    foreach (var cultureDir in cultureDirs)
                    {
                        var culture = Path.GetFileName(cultureDir);
                        var jsonFiles = Directory.GetFiles(cultureDir, "*.json");

                        foreach (var jsonFile in jsonFiles)
                        {
                            var module = Path.GetFileNameWithoutExtension(jsonFile);
                            PreloadModuleData(culture, module, jsonFile);
                            totalFiles++;
                        }
                    }

                    stopwatch.Stop();
                    _isPreloaded = true;

                    _logger.LogInformation(
                        "Localization preload completed. Loaded {FileCount} files in {ElapsedMs}ms",
                        totalFiles,
                        stopwatch.ElapsedMilliseconds);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during localization preload");
                    throw;
                }
            }
        }

        private void PreloadModuleData(string culture, string module, string filePath)
        {
            try
            {
                var cacheKey = $"{culture}_{module}";

                // Skip if already cached
                if (OrdLocalizer.HasCachedData(cacheKey))
                {
                    return;
                }

                var json = File.ReadAllText(filePath);
                var jsonResources = JsonSerializer.Deserialize<Dictionary<string, object>>(json);

                if (jsonResources != null)
                {
                    var flattenedResources = new Dictionary<string, string>();
                    FlattenJsonObject(jsonResources, flattenedResources);

                    // Add to cache
                    OrdLocalizer.AddToCache(cacheKey, flattenedResources);

                    _logger.LogDebug("Preloaded {Culture}/{Module} with {KeyCount} keys",
                        culture, module, flattenedResources.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error preloading {Culture}/{Module} from {FilePath}",
                    culture, module, filePath);
            }
        }

        private void FlattenJsonObject(Dictionary<string, object> source, Dictionary<string, string> target, string prefix = "")
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
