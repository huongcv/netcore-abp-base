using FluentValidation;
using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Utils;

namespace Ord.Plugin.Auth.Shared.Dtos.Users
{
    public class CreateUserDtoValidator : LocalizedValidator<CreateUserDto, OrdAuthResource>
    {
        public CreateUserDtoValidator(IAppFactory appFactory) : base(appFactory)
        {
            RuleFor(u => u.UserName)
                .Required()
                .MaxLengthString(2);
            RuleFor(u => u.Password)
                .Required();
            RuleFor(u => u.Name)
                .Required();
           
          //  ValidateRegex(u => u.UserName, RegexPatternConst.UserNameRegex, "username_not_regex");
            ValidateRegex(u => u.Password, RegexPatternConst.PasswordRegex, "pwd_not_regex");
            RuleFor(x => x.Email).EmailAddress()
                .When(u => !string.IsNullOrEmpty(u.Email))
                .WithMessage(GetLocalizedMessage("invalid_email_format"));

            ValidateMaxLength(
                (u => u.UserName, 2, "crud_user_username_maxlength"),
                (u => u.Email, 300, "crud_user_email_maxlength"),
                (u => u.PhoneNumber, 20, "crud_user_phone_maxlength"),
                (u => u.Name, 200, "crud_user_name_maxlength"),
                (u => u.Password, 30, "crud_user_pwd_maxlength")
            );
        }
    }
    public class UpdateUserDtoValidator : LocalizedValidator<UpdateUserDto, OrdAuthResource>
    {
        public UpdateUserDtoValidator(IAppFactory appFactory) : base(appFactory)
        {
            ValidateRequiredString(
                (u => u.EncodedId, "null_or_empty_encode_id"),
                (u => u.Name, "crud_user_null_name"));
            ValidateRegexIfNotNull(u => u.Password, RegexPatternConst.PasswordRegex, "crud_user_null_name");

            ValidateMaxLength(
                (u => u.Email, 300, "crud_user_email_maxlength"),
                (u => u.PhoneNumber, 20, "crud_user_phone_maxlength"),
                (u => u.Name, 200, "crud_user_name_maxlength"),
                (u => u.Password, 30, "crud_user_pwd_maxlength")
            );

        }
    }

    public class ResetPasswordUserDtoValidator : LocalizedValidator<ResetPasswordUserDto, OrdAuthResource>
    {
        public ResetPasswordUserDtoValidator(IAppFactory appFactory) : base(appFactory)
        {
            ValidateRequiredString(u => u.EncodedId, "null_or_empty_encode_id");
            ValidateRequiredString(u => u.NewPassword, "null_or_empty_password");
            ValidateRegex(u => u.NewPassword, RegexPatternConst.PasswordRegex, "pwd_not_regex");
        }
    }
    public class ChangePasswordUserDtoValidator : LocalizedValidator<ChangePasswordUserDto, OrdAuthResource>
    {
        public ChangePasswordUserDtoValidator(IAppFactory appFactory) : base(appFactory)
        {
            ValidateRequiredString(u => u.NewPassword, "null_or_empty_password");
            ValidateRegex(u => u.NewPassword, RegexPatternConst.PasswordRegex, "pwd_not_regex");
        }
    }
}
