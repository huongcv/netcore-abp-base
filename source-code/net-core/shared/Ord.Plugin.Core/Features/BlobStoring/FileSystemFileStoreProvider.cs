using Microsoft.AspNetCore.Hosting;
using Ord.Plugin.Contract.Features.BlobStoring;
using Polly;
using Volo.Abp.BlobStoring;
using Volo.Abp.DependencyInjection;
using Volo.Abp.IO;
public class FileSystemFileStoreProvider : IFileStoreProvider, ITransientDependency
{
    private readonly string _templateRootPath;

    public FileSystemFileStoreProvider(IWebHostEnvironment env)
    {
        // Gốc là: wwwroot/template
        _templateRootPath = Path.Combine("Contents");
    }

    public Task<Stream> GetStreamAsync(string templateRelativePath)
    {
        return GetOrNullAsync(templateRelativePath);
    }

    public async Task SaveAsync(string templateRelativePath, Stream blobStream, bool overrideExisting)
    {
        var filePath = FilePathCalculator(templateRelativePath);

        if (!overrideExisting && await ExistsAsync(filePath))
        {
            throw new BlobAlreadyExistsException($"Saving BLOB  does already exists in the container.");
        }

        DirectoryHelper.CreateIfNotExists(Path.GetDirectoryName(filePath)!);

        var fileMode = overrideExisting
            ? FileMode.Create
            : FileMode.CreateNew;

        await Policy.Handle<IOException>()
            .WaitAndRetryAsync(2, retryCount => TimeSpan.FromSeconds(retryCount))
            .ExecuteAsync(async () =>
            {
                await using var fileStream = File.Open(filePath, fileMode, FileAccess.Write);
                await blobStream.CopyToAsync(fileStream);
                await fileStream.FlushAsync();
            });
    }

    public Task<bool> DeleteAsync(string templatePath)
    {
        return Task.FromResult(FileHelper.DeleteIfExists(templatePath));
    }
    public Task<bool> ExistsAsync(string templateRelativePath)
    {
        var filePath = FilePathCalculator(templateRelativePath);
        return Task.FromResult(File.Exists(filePath));
    }

    public async Task<Stream?> GetOrNullAsync(string templateRelativePath)
    {
        var filePath = FilePathCalculator(templateRelativePath);
        if (!File.Exists(filePath))
        {
            return null;
        }

        return await Policy.Handle<IOException>()
            .WaitAndRetryAsync(2, retryCount => TimeSpan.FromSeconds(retryCount))
            .ExecuteAsync(() => Task.FromResult(File.OpenRead(filePath)));
    }
    private string FilePathCalculator(string templateRelativePath)
    {
        return Path.Combine(_templateRootPath, templateRelativePath);
    }
}