using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class UserCrudBase : IHasActived, IHasEncodedId
    {
        public string UserName { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public bool IsActived { get; set; }
        public string? EncodedId { get; set; }
        public bool? MustChangePassword { get; set; }
        public bool? IsLockoutEnabled { get; set; }
    }
    /// <summary>
    /// DTO cho danh sách phân trang User (ít thông tin hơn)
    /// </summary>
    public class UserPagedDto : UserCrudBase,IEntityDto<Guid>
    {
        public Guid Id { get; set; }
    }

    public class UserPagedInput : OrdPagedRequestDto
    {

    }
    public class UserDetailDto : UserCrudBase, IEntityDto<Guid>
    {
        public Guid Id { get; set; }
        public DateTime CreationTime { get; set; }
    }

    public class CreateUserDto : UserCrudBase
    {

    }
    public class UpdateUserDto : UserCrudBase
    {

    }
}
