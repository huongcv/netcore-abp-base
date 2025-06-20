﻿using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using System.ComponentModel;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class UserCrudBase : IHasActived, IHasEncodedId
    {
        public string? Email { get; set; }
        [DisplayName("field.phone")]
        public string? PhoneNumber { get; set; }
        [DisplayName("FullName")]
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
        public DateTime CreationTime { get; set; }
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
        public string? UserName { get; set; }
        public string? Password { get; set; }
    }

    public class UpdateUserDto : UserCrudBase
    {
        public string? Password { get; set; }
    }

    public class ResetPasswordUserDto : EncodedIdDto
    {
        public string? NewPassword { get; set; }
        public bool MustChangePassword { get; set; }
    }
    public class ChangePasswordUserDto
    {
        public string? CurrentPassword { get; set; }
        [DisplayName("field.new_password")]
        public string? NewPassword { get; set; }
    }

    public class AssignRolesToUserDto : EncodedIdDto
    {
        public List<Guid> RoleIds { get; set; }
    }
    public class GrantPermissionToUserDto : EncodedIdDto
    {
        public string PermissionName { get; set; }
    }

    public class RevokePermissionFromUserDto : EncodedIdDto
    {
        public string PermissionName { get; set; }
    }
}
