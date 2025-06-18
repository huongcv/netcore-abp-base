using Microsoft.AspNetCore.Hosting;
using Ord.Plugin.Contract.Features.BlobStoring;
using Volo.Abp.DependencyInjection;

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
        var fullPath = Path.Combine(_templateRootPath, templateRelativePath);

        if (!File.Exists(fullPath))
        {
            throw new FileNotFoundException($"Template not found at path: {fullPath}");
        }

        Stream stream = File.OpenRead(fullPath);
        return Task.FromResult(stream);
    }
}