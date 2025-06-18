using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Localization;
using System.ComponentModel.DataAnnotations;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Utils;

namespace Ord.Plugin.Contract.Features.Validation.Attributes
{
    public abstract class OrdValidationAttribute : ValidationAttribute
    {
        // public string? MessageKey { get; set; }
        public string? FieldName { get; set; }
        protected IAppFactory _appFactory;

        protected OrdValidationAttribute(string defaultMessageKey)
        {
            // MessageKey = ValidationMessages.Prefix + defaultMessageKey;
            ErrorMessage = ValidationMessages.Prefix + defaultMessageKey;
        }

        protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
        {
            if (IsValueValid(value, validationContext))
                return ValidationResult.Success;
            _appFactory = validationContext.GetRequiredService<IAppFactory>();
            var fieldName = GetFieldName(validationContext);
            var errorMessage = GetErrorMessage(validationContext, fieldName, value);
            return new ValidationResult(errorMessage);
        }

        /// <summary>
        /// Abstract method để validate giá trị
        /// </summary>
        protected abstract bool IsValueValid(object value, ValidationContext validationContext);

        /// <summary>
        /// Virtual method để tùy chỉnh cách tạo error message
        /// </summary>
        protected virtual string GetErrorMessage(ValidationContext validationContext, string fieldName, object value)
        {
            var errorMessage = ErrorMessage ?? "common.validation_err_base";
            return _appFactory.GetLocalizedMessage(errorMessage, fieldName, value);
        }

        protected virtual string GetFieldName(ValidationContext validationContext)
        {
            var fieldName = FieldName ?? validationContext.DisplayName;
            fieldName = StringUtil.AddPrefixForFieldNameLocalized(fieldName);
            return _appFactory.GetLocalizedMessage(fieldName);
        }
    }

    /// <summary>
    /// Base class cho các validation có parameter (như length, pattern)
    /// </summary>
    public abstract class OrdParameterValidationAttribute(string defaultMessageKey) : OrdValidationAttribute(defaultMessageKey)
    {
        protected override string GetErrorMessage(ValidationContext validationContext, string fieldName, object value)
        {
            var parameters = GetMessageParameters();
            var allParams = new object[] { fieldName }.Concat(parameters).ToArray();
            allParams.AddLast(value);
            var errorMessage = ErrorMessage ?? "common.validation_err_base";
            return _appFactory.GetLocalizedMessage(errorMessage, allParams);
        }
        protected abstract object[] GetMessageParameters();
    }
}
