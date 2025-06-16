namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public interface ITemplateProvider
    {
        Task<Stream> GetTemplateStreamAsync(string templatePath);
    }

    public enum TemplateProvider
    {
        FileSystem,
        MinIO
    }
}
