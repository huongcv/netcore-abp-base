using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
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

        public static string RemoveUnicode(this string text)
        {
            string[] arr1 = new string[]
            {
                "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
                "đ",
                "é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ể", "ễ", "ệ",
                "í", "ì", "ỉ", "ĩ", "ị",
                "ó", "ò", "ỏ", "õ", "ọ", "ô", "ố", "ồ", "ổ", "ỗ", "ộ", "ơ", "ớ", "ờ", "ở", "ỡ", "ợ",
                "ú", "ù", "ủ", "ũ", "ụ", "ư", "ứ", "ừ", "ử", "ữ", "ự",
                "ý", "ỳ", "ỷ", "ỹ", "ỵ",
            };
            string[] arr2 = new string[]
            {
                "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
                "d",
                "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
                "i", "i", "i", "i", "i",
                "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o",
                "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u",
                "y", "y", "y", "y", "y",
            };
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }

            return text;
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

        public static string SHA512_ComputeHash(string text, string secretKey)
        {
            var hash = new StringBuilder();
            ;
            byte[] secretkeyBytes = Encoding.UTF8.GetBytes(secretKey);
            byte[] inputBytes = Encoding.UTF8.GetBytes(text);
            using (var hmac = new HMACSHA512(secretkeyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }

        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        public static string GenTickFromTimeNow()
        {
            return DateTime.Now.ToString("yyMMddHHmmssfff");
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

        public static string GetTransactionId(long invoiceId)
        {
            string idStr = invoiceId.ToString().PadLeft(16, '0');

            string part1 = idStr.Substring(0, 8);
            string part2 = idStr.Substring(8, 4);
            string part3 = idStr.Substring(12, 4);

            string timestamp = DateTime.Now.ToString("ddMMyyHHmmssffff"); 

            string part4 = timestamp.Substring(0, 4);
            string part5 = timestamp.Substring(4, 12);

            return $"{part1}-{part2}-{part3}-{part4}-{part5}";
        }
    }
}