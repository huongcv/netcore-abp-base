using Microsoft.AspNetCore.Hosting;
using Ord.Plugin.Contract.Features.BlobStoring;
using Volo.Abp.DependencyInjection;

public class FileSystemTemplateProvider : ITemplateProvider, ITransientDependency
{
    private readonly string _templateRootPath;

    public FileSystemTemplateProvider(IWebHostEnvironment env)
    {
        // Gốc là: wwwroot/template
        _templateRootPath = Path.Combine("Contents");
    }

    public Task<Stream> GetTemplateStreamAsync(string templateRelativePath)
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