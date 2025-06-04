using Microsoft.Extensions.Logging;
using Serilog;

namespace Ord.Plugin.Core.Logging
{
    public static class LoggingUtil
    {
        public const string OutputTemplate = "[{Timestamp:yyyy-MM-dd HH:mm:ss fff}] [{Level:u3}] [{SourceContext:l}] {CorrelationId} {UserId} {Message:lj}{NewLine}{Exception}";
        public static ILoggerFactory SqlQueryLogging()
        {
            var logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Async(c => c.File("Logs/Sql/sql_.log", shared: true,
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: OutputTemplate))
#if DEBUG
                .WriteTo.Async(c => c.Console())
#endif

                .CreateLogger();
            return new LoggerFactory().AddSerilog(logger);
        }

        public static ILoggerFactory SqlKataQueryCompiled()
        {
            var logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Async(c => c.File("Logs/SqlKata/sql_kata_.log", shared: true,
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: OutputTemplate))
#if DEBUG
                .WriteTo.Async(c => c.Console())
#endif
                .CreateLogger();
            return new LoggerFactory().AddSerilog(logger);
        }
    }
}
