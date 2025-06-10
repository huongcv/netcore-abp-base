using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Localization;

namespace Ord.Plugin.HostBase.Localization
{
    public class LocalizationPreloadHostedService : IHostedService
    {
        private readonly ILocalizationPreloader _preloader;
        private readonly ILogger<LocalizationPreloadHostedService> _logger;

        public LocalizationPreloadHostedService(
            ILocalizationPreloader preloader,
            ILogger<LocalizationPreloadHostedService> logger)
        {
            _preloader = preloader;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Starting localization preload service...");
                await _preloader.PreloadAllLocalizationDataAsync();
                _logger.LogInformation("Localization preload service started successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to start localization preload service");
                // Không throw exception để không crash app
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Localization preload service stopped");
            return Task.CompletedTask;
        }
    }
}
