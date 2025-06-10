using FluentValidation;
using Ord.Plugin.Contract.Utils;
using System.ComponentModel;

namespace Ord.Plugin.Auth.Shared.Dtos.Auths
{
    public class LoginInputDto
    {
        [DisplayName("field.username")]
        public string UserName { get; set; }
        [DisplayName("field.password")]
        public string Password { get; set; }
        public string? TenantCode { get; set; }
        public string? FireBaseToken { get; set; }
        public string? Platform { get; set; }
    }
    public class LoginInputDtoValidator : AbstractValidator<LoginInputDto>
    {
        public LoginInputDtoValidator()
        {
            RuleFor(u => u.UserName)
                .Required()
                .MinLengthString(3)
                .MaxLengthString(200);
            RuleFor(u => u.Password)
                .Required()
                .MaxLengthString(50);
        }
    }
}
