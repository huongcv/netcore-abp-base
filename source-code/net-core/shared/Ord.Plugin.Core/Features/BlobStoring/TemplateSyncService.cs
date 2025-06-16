using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using Ord.Plugin.Contract.Configurations;
using Volo.Abp.DependencyInjection;

public class TemplateSyncService : ITransientDependency
{
    private readonly IWebHostEnvironment _env;
    private readonly MinioClient _minioClient;
    private readonly string _bucketName;
    private readonly MinioOptions _options;
    private readonly ILogger<TemplateSyncService> _logger;
    public TemplateSyncService(IWebHostEnvironment env, MinioClient minIoClient,
        IOptions<MinioOptions> minioOptions, ILogger<TemplateSyncService> logger)
    {
        _env = env;
        _options = minioOptions.Value;
        _bucketName = minioOptions.Value.BucketName;
        _minioClient = minIoClient;
        _logger = logger;
    }
    public async Task SyncTemplatesToMinioAsync()
    {
        if (!_options.IsEnabled)
            return;
        string templateRoot = Path.Combine(_env.WebRootPath, "template");
        if (!Directory.Exists(templateRoot))
            throw new DirectoryNotFoundException($"Không tìm thấy thư mục: {templateRoot}");
        var allFiles = Directory.GetFiles(templateRoot, ".", SearchOption.AllDirectories);
        foreach (var filePath in allFiles)
        {
            var relativePath = Path.GetRelativePath(templateRoot, filePath).Replace("\\", "/"); // for S3
            await using var fileStream = File.OpenRead(filePath);
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(relativePath)
                .WithStreamData(fileStream)
                .WithObjectSize(fileStream.Length)
                .WithContentType("application/octet-stream");
            await _minioClient.PutObjectAsync(putObjectArgs);
            _logger.LogInformation($"Đã upload: {relativePath}");
        }
    }
}