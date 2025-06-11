using Ord.Plugin.Contract.Localization;
using System.ComponentModel.DataAnnotations;

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

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (IsValueValid(value, validationContext))
                return ValidationResult.Success;

            var localizer = (IOrdLocalizer)validationContext.GetService(typeof(IOrdLocalizer));
            var fieldName = FieldName ?? validationContext.DisplayName;
            var errorMessage = GetErrorMessage(localizer, fieldName, value);
            return new ValidationResult(errorMessage);
        }

        /// <summary>
        /// Abstract method để validate giá trị
        /// </summary>
        protected abstract bool IsValueValid(object value, ValidationContext validationContext);

        /// <summary>
        /// Virtual method để tùy chỉnh cách tạo error message
        /// </summary>
        protected virtual string GetErrorMessage(IOrdLocalizer localizer, string fieldName,object value)
        {
            return localizer[MessageKey, fieldName, value];
        }
    }

    /// <summary>
    /// Base class cho các validation có parameter (như length, pattern)
    /// </summary>
    public abstract class OrdParameterValidationAttribute(string defaultMessageKey) : OrdValidationAttribute(defaultMessageKey)
    {
        protected override string GetErrorMessage(IOrdLocalizer localizer, string fieldName, object value)
        {
            var parameters = GetMessageParameters();
            var allParams = new object[] { fieldName }.Concat(parameters).ToArray();
            allParams.AddLast(value);
            return localizer[MessageKey, allParams];
        }

        /// <summary>
        /// Abstract method để lấy các parameter cho error message
        /// </summary>
        protected abstract object[] GetMessageParameters();
    }
}
