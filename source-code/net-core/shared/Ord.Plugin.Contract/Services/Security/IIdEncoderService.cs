using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Services.Security
{
    public interface IIdEncoderService<TEntity> : IScopedDependency
    where TEntity : class
    {
        string? EncodeId<T>(T id);
        T DecodeId<T>(string encodedId);
        bool TryDecodeId<T>(string encodedId, out T id);
    }
}
