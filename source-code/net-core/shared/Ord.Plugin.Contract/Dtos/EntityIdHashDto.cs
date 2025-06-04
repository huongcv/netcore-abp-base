using Ord.Plugin.Contract.Attributes;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Contract.Dtos
{
    public class EntityIdHashDto<TKey> : EntityDto<TKey>
    {
        [IgnoreColumnName]
        public string? IdHash { get; set; }
        [IgnoreColumnName]
        public TKey? PublishViewId { get => Id; }
    }
}
