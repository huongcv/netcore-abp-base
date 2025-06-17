using Volo.Abp;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Contract.Base
{
    public interface IHasActived
    {
        bool IsActived { get; set; }
    }
}
