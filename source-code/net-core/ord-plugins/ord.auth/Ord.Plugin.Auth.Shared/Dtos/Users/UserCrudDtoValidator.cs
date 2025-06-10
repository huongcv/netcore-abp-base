using FluentValidation;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Factories;

namespace Ord.Plugin.Auth.Shared.Dtos.Users
{
    public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserDtoValidator(IAppFactory appFactory)
        {
            RuleFor(u => u.UserName)
                .Required()
                .MinLengthString(3)
                .MaxLengthString(200)
                .ValidateUserName();
            RuleFor(u => u.Password)
                .Required()
                .ValidatePassword(appFactory);
            RuleFor(u => u.Name)
                .MaxLengthString(300)
                .Required();
            RuleFor(u => u.Email).MaxLengthString(300);
            RuleFor(u => u.PhoneNumber).MaxLengthString(20);
            RuleFor(u => u.Password).MaxLengthString(30);
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
