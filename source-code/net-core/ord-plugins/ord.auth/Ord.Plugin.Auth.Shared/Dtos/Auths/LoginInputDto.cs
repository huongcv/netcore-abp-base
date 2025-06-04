using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Auth.Shared.Dtos.Auths
{
    public class LoginInputDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string? TenantCode { get; set; }
        public string? FireBaseToken { get; set; }
        public string? Platform { get; set; }
    }
    public class LoginInputDtoValidator : LocalizedValidator<LoginInputDto, OrdAuthResource>
    {
        public LoginInputDtoValidator(IAppFactory appFactory) : base(appFactory)
        {
            ValidateRequiredString(u => u.UserName, "null_or_empty_username");
            ValidateMinLength(u => u.UserName, 3, "login_username_minlength", 3);
            ValidateRequiredString(u => u.Password, "null_or_empty_password");
        }
    }
}
