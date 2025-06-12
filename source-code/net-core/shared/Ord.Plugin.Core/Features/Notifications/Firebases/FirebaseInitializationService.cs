using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ord.Plugin.Core.Features.Notifications.Firebases
{
    public class FirebaseInitializationService : IHostedService
    {
        private readonly IFirebaseMessagingService _firebaseService;
        private readonly ILogger<FirebaseInitializationService> _logger;

        public FirebaseInitializationService(
            IFirebaseMessagingService firebaseService,
            ILogger<FirebaseInitializationService> logger)
        {
            _firebaseService = firebaseService;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                await _firebaseService.InitializeAsync();
                _logger.LogInformation("Firebase initialization service started successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize Firebase on startup");
                // Don't throw - let the application start even if Firebase fails
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
