using FluentValidation;
using Microsoft.Extensions.Localization;

namespace Ord.Plugin.Contract.Utils
{
    public static class FluentValidationExtensions
    {
        /// <summary>
        /// Required validation - tự động phát hiện type và áp dụng validation phù hợp
        /// </summary>
        public static IRuleBuilderOptions<T, TProperty> Required<T, TProperty>(this IRuleBuilder<T, TProperty> ruleBuilder, string? errorMessage = null)
        {
            var propertyType = typeof(TProperty);
            var underlyingType = Nullable.GetUnderlyingType(propertyType) ?? propertyType;
            errorMessage = errorMessage ?? "common_validation_required";

            // Kiểm tra nếu là string hoặc string?
            if (underlyingType == typeof(string) || propertyType == typeof(string))
            {
                return ruleBuilder
                    .Must(value =>
                    {
                        var stringValue = value as string;
                        return !string.IsNullOrEmpty(stringValue) && !string.IsNullOrWhiteSpace(stringValue);
                    })
                    .WithMessage(errorMessage);
            }

            // Kiểm tra nếu là Guid hoặc Guid?
            if (underlyingType == typeof(Guid))
            {
                return ruleBuilder
                    .Must(value =>
                    {
                        if (value == null) return false;
                        if (value is Guid guid) return guid != Guid.Empty;
                        return false;
                    })
                    .WithMessage(errorMessage);
            }

            // Kiểm tra nếu là nullable value type
            if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                return ruleBuilder
                    .NotNull()
                    .WithMessage(errorMessage);
            }

            // Kiểm tra nếu là reference type
            if (!propertyType.IsValueType)
            {
                return ruleBuilder
                    .NotNull()
                    .WithMessage(errorMessage);
            }

            // Kiểm tra nếu là enum
            if (underlyingType.IsEnum)
            {
                return ruleBuilder
                    .Must(value =>
                    {
                        if (value == null) return false;
                        return Enum.IsDefined(underlyingType, value);
                    })
                    .WithMessage(errorMessage);
            }

            // Default cho value types
            return ruleBuilder
                .NotEmpty()
                .WithMessage(errorMessage);
        }

        public static IRuleBuilderOptions<T, TProperty> Required<T, TProperty>(this IRuleBuilder<T, TProperty> ruleBuilder, IStringLocalizer localizer, string messageKey, params object[] args)
        {
            var errorMessage = localizer.GetLocalizedMessage(messageKey, args);
            return ruleBuilder.Required(errorMessage);
        }
        public static IRuleBuilderOptions<T, string> MaxLengthString<T>(this IRuleBuilder<T, string> ruleBuilder, int maxLength)
        {
            return ruleBuilder.MaximumLength(maxLength)
                .WithErrorCode(maxLength.ToString())
                .WithMessage("common_validation_maxlength");
        }
        public static IRuleBuilderOptions<T, string> MinLengthString<T>(this IRuleBuilder<T, string> ruleBuilder, int minLength)
        {
            return ruleBuilder.MinimumLength(minLength)
                .WithErrorCode(minLength.ToString())
                .WithMessage("common_validation_minlength");
        }
    }
}
