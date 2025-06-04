using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Services.Shop
{
    public interface ICurrentShop : IScopedDependency
    {
        int? ShopId { get; }
        void ChangeShop(int shopId);
    }
}
