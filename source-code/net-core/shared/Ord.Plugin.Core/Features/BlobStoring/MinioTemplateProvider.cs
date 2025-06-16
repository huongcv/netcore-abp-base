using Minio;
using Minio.DataModel.Args;
using Ord.Plugin.Contract.Features.BlobStoring;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Features.BlobStoring
{
    public class MinioTemplateProvider : ITemplateProvider, ITransientDependency
    {
        private readonly MinioClient _minioClient;
        private readonly string _bucketName;

        public MinioTemplateProvider(MinioClient minioClient, string bucketName)
        {
            _minioClient = minioClient;
            _bucketName = bucketName;
        }

        public async Task<Stream> GetTemplateStreamAsync(string templatePath)
        {
            var stream = new MemoryStream();

            await _minioClient.GetObjectAsync(new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(templatePath)
                .WithCallbackStream(s => s.CopyTo(stream)));

            stream.Position = 0;
            return stream;
        }
    }
}
