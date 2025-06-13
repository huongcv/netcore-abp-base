using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Metrics;

namespace Ord.Plugin.HostBase.Configurations
{
    public static class HealthCheckConfiguration
    {
        public static void AddHealthCheckOpenTelemetry(this IServiceCollection services, IConfiguration configuration)
        {
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
                            Boundaries = new double[] { 0, 0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10 }
                        });

                    // Configure histogram buckets for ABP request duration
                    builder.AddView("abp.request.duration",
                        new ExplicitBucketHistogramConfiguration
                        {
                            Boundaries = new double[] { 0, 1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000 }
                        });

                    // Configure histogram buckets for database query duration
                    builder.AddView("abp.database.query.duration",
                        new ExplicitBucketHistogramConfiguration
                        {
                            Boundaries = new double[] { 0, 0.1, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000 }
                        });
                });
        }
    }
}
