using AutoMapper;
using Ord.Domain.Entities.Auth;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Auth.Shared.Dtos.Settings
{
    [AutoMap(typeof(BlacklistedEntity), ReverseMap = true)]
    public class BlacklistedDto : Entity<int>, IHasEncodedId
    {
        public string? EncodedId { get; set; }
        public string? Name { get; set; }
        public string? Value { get; set; }
    }

}
