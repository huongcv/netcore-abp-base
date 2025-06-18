using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Minio;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Core.Features.BlobStoring;

namespace Ord.Plugin.HostBase.Configurations
{
    public static class BlobStoringConfiguration
    {
        public static void AddBlobStoring(this IServiceCollection services, IConfiguration configuration)
        {
            AddMinIo(services, configuration);
        }

        private static void AddMinIo(IServiceCollection services, IConfiguration configuration)
        {
            // Đăng ký cấu hình với validation
            services.Configure<MinioOptions>(options =>
            {
                configuration.GetSection("BlobStoring:Minio").Bind(options);
            });

            // Đăng ký MinioClient với singleton pattern
            services.AddSingleton<MinioClient>(serviceProvider =>
            {
                var options = serviceProvider.GetRequiredService<IOptions<MinioOptions>>().Value;

                if (!options.IsEnabled)
                {
                    throw new InvalidOperationException("Minio is not enabled in configuration");
                }

                // Validation cấu hình
                ValidateMinioOptions(options);
                var clientBuilder = new MinioClient()
                    .WithEndpoint(options.EndPoint)
                    .WithCredentials(options.AccessKey, options.SecretKey)
                    .WithTimeout(options.TimeoutInSeconds * 1000);
                return (MinioClient)clientBuilder.Build();
            });
        }

        private static void ValidateMinioOptions(MinioOptions options)
        {
            if (string.IsNullOrWhiteSpace(options.EndPoint))
                throw new ArgumentException("Minio EndPoint is required", nameof(options.EndPoint));

            if (string.IsNullOrWhiteSpace(options.AccessKey))
                throw new ArgumentException("Minio AccessKey is required", nameof(options.AccessKey));

            if (string.IsNullOrWhiteSpace(options.SecretKey))
                throw new ArgumentException("Minio SecretKey is required", nameof(options.SecretKey));

            if (string.IsNullOrWhiteSpace(options.BucketName))
                throw new ArgumentException("Minio BucketName is required", nameof(options.BucketName));
        }
    }
}
