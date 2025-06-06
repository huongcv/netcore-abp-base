using Microsoft.Extensions.Localization;

namespace Ord
{
    public static class LocalizedUtil
    {
        public static string GetLocalizedMessage(this IStringLocalizer l, string key, params object[] formatArgs)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return string.Empty;
            }
            return formatArgs?.Length > 0
                ? l[key, formatArgs].Value
                : l[key].Value;
        }
    }
}
