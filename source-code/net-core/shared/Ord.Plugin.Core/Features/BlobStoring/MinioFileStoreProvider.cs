using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Features.BlobStoring;
using Volo.Abp.BlobStoring;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Features.BlobStoring
{
    public class MinioFileStoreProvider : IFileStoreProvider, ITransientDependency
    {
        private readonly MinioClient _minioClient;
        private readonly string _bucketName;

        public MinioFileStoreProvider(MinioClient minioClient, 
            IOptions<MinioOptions> options)
        {
            _minioClient = minioClient;
            _bucketName = options.Value.BucketName;
        }

        public async Task<Stream> GetStreamAsync(string templatePath)
        {
            var stream = new MemoryStream();

            await _minioClient.GetObjectAsync(new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(templatePath)
                .WithCallbackStream(s => s.CopyTo(stream)));

            stream.Position = 0;
            return stream;
        }

        public async Task SaveAsync(string templatePath, Stream blobStream, bool overrideExisting)
        {
            var containerName = _bucketName;
            await CreateBucketIfNotExists(containerName);
            if (!overrideExisting && await BlobExistsAsync(containerName, templatePath))
            {
                throw new BlobAlreadyExistsException($"Saving BLOB '{templatePath}' does already exists in the container.");
            }
            await _minioClient.PutObjectAsync(new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(templatePath)
                .WithStreamData(blobStream)
                .WithObjectSize(blobStream.Length));
        }
        public async Task<bool> DeleteAsync(string templatePath)
        {
            var containerName = _bucketName;
            if (!await BlobExistsAsync(containerName, templatePath))
            {
                return false;
            }
            await _minioClient.RemoveObjectAsync(new RemoveObjectArgs().WithBucket(containerName).WithObject(templatePath));
            return true;
        }

        protected virtual async Task<bool> BlobExistsAsync(string containerName, string blobName)
        {
            // Make sure Blob Container exists.
            if (await _minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(containerName)))
            {
                try
                {
                    await _minioClient.StatObjectAsync(new StatObjectArgs().WithBucket(containerName).WithObject(blobName));
                }
                catch (Exception e)
                {
                    if (e is ObjectNotFoundException)
                    {
                        return false;
                    }

                    throw;
                }

                return true;
            }

            return false;
        }
        protected virtual async Task CreateBucketIfNotExists(string containerName)
        {
            if (!await _minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(containerName)))
            {
                await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(containerName));
            }
        }

    }
}
