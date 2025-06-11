using Ord.Plugin.Contract.Localization;
using System.ComponentModel.DataAnnotations;

namespace Ord.Plugin.Contract.Features.Validation.Attributes
{
    public class OrdMinLengthStringAttribute : OrdParameterValidationAttribute
    {
        public int MinLength { get; }

        public OrdMinLengthStringAttribute(int minLength) : base("minlength")
        {
            MinLength = minLength;
        }

        protected override bool IsValueValid(object value, ValidationContext validationContext)
        {
            if (value == null || !(value is string stringValue))
                return true;

            return stringValue.Length >= MinLength;
        }

        protected override object[] GetMessageParameters()
        {
            return new object[] { MinLength };
        }
    }
}
