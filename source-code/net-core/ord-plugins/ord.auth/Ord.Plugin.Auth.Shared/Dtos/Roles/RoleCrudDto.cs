using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Validation.Attributes;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class RoleCrudBase : IHasActived
    {

        [OrdMaxLengthString(100)]
        [OrdValidateRequired]
        public string? Code { get; set; }
        [OrdMaxLengthString(200)]
        public string? Name { get; set; }
        [OrdMaxLengthString(500)]
        public string? Description { get; set; }
        public bool IsActived { get; set; }

    }

    public class RolePagedDto : RoleCrudBase, IEntityDto<Guid>, IHasEncodedId
    {
        public Guid Id { get; set; }
        public string? EncodedId { get; set; }
        public DateTime CreationTime { get; set; }
    }
    public class RolePagedInput : OrdPagedRequestDto
    {
    }
    public class RoleDetailDto : RolePagedDto
    {
        public IEnumerable<string>? AssignedPermissions { get; set; }
    }
    public class CreateRoleDto : RoleCrudBase
    {
    }

    public class UpdateRoleDto : RoleCrudBase, IHasEncodedId
    {
        [OrdValidateRequired]
        public string? EncodedId { get; set; }
    }
    #region User Management DTOs
    public class GetUsersInRoleInput : OrdPagedRequestDto
    {
        [OrdValidateRequired]
        public string? EncodedId { get; set; }
        public bool? IsActived { get; set; }
    }

    public class UserInRoleDto
    {
        public Guid UserId { get; set; }
        public Guid? TenantId { get; set; }
        public string UserName { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsActived { get; set; }
        public DateTime AssignedDate { get; set; }
        public string UserEncodedId { get; set; }
    }
    public class UsersToRoleDto : EncodedIdDto
    {
        public List<Guid> UserIds { get; set; } = new();
    }
    #endregion

}
