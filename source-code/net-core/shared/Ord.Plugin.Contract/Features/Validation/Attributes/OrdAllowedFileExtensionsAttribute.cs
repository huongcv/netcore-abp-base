using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Ord.Plugin.Contract.Features.Validation.Attributes
{
    public class OrdAllowedFileExtensionsAttribute : OrdParameterValidationAttribute
    {
        private readonly string[] _extensions;
        private string currentFileExtension;

        public OrdAllowedFileExtensionsAttribute(params string[] extensions) : base("AllowedFileExtensions")
        {
            _extensions = extensions.Select(ext => ext.ToLower()).ToArray();
        }


        protected override bool IsValueValid(object value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return true;
            }
            if (value is IFormFile file)
            {
                var extension = Path.GetExtension(file.FileName)?.ToLower();
                if (!_extensions.Contains(extension))
                {
                    currentFileExtension = extension;
                    return false;
                }
            }

            return true;
        }
        protected override object[] GetMessageParameters()
        {
            return new object[] { currentFileExtension, string.Join(", ", _extensions) };
        }
    }
}
