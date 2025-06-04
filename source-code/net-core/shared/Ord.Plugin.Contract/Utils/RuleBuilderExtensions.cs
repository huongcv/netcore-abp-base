using FluentValidation;
using Ord.Plugin.Contract.Factories;
using System.Text.RegularExpressions;

namespace Ord.Plugin.Contract.Utils
{
    public static class RuleBuilderExtensions
    {
        public const string UserNameRegex = @"^[A-Za-z0-9][A-Za-z0-9_]{4,29}$";
        public const string PasswordRegex = @"^(?=.*[A-Z])^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$";
        public const string CodeRegex = @"^[a-zA-Z0-9_]*$";
        public static IRuleBuilderOptions<T, string> RegexWhenNotNullOrEmpty<T>(this IRuleBuilder<T, string> ruleBuilder, string regex)
        {
            var options = ruleBuilder
                .Must(u =>
                {
                    if (string.IsNullOrEmpty(u))
                    {
                        return true;
                    }
                    var match = Regex.Match(u, regex, RegexOptions.IgnoreCase);
                    return match.Success;
                });
            return options;
        }
        public static IRuleBuilderOptions<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder, IAppFactory appFactory)
        {
            var defaultPasswordRegex = appFactory.Configuration["Validate:PasswordRegex"] ?? PasswordRegex;
            return RegexWhenNotNullOrEmpty(ruleBuilder, defaultPasswordRegex).WithMessage("invalid_password");
        }
        public static IRuleBuilderOptions<T, string> UserName<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return RegexWhenNotNullOrEmpty(ruleBuilder, UserNameRegex).WithMessage("invalid_username");
        }
        public static IRuleBuilderOptions<T, string> MustNotNullOrEmpty<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .Must(u => !string.IsNullOrEmpty(u) && !string.IsNullOrWhiteSpace(u)).WithMessage("not_null");
            return options;
        }
    }
}
