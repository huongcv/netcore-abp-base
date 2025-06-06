using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Services.Security
{
    public interface IIdEncoderService<TEntity,TKey> : IScopedDependency
    where TEntity : class
    {
        string? EncodeId(TKey id);
        TKey DecodeId(string encodedId);
        bool TryDecodeId(string encodedId, out TKey id);
    }
}
