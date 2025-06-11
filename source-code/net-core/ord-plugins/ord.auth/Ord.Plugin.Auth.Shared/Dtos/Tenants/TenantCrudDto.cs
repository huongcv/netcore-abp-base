using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Validation.Attributes;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos.Tenants
{
    public class TenantCrudBase : IHasActived
    {
        [OrdValidateRequired]
        [OrdMaxLengthString(50)]
        public string Code { get; set; }

        [OrdValidateRequired]
        [OrdMaxLengthString(200)]
        public string Name { get; set; }

        [OrdMaxLengthString(200)]
        public string? Email { get; set; }

        [OrdMaxLengthString(20)]
        [OrdValidPhoneNumberVietNam]
        public string? PhoneNumber { get; set; }

        [OrdMaxLengthString(200)]
        public string? Address { get; set; }
        public bool IsActived { get; set; }
    }
    public class TenantPagedDto : TenantCrudBase, IEntityDto<Guid>, IHasEncodedId
    {
        public Guid Id { get; set; }
        public DateTime CreationTime { get; set; }
        public int UserCount { get; set; }
        public string? EncodedId { get; set; }
    }
    public class TenantPagedInput : OrdPagedRequestDto
    {

    }

    public class TenantDetailDto : TenantPagedDto
    {
        public List<TenantUserDto>? Users { get; set; }
    }

    public class CreateTenantDto : TenantCrudBase
    {
        [OrdValidatePassword]
        public string? AdminPassword { get; set; }
        public string? AdminUsername { get; set; }
        public bool CreateDefaultAdmin { get; set; }
    }

    public class UpdateTenantDto : TenantCrudBase, IHasEncodedId
    {
        [OrdValidateRequired]
        public string? EncodedId { get; set; }
    }

    public class TenantUserPagedInput : OrdPagedRequestDto, IHasEncodedId
    {
        [OrdValidateRequired]
        public string? EncodedId { get; set; }
    }
    public class TenantUserDto
    {
        public string? UserEncodedId { get; set; }
        public Guid Id { get; set; }
        public Guid? TenantId { get; set; }
        public string UserName { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public bool IsActived { get; set; }
        public bool IsAdminAccount { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
