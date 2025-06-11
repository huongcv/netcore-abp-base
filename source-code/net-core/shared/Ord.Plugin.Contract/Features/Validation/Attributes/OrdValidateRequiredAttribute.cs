using System.ComponentModel.DataAnnotations;

namespace Ord.Plugin.Contract.Features.Validation.Attributes
{
    public class OrdValidateRequiredAttribute() : OrdValidationAttribute("required")
    {
        protected override bool IsValueValid(object value, ValidationContext validationContext)
        {
            if (value == null) return false;

            var valueType = value.GetType();
            var underlyingType = Nullable.GetUnderlyingType(valueType) ?? valueType;

            // Kiểm tra string
            if (value is string stringValue)
            {
                return !string.IsNullOrEmpty(stringValue) && !string.IsNullOrWhiteSpace(stringValue);
            }

            // Kiểm tra Guid
            if (value is Guid guidValue)
            {
                return guidValue != Guid.Empty;
            }

            // Kiểm tra enum
            if (underlyingType.IsEnum)
            {
                return Enum.IsDefined(underlyingType, value);
            }

            // Mặc định cho các type khác
            return true;
        }
    }
}
