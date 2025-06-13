using System.Security.Cryptography;
using System.Text;

namespace Ord.Plugin.Contract.Utils
{
    public static class SecurityHelper
    {
        public static string Sha256(string input)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(input);
            var hashBytes = sha256.ComputeHash(bytes);
            var sb = new StringBuilder();
            foreach (var b in hashBytes)
                sb.Append(b.ToString("x2"));
            return sb.ToString();
        }

    }
}
