using FluentValidation;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Utils;

namespace Ord.Plugin.Auth.Shared.Dtos.Users
{
    public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserDtoValidator(IAppFactory appFactory)
        {
            RuleFor(u => u.UserName)
                .Required()
                .MinLengthString(3)
                .MaxLengthString(200);
            RuleFor(u => u.Password)
                .Required();
            RuleFor(u => u.Name)
                .MinLengthString(3)
                .Required();


            RuleFor(u => u.Email).MaxLengthString(300);
            RuleFor(u => u.PhoneNumber).MaxLengthString(20);
            RuleFor(u => u.Name).MaxLengthString(300);
            RuleFor(u => u.Password).MaxLengthString(30);
            RuleFor(u => u.EncodedId).Required();

            //  ValidateRegex(u => u.UserName, RegexPatternConst.UserNameRegex, "username_not_regex");
            //ValidateRegex(u => u.Password, RegexPatternConst.PasswordRegex, "pwd_not_regex");
            //RuleFor(x => x.Email).EmailAddress()
            //    .When(u => !string.IsNullOrEmpty(u.Email))
            //    .WithMessage(GetLocalizedMessage("invalid_email_format"));

            //ValidateMaxLength(
            //    (u => u.UserName, 2, "crud_user_username_maxlength"),
            //    (u => u.Email, 300, "crud_user_email_maxlength"),
            //    (u => u.PhoneNumber, 20, "crud_user_phone_maxlength"),
            //    (u => u.Name, 200, "crud_user_name_maxlength"),
            //    (u => u.Password, 30, "crud_user_pwd_maxlength")
            //);
        }
    }
    public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserDtoValidator(IAppFactory appFactory)
        {
            RuleFor(u => u.Name)
                .MinLengthString(3)
                .Required();
            RuleFor(u => u.Email).MaxLengthString(300);
            RuleFor(u => u.PhoneNumber).MaxLengthString(20);
            RuleFor(u => u.Name).MaxLengthString(300);
            RuleFor(u => u.Password).MaxLengthString(30);
            RuleFor(u => u.EncodedId).Required();

        }
    }

    public class ResetPasswordUserDtoValidator : AbstractValidator<ResetPasswordUserDto>
    {
        public ResetPasswordUserDtoValidator(IAppFactory appFactory)
        {
            RuleFor(u => u.EncodedId).Required();
            RuleFor(u => u.NewPassword).Required();
            //ValidateRequiredString(u => u.EncodedId, "null_or_empty_encode_id");
            //ValidateRequiredString(u => u.NewPassword, "null_or_empty_password");
            //ValidateRegex(u => u.NewPassword, RegexPatternConst.PasswordRegex, "pwd_not_regex");
        }
    }
    public class ChangePasswordUserDtoValidator : AbstractValidator<ChangePasswordUserDto>
    {
        public ChangePasswordUserDtoValidator(IAppFactory appFactory)
        {
            RuleFor(u => u.NewPassword).Required();
            RuleFor(u => u.NewPassword).Required();
            //ValidateRequiredString(u => u.NewPassword, "null_or_empty_password");
            //ValidateRegex(u => u.NewPassword, RegexPatternConst.PasswordRegex, "pwd_not_regex");
        }
    }
}
