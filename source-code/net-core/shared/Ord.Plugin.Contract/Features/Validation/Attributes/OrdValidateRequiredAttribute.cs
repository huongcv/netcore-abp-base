using Ord.Plugin.Contract.Localization;
using System.ComponentModel.DataAnnotations;

namespace Ord.Plugin.Contract.Features.Validation.Attributes
{
    public class OrdValidateRequiredAttribute : ValidationAttribute
    {
        public string LocalizationKey { get; set; }
        public string FieldName { get; set; }
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value != null && !string.IsNullOrWhiteSpace(value.ToString()))
                return ValidationResult.Success;
            var localizer = (IOrdLocalizer)validationContext.GetService(typeof(IOrdLocalizer));
            var errorMessage = localizer[LocalizationKey, FieldName];
            return new ValidationResult(errorMessage);
        }
    }
}
