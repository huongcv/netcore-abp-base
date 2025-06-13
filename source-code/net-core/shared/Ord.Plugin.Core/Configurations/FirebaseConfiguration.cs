using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Core.Features.Notifications.Channels;
using Ord.Plugin.Core.Features.Notifications.Firebases;

namespace Ord.Plugin.Core.Configurations;

public static class FirebaseConfiguration
{
    public static void AddFirebaseServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure Firebase
        services.Configure<FirebaseNotificationConfiguration>(configuration.GetSection(FirebaseNotificationConfiguration.SectionName));
        // Register notification channel
        services.AddTransient<FirebaseNotificationChannel>();
        // Initialize Firebase on startup
        services.AddHostedService<FirebaseInitializationService>();
    }
}