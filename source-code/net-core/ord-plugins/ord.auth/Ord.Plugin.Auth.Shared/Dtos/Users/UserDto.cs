using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class UserDto : UserBaseDto, IEntityDto<Guid>
    {
        public Guid Id { get; set; }
    }
}
