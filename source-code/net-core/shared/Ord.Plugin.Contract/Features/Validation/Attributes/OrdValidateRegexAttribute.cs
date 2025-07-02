using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Repositories;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

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
        : OrdRegexValidationAttributeBase(RegexPatternConst.PasswordRegex, "invalid_password")
    {

        protected override bool IsValueValid(object value, ValidationContext validationContext)
        {
            var validPwd = base.IsValueValid(value, validationContext);
            if (!validPwd)
            {
                return validPwd;
            }
            if (value is string stringValue)
            {
                var inBlacklisted = AsyncHelper.RunSync(() => CheckInBlackList(validationContext, stringValue));
                if (inBlacklisted)
                {
                    ErrorMessage = ValidationMessages.Prefix + "not_blacklisted_password";
                    return false;
                }
            }
            return validPwd;
        }

        protected async Task<bool> CheckInBlackList(ValidationContext validationContext, string stringValue)
        {

            var uowManager = validationContext.GetRequiredService<IUnitOfWorkManager>();
            using var uow = uowManager.Begin();
            var blackList = validationContext.GetRequiredService<IBlacklistedRepository>();
            var blackListValue = await blackList.GetPasswordAsync(stringValue);
            await uow.CompleteAsync();
            return string.Equals(blackListValue, stringValue);
        }
    }

    /// <summary>
    /// Email validation attribute
    /// </summary>
    public class OrdValidEmailAttribute() : OrdRegexValidationAttributeBase(RegexPatternConst.Email, "invalid_email");
    public class OrdValidPhoneNumberVietNamAttribute() : OrdRegexValidationAttributeBase(RegexPatternConst.PhoneNumberVietNam, "invalid_phone_vn");
}