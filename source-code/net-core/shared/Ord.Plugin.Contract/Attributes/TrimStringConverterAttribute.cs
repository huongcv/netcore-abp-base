using System.Text.Json;
using System.Text.Json.Serialization;


namespace Ord.Plugin.Contract.Attributes
{/// <summary>
    /// Attribute để disable trim cho property hoặc class
    /// </summary>
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Class | AttributeTargets.Parameter)]
    public class NoTrimAttribute : Attribute
    {
    }

    /// <summary>
    /// Attribute để chỉ định trim condition cho property
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class TrimConditionAttribute : Attribute
    {
        public bool TrimWhiteSpace { get; set; } = true;
        public bool TrimStart { get; set; } = true;
        public bool TrimEnd { get; set; } = true;
        public string? CustomTrimChars { get; set; }

        public TrimConditionAttribute() { }

        public TrimConditionAttribute(bool trimWhiteSpace = true, bool trimStart = true, bool trimEnd = true)
        {
            TrimWhiteSpace = trimWhiteSpace;
            TrimStart = trimStart;
            TrimEnd = trimEnd;
        }
    }

    public class TrimStringConverterAttribute : JsonConverter<string>
    {
        public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.TokenType == JsonTokenType.Null ? string.Empty : reader.GetString()?.Trim() ?? string.Empty;
        }

        public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value?.Trim() ?? string.Empty);
        }
    }

}
