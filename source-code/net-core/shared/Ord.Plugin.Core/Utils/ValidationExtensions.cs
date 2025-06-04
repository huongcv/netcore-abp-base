using FluentValidation;

namespace Ord.Plugin.Core.Utils
{
    public static class ValidationExtensions
    {
        public static IRuleBuilderOptions<T, string> NotNullOrWhiteSpace<T>(
            this IRuleBuilder<T, string> ruleBuilder,
            string errorMessage = null)
        {
            return ruleBuilder
                .Must(value => !string.IsNullOrEmpty(value) && !string.IsNullOrWhiteSpace(value))
                .WithMessage(errorMessage ?? "Field cannot be null or empty");
        }

        public static IRuleBuilderOptions<T, string> ValidEmail<T>(
            this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .NotNullOrWhiteSpace("invalid_email")
                .EmailAddress()
                .WithMessage("invalid_email_format");
        }

        public static IRuleBuilderOptions<T, string> ValidPhoneNumberVietNam<T>(
            this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .NotNullOrWhiteSpace("invalid_phone")
                .Matches(@"^(\+84|0)[3|5|7|8|9][0-9]{8}$")
                .WithMessage("invalid_phone_format");
        }
    }
}
