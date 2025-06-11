using Ord.Plugin.Contract.Consts;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Ord.Plugin.Contract.Features.Validation.Attributes
{
    /// <summary>
    /// Base class cho regex validation
    /// </summary>
    public abstract class OrdRegexValidationAttributeBase : OrdValidationAttribute
    {
        protected string Pattern { get; }

        protected OrdRegexValidationAttributeBase(string pattern, string defaultMessageKey) : base(defaultMessageKey)
        {
            Pattern = pattern ?? throw new ArgumentNullException(nameof(pattern));
        }

        protected override bool IsValueValid(object value, ValidationContext validationContext)
        {
            if (value == null || !(value is string stringValue))
                return true;

            return string.IsNullOrEmpty(stringValue) || Regex.IsMatch(stringValue, Pattern);
        }
    }

    /// <summary>
    /// Regex validation attribute
    /// </summary>
    public class OrdValidateRegexAttributeBase : OrdRegexValidationAttributeBase
    {
        public OrdValidateRegexAttributeBase(string pattern) : base(pattern, "invalid_regex") { }
    }

    /// <summary>
    /// Username validation attribute
    /// </summary>
    public class OrdValidateUserNameAttributeBase : OrdRegexValidationAttributeBase
    {
        public OrdValidateUserNameAttributeBase() : base(RegexPatternConst.UserNameRegex, "invalid_username") { }
    }

    /// <summary>
    /// Password validation attribute
    /// </summary>
    public class OrdValidatePasswordAttributeBase : OrdRegexValidationAttributeBase
    {
        public OrdValidatePasswordAttributeBase() : base(RegexPatternConst.PasswordRegex, "invalid_password") { }
    }

    /// <summary>
    /// Email validation attribute
    /// </summary>
    public class OrdValidEmailAttributeBase : OrdRegexValidationAttributeBase
    {
        public OrdValidEmailAttributeBase() : base(RegexPatternConst.Email, "invalid_email") { }
    }
}
