using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Services
{
    public interface IIDGenerator : ISingletonDependency
    {
        long GenerateID();
    }
}
