using FluentValidation;
using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Auth.Shared.Dtos.Users
{
    public class CreateUserDtoValidator : LocalizedValidator<CreateUserDto, OrdAuthResource>
    {
        public CreateUserDtoValidator(IAppFactory appFactory) : base(appFactory)
        {
            ValidateRequiredString(u => u.UserName, "null_or_empty_username");
            ValidateRegex(u => u.UserName, RegexPatternConst.UserNameRegex, "username_not_regex");
            ValidateRequiredString(u => u.Password, "null_or_empty_password");
            ValidateRegex(u => u.Password, RegexPatternConst.PasswordRegex, "pwd_not_regex");
            RuleFor(x => x.Email).EmailAddress()
                .When(u => !string.IsNullOrEmpty(u.Email))
                .WithMessage(GetLocalizedMessage("invalid_email_format"));
            ValidateRequiredString(u => u.Name, "crud_user_null_name");
        }
    }
    public class UpdateUserDtoValidator : LocalizedValidator<UpdateUserDto, OrdAuthResource>
    {
        public UpdateUserDtoValidator(IAppFactory appFactory) : base(appFactory)
        {
            ValidateRequiredString(u => u.EncodedId, "null_or_empty_encode_id");
            ValidateRequiredString(u => u.Name, "crud_user_null_name");
        }
    }
}
