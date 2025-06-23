using Ord.Plugin.Contract.Features.Validation.Attributes;

namespace Ord.Plugin.Auth.Shared.Dtos.Auths
{
    public class RefreshTokenRequest
    {
        [OrdValidateRequired]
        public string RefreshToken { get; set; }
        public string? AccessToken { get; set; }
    }
}
