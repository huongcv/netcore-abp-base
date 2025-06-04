using Ord.PluginZero.HttpHost;
using Serilog;
using Serilog.Events;

namespace Ord.PluginDev.HttpHost;

public class Program
{
    public async static Task<int> Main(string[] args)
    {
        var outputTemplate = "[{Timestamp:yyyy-MM-dd HH:mm:ss fff}] [{Level:u3}] [{SourceContext:l}] {CorrelationId} {UserId} {Message:lj}{NewLine}{Exception}";
        var logConfig = new LoggerConfiguration()
#if DEBUG
            .MinimumLevel.Debug()
#else
            .MinimumLevel.Information()
#endif
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("ApplicationName", "CorePos")
            .WriteTo.Async(c => c.File("Logs/.log", shared: true,
                rollingInterval: RollingInterval.Day,
                outputTemplate: outputTemplate))
            .WriteTo.Async(c => c.File("Logs/Error/.log", shared: true,
                rollingInterval: RollingInterval.Day,
                outputTemplate: outputTemplate,
                restrictedToMinimumLevel: LogEventLevel.Error))
            .WriteTo.Async(c => c.Console());
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
        if (!string.IsNullOrEmpty(configuration["Logging:Seq:IsEnabled"]) && Boolean.Parse(configuration["Logging:Seq:IsEnabled"]))
        {
            logConfig.WriteTo.Async(c => c.Seq(
                configuration["Logging:Seq:Url"],
                restrictedToMinimumLevel: LogEventLevel.Error));
        }

        Log.Logger = logConfig.CreateLogger();

        try
        {
            Log.Information("Starting web host.");
            var builder = WebApplication.CreateBuilder(args);
            builder.Host.AddAppSettingsSecretsJson()
                .UseAutofac()
                .UseSerilog();
            await builder.AddApplicationAsync<OrdPosHttpHostModule>(options =>
            {
                //if (Directory.Exists(Path.GetFullPath("plugins/lib3rd")))
                //{
                //    options.PlugInSources.AddFolder(Path.GetFullPath("plugins/lib3rd"));
                //}
                //options.PlugInSources.AddFolder(System.IO.Path.GetFullPath("plugins/ord"));
                //string[] allFolderPlugin = Directory.GetDirectories(System.IO.Path.GetFullPath("plugins/ord"), "*", SearchOption.AllDirectories);
                //if (allFolderPlugin != null && allFolderPlugin.Length > 0)
                //{
                //    foreach (var folderPlugin in allFolderPlugin)
                //    {
                //        options.PlugInSources.AddFolder(folderPlugin);

                //    }
                //}
                // options.PlugInSources.AddFolder(System.IO.Path.GetFullPath("plugins/ord/auth"));
                //  options.PlugInSources.AddFolder(System.IO.Path.GetFullPath("plugins/ord/master-data"));

            });
            var app = builder.Build();
            await app.InitializeApplicationAsync();
            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            if (ex is HostAbortedException)
            {
                throw;
            }

            Log.Fatal(ex, "Host terminated unexpectedly!");
            return 1;
        }
        finally
        {
            await Log.CloseAndFlushAsync();
        }
    }
}