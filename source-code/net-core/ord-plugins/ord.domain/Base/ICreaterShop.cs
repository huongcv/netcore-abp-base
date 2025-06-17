using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Contract.Data
{

    /// <summary>
    /// Chỉ để xác định shop tạo ra (ko filter khi query)
    /// </summary>
    public interface ICreatorShopId
    {
        int? CreatorShopId { get; set; }
    }

    
}
