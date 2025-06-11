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
    public class OrdValidateRegexAttribute(string pattern) : OrdRegexValidationAttributeBase(pattern, "invalid_regex");

    /// <summary>
    /// Username validation attribute
    /// </summary>
    public class OrdValidateUserNameAttribute()
        : OrdRegexValidationAttributeBase(RegexPatternConst.UserNameRegex, "invalid_username");

    /// <summary>
    /// Password validation attribute
    /// </summary>
    public class OrdValidatePasswordAttribute()
        : OrdRegexValidationAttributeBase(RegexPatternConst.PasswordRegex, "invalid_password");

    /// <summary>
    /// Email validation attribute
    /// </summary>
    public class OrdValidEmailAttribute() : OrdRegexValidationAttributeBase(RegexPatternConst.Email, "invalid_email");
    public class OrdValidPhoneNumberVietNamAttribute() : OrdRegexValidationAttributeBase(RegexPatternConst.PhoneNumberVietNam, "invalid_phone_vn");
}