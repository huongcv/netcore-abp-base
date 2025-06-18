namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public interface IFileStoreProvider
    {
        Task<Stream> GetStreamAsync(string templatePath);
    }
}
