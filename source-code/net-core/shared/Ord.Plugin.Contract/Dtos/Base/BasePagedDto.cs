using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Contract.Dtos.Base
{
    public class BasePagedDto<TKey> : IHasEncodedId,IEntityDto<TKey>
    {
        public string EncodedId { get; set; }
        public TKey Id { get; set; }
    }
}
