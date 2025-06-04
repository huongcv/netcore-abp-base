using Newtonsoft.Json;

namespace Ord.Plugin.Core.Utils
{
    public class OrdUtil
    {
        public static List<string> GetPropertyNames<T>()
        {
            var columns = new List<string>();
            var props = typeof(T).GetProperties();
            foreach (var prop in props)
            {
                columns.Add(prop.Name);
            }
            return columns;
        }
        public static List<string> GetPropertyNames(object data)
        {
            var columns = new List<string>();
            foreach (var prop in data.GetType().GetProperties())
            {
                columns.Add(prop.Name);
            }
            return columns;
        }

        public static T ParserValue<T>(string value, T defaultValue = default(T))
        {
            return (T)ParserValue(value, defaultValue);
        }
        private static object ParserObject<T>(string value, T defaultValue = default(T))
        {
            if (string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }
            var targetType = typeof(T);
            if (targetType == typeof(int))
            {
                if (int.TryParse(value, out int intValue))
                    return intValue;
                else
                    return defaultValue;
            }
            else if (targetType == typeof(bool))
            {
                if (bool.TryParse(value, out bool output))
                    return output;
                else
                    return defaultValue;
            }
            else if (targetType == typeof(long))
            {
                if (long.TryParse(value, out long output))
                    return output;
                else
                    return defaultValue;
            }
            else if (targetType == typeof(float))
            {
                if (float.TryParse(value, out float floatValue))
                    return floatValue;
                else
                    return defaultValue;
            }
            else if (targetType == typeof(string))
            {
                return value;
            }
            else
            {
                return JsonConvert.DeserializeObject<T>(value);
            }
            return defaultValue;
        }
    }
}
