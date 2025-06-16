using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.RegularExpressions;

namespace Ord.Plugin.Contract.Utils
{
    public static class StringUtil
    {
        public static string ConvertToFts(this string s)
        {
            if (string.IsNullOrEmpty(s))
            {
                return s;
            }

            var strBuild = new StringBuilder();
            strBuild.Append(s.ConvertToUnsign());
            if (strBuild.Length == 0)
            {
                return strBuild.ToString();
            }

            return strBuild.ToString()
                .Trim()
                .ToLower()
                .RemoveMultiSpace();
        }

        public static string ConvertToUnsign(this string s)
        {
            if (string.IsNullOrEmpty(s)) return s;
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            return regex.Replace(s.Normalize(NormalizationForm.FormD),
                    String.Empty).Replace('\u0111', 'd')
                .Replace('\u0110', 'D');
        }

        public static string RemoveMultiSpace(this string s)
        {
            return string.IsNullOrEmpty(s) ? s : Regex.Replace(s.Trim(), @"\s+", " ");
        }

        public static string LikeTextSearch(this string s)
        {
            if (string.IsNullOrEmpty(s)) return s;
            if (string.IsNullOrWhiteSpace(s)) return s;

            return $"%{s.ConvertToFts()}%";
        }

        public static string GetMimeType(this string fileName)
        {
            var extension = System.IO.Path.GetExtension(fileName).ToLower();
            return FileExtensionMapping.Mappings.TryGetValue(extension, out var mimeType)
                ? mimeType
                : "application/octet-stream";
        }

        public static bool IsValidEmail(string source)
        {
            return new EmailAddressAttribute().IsValid(source);
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        public static bool HasUnicodeCharacter(string input)
        {
            const int MaxASCIICode = 127;

            return input.Any(c => c > MaxASCIICode);
        }

        public static bool CompareStringFts(string? a, string? b)
        {
            if (string.IsNullOrEmpty(a) || string.IsNullOrEmpty(b)) return false;
            return string.Equals(a.ConvertToFts(), b.ConvertToFts(), StringComparison.OrdinalIgnoreCase);
        }

        #region String Localized

        /// <summary>
        /// tự động cộng thêm để dịch đa ngữ trong file field.json
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static string? AddPrefixForFieldNameLocalized(string? name)
        {
            if (!string.IsNullOrEmpty(name) && !name.StartsWith("field"))
            {
                return  "field." + name; // Thêm prefix cho localization
            }

            return name;
        }
        #endregion
    }
}