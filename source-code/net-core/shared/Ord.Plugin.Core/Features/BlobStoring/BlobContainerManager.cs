using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Factories.Extensions;

namespace Ord.Plugin.Core.Features.BlobStoring
{
    public class BlobContainerManager : OrdManagerBase, IBlobContainerManager
    {
        public async Task SaveAsync(FileStoreProvider fileStoreProvider, string name, Stream stream, bool overrideExisting = false)
        {
            var provider = GetStoreProvider(fileStoreProvider);
            await provider.SaveAsync(name, stream, overrideExisting);

        }

        public async Task DeleteAsync(FileStoreProvider fileStoreProvider, string name)
        {
            try
            {
                var provider = GetStoreProvider(fileStoreProvider);
                await provider.DeleteAsync(name);
            }
            catch (Exception e)
            {
                Logger.LogError(e, "BlobContainerManager DeleteAsync Error");
            }
        }

        public Task<Stream> GetAsync(FileStoreProvider fileStoreProvider, string name)
        {
            var provider = GetStoreProvider(fileStoreProvider);
            return provider.GetStreamAsync(name);
        }

        public async Task<byte[]> GetAllBytesOrNullAsync(FileStoreProvider fileStoreProvider, string name)
        {
            await using var stream = await GetAsync(fileStoreProvider, name);
            stream.Position = 0;
            return await stream.GetAllBytesAsync();
        }

        protected virtual IFileStoreProvider GetStoreProvider(FileStoreProvider fileStoreProvider)
        {
            return AppFactory.GetStoreProvider(fileStoreProvider);
        }
    }
}
