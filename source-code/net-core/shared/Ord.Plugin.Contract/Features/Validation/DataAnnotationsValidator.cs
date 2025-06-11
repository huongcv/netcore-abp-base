using System.ComponentModel.DataAnnotations;

namespace Ord.Plugin.Contract.Features.Validation
{
    public static class DataAnnotationsValidator
    {
        public static IList<ValidationResult> ValidateObject(object instance, bool validateAllProperties = true)
        {
            var results = new List<ValidationResult>();
            var context = new ValidationContext(instance, null, null);
            Validator.TryValidateObject(instance, context, results, validateAllProperties);
            return results;
        }
    }
}
