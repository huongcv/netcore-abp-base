using System.ComponentModel.DataAnnotations;

namespace Ord.Plugin.Contract.Features.Validation.Attributes
{
    public class OrdMaxLengthStringAttribute : OrdParameterValidationAttribute
    {
        public int MaxLength { get; }

        public OrdMaxLengthStringAttribute(int maxLength) : base("maxlength")
        {
            MaxLength = maxLength;
        }

        protected override bool IsValueValid(object value, ValidationContext validationContext)
        {
            if (value == null || !(value is string stringValue))
                return true;

            return stringValue.Length <= MaxLength;
        }

        protected override object[] GetMessageParameters()
        {
            return new object[] { MaxLength };
        }
    }
}
