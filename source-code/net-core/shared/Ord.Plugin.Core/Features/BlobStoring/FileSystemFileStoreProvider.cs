using Microsoft.AspNetCore.Hosting;
using Ord.Plugin.Contract.Features.BlobStoring;
using Polly;
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
        var filePath = FilePathCalculator(templateRelativePath);

        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException($"Template not found at path: {filePath}");
        }

        Stream stream = File.OpenRead(filePath);
        return Task.FromResult(stream);
    }

    public Task SaveAsync(string templatePath, Stream blobStream, bool overrideExisting)
    {
        throw new NotImplementedException();
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

        if (!File.Exists(templateRelativePath))
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