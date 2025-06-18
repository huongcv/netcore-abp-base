using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Ord.Plugin.Contract.Features.Validation.Attributes
{
    public class OrdMaxFileSizeAttribute : OrdParameterValidationAttribute
    {
        private readonly long _maxSizeInBytes;
        private readonly long _maxSizeInMB;
        public OrdMaxFileSizeAttribute(long maxSizeInMB) : base("MaxFileSize")
        {
            _maxSizeInMB = maxSizeInMB;
            _maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        }
        protected override bool IsValueValid(object value, ValidationContext validationContext)
        {
            if (value == null) return true;

            if (value is IFormFile file)
            {
                if (file.Length > _maxSizeInBytes)
                {
                    return false;
                }
            }

            return true;
        }

        protected override object[] GetMessageParameters()
        {
            return new object[] { $"{_maxSizeInMB} MB" };
        }
    }
}
