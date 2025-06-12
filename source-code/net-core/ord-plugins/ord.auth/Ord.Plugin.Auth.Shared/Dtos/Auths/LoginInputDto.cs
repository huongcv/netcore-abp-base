using Ord.Plugin.Contract.Features.Validation.Attributes;

namespace Ord.Plugin.Auth.Shared.Dtos.Auths
{
    public class LoginInputDto
    {
        [OrdMinLengthString(3)]
        [OrdValidateRequired]
        [OrdMaxLengthString(200)]
        public string UserName { get; set; }
        [OrdValidateRequired]
        [OrdMaxLengthString(50)]
        public string Password { get; set; }
        public string? TenantCode { get; set; }
        public FireBaseDto? FireBase { get; set; }

    }

    public class FireBaseDto
    {
        public string? FireBaseToken { get; set; }
        public string? DeviceId { get; set; }
        public string? DeviceName { get; set; }
        public string? Platform { get; set; }
    }
}
