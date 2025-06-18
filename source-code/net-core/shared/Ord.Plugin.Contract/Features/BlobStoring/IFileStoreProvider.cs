namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public interface IFileStoreProvider
    {
        Task<Stream> GetStreamAsync(string templatePath);
        Task SaveAsync(string templatePath, Stream blobStream, bool overrideExisting);
        Task<bool> DeleteAsync(string templatePath);
    }
}
