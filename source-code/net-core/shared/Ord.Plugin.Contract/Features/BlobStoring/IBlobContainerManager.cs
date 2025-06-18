using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public interface IBlobContainerManager : IDomainService
    {
        Task SaveAsync(FileStoreProvider fileStoreProvider, string name, Stream stream, bool overrideExisting = false);
        Task DeleteAsync(FileStoreProvider fileStoreProvider, string name);
        Task<Stream> GetAsync(FileStoreProvider fileStoreProvider, string name);
        Task<byte[]> GetAllBytesOrNullAsync(FileStoreProvider fileStoreProvider, string name);
    }
}
