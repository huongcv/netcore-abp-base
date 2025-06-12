using System.Text.Json;
using System.Text.Json.Serialization;

namespace Ord.Plugin.Contract.Utils
{
    public static class JsonExtensions
    {
        /// <summary>Converts given object to JSON string.</summary>
        public static string ToJsonString(this object obj, bool camelCase = false, bool indented = false)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = camelCase ? JsonNamingPolicy.CamelCase : null,
                WriteIndented = indented,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            return obj == null ? null : JsonSerializer.Serialize(obj, options);
        }

        /// <summary>
        /// Converts given object to JSON string using custom <see cref="T:System.Text.Json.JsonSerializerOptions" />.
        /// </summary>
        public static string ToJsonString(this object obj, JsonSerializerOptions options)
        {
            return obj == null ? null : JsonSerializer.Serialize(obj, options);
        }

        /// <summary>
        /// Returns deserialized string using default options.
        /// </summary>
        public static T FromJsonString<T>(this string value)
        {
            return value == null ? default : JsonSerializer.Deserialize<T>(value);
        }

        /// <summary>
        /// Returns deserialized string using custom options.
        /// </summary>
        public static T FromJsonString<T>(this string value, JsonSerializerOptions options)
        {
            return value == null ? default : JsonSerializer.Deserialize<T>(value, options);
        }

        /// <summary>
        /// Returns deserialized string using explicit <see cref="T:System.Type" />.
        /// Note: System.Text.Json does not support deserialization with Type directly.
        /// </summary>
        public static object FromJsonString(this string value, Type type, JsonSerializerOptions options = null)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            return value == null ? null : JsonSerializer.Deserialize(value, type, options ?? new JsonSerializerOptions());
        }
    }
}
