using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Metrics;

namespace Ord.Plugin.HostBase.Configurations
{
    public static class HealthCheckConfiguration
    {
        public static void AddHealthCheckOpenTelemetry(this IServiceCollection services, IConfiguration configuration)
        {
            if (configuration.TryParseBoolValue("Prometheus:IsEnabled") != true)
            {
                return;
            }
            services.AddOpenTelemetry()
                .WithMetrics(builder =>
                {
                    builder
                        // Add built-in ASP.NET Core metrics
                        .AddMeter("Microsoft.AspNetCore.Hosting")
                        .AddMeter("Microsoft.AspNetCore.Server.Kestrel")
                        .AddMeter("System.Net.Http")
                        // Add custom ABP metrics
                        //.AddMeter("Ord.Plugin.ABP")
                        // Add Prometheus exporter
                        .AddPrometheusExporter();

                    // Configure histogram buckets for request duration
                    builder.AddView("http.server.request.duration",
                        new ExplicitBucketHistogramConfiguration
                        {
                            Boundaries = new double[]
                                { 0, 0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10 }
                        });
                });
        }
    }
}
