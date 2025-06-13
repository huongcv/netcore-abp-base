using Microsoft.Extensions.Configuration;

namespace Ord
{
    public static class ConfigurationUtil
    {
        public static bool TryParseBoolValue(this IConfiguration configuration,string keyName)
        {
            if (bool.TryParse(configuration[keyName], out var isEnabled) && isEnabled)
            {
                return true;
            }
            return false;
        }
    }
}
