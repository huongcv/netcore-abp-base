using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using System.ComponentModel;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class RoleCrudBase : IHasActived, IHasEncodedId
    {
        [DisplayName("field.code")]
        public string? Code { get; set; }
        [DisplayName("field.name")]
        public string? Name { get; set; }
        [DisplayName("field.description")]
        public string? Description { get; set; }
        public bool IsActived { get; set; }
        public string? EncodedId { get; set; }
    }

    public class RolePagedDto : RoleCrudBase, IEntityDto<Guid>
    {
        public Guid Id { get; set; }
    }
    public class RolePagedInput : OrdPagedRequestDto
    {

    }
    public class RoleDetailDto : RolePagedDto
    {
        public DateTime CreationTime { get; set; }
        public IEnumerable<string>? AssignedPermissions { get; set; }
    }
    public class CreateRoleDto : RoleCrudBase
    {
    }

    public class UpdateRoleDto : RoleCrudBase
    {
    }
}
