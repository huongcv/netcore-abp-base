using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Localization;
using System.ComponentModel.DataAnnotations;
using Ord.Plugin.Contract.Utils;

namespace Ord.Plugin.Contract.Features.Validation.Attributes
{
    public abstract class OrdValidationAttribute : ValidationAttribute
    {
        public string? MessageKey { get; set; }
        public string? FieldName { get; set; }

        protected OrdValidationAttribute(string defaultMessageKey)
        {
            MessageKey = ValidationMessages.Prefix + defaultMessageKey;
        }

        protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
        {
            if (IsValueValid(value, validationContext))
                return ValidationResult.Success;
            var localizer = GetLocalizer(validationContext);
            var fieldName = GetFieldName(validationContext, localizer);
            var errorMessage = GetErrorMessage(validationContext, localizer, fieldName, value);
            return new ValidationResult(errorMessage);
        }

        /// <summary>
        /// Abstract method để validate giá trị
        /// </summary>
        protected abstract bool IsValueValid(object value, ValidationContext validationContext);

        /// <summary>
        /// Virtual method để tùy chỉnh cách tạo error message
        /// </summary>
        protected virtual string GetErrorMessage(ValidationContext validationContext, IOrdLocalizer localizer, string fieldName, object value)
        {
            return localizer[MessageKey ?? "common.validation_err_base", fieldName, value];
        }

        protected virtual string GetFieldName(ValidationContext validationContext, IOrdLocalizer localizer)
        {
            var fieldName = FieldName ?? validationContext.DisplayName;
            fieldName = StringUtil.AddPrefixForFieldNameLocalized(fieldName);
            return localizer[fieldName];
        }

        protected IOrdLocalizer GetLocalizer(ValidationContext validationContext)
        {
            return (IOrdLocalizer)validationContext.GetRequiredService(typeof(IOrdLocalizer));
        }
    }

    /// <summary>
    /// Base class cho các validation có parameter (như length, pattern)
    /// </summary>
    public abstract class OrdParameterValidationAttribute(string defaultMessageKey) : OrdValidationAttribute(defaultMessageKey)
    {
        protected override string GetErrorMessage(ValidationContext validationContext, IOrdLocalizer localizer, string fieldName, object value)
        {
            var parameters = GetMessageParameters();
            var allParams = new object[] { fieldName }.Concat(parameters).ToArray();
            allParams.AddLast(value);
            return localizer[MessageKey, allParams];
        }
        protected abstract object[] GetMessageParameters();
    }
}
