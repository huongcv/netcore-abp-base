using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using System.ComponentModel;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class UserCrudBase : IHasActived, IHasEncodedId
    {
        public string? Email { get; set; }
        [DisplayName("fields.phone")]
        public string? PhoneNumber { get; set; }
        [DisplayName("fields.full_name")]
        public string? Name { get; set; }
        public bool IsActived { get; set; }
        public string? EncodedId { get; set; }
        public bool? MustChangePassword { get; set; }
        public bool? IsLockoutEnabled { get; set; }
        public DateTime? BirthDay { get; set; }
    }
    /// <summary>
    /// DTO cho danh sách phân trang User (ít thông tin hơn)
    /// </summary>
    public class UserPagedDto : UserCrudBase, IEntityDto<Guid>
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
    }

    public class UserPagedInput : OrdPagedRequestDto
    {

    }
    public class UserDetailDto : UserCrudBase, IEntityDto<Guid>
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public DateTime CreationTime { get; set; }
    }

    public class CreateUserDto : UserCrudBase
    {
        [DisplayName("fields.username")]
        public string? UserName { get; set; }
        [DisplayName("fields.password")]
        public string? Password { get; set; }
    }

    public class UpdateUserDto : UserCrudBase
    {
        [DisplayName("fields.password")]
        public string? Password { get; set; }
    }

    public class ResetPasswordUserDto : EncodedIdDto
    {
        [DisplayName("fields.new_password")]
        public string? NewPassword { get; set; }
        public bool MustChangePassword { get; set; }
    }
    public class ChangePasswordUserDto
    {
        [DisplayName("fields.current_password")]
        public string? CurrentPassword { get; set; }
        [DisplayName("fields.new_password")]
        public string? NewPassword { get; set; }
    }
}
