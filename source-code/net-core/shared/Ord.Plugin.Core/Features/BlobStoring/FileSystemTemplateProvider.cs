using Ord.Plugin.Contract.Features.BlobStoring;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Features.BlobStoring
{
    public class FileSystemTemplateProvider : ITemplateProvider, ITransientDependency
    {
        public Task<Stream> GetTemplateStreamAsync(string templatePath)
        {
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), templatePath);
            Stream stream = File.OpenRead(fullPath);
            return Task.FromResult(stream);
        }
    }
}
