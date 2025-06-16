using Microsoft.AspNetCore.Hosting;
using Ord.Plugin.Contract.Features.BlobStoring;

public class FileSystemTemplateProvider : ITemplateProvider
{
    private readonly string _templateRootPath;

    public FileSystemTemplateProvider(IWebHostEnvironment env)
    {
        // Gốc là: wwwroot/template
        _templateRootPath = Path.Combine(env.WebRootPath, "template");
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