using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.RegularExpressions;

namespace DigitalSignature
{
    public static class CertificateConverter
    {
        /// <summary>
        /// Chuyển đổi string Base64 certificate sang X509Certificate2
        /// </summary>
        /// <param name="certBase64">Certificate dạng Base64 string</param>
        /// <returns>X509Certificate2 object</returns>
        public static X509Certificate2 ConvertBase64ToCertificate(string certBase64)
        {
            if (string.IsNullOrEmpty(certBase64))
            {
                throw new ArgumentException("Certificate Base64 string cannot be null or empty");
            }

            try
            {
                // Clean base64 string
                string cleanBase64 = CleanBase64String(certBase64);

                // Convert to byte array
                byte[] certBytes = Convert.FromBase64String(cleanBase64);

                // Create X509Certificate2
                X509Certificate2 certificate = new X509Certificate2(certBytes);

                return certificate;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error converting Base64 to X509Certificate2: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Chuyển đổi PEM format certificate sang X509Certificate2
        /// </summary>
        /// <param name="pemCert">Certificate dạng PEM string</param>
        /// <returns>X509Certificate2 object</returns>
        public static X509Certificate2 ConvertPemToCertificate(string pemCert)
        {
            if (string.IsNullOrEmpty(pemCert))
            {
                throw new ArgumentException("PEM certificate string cannot be null or empty");
            }

            try
            {
                // Check if it's PEM format
                if (!pemCert.Contains("-----BEGIN CERTIFICATE-----"))
                {
                    // Not PEM format, try as base64
                    return ConvertBase64ToCertificate(pemCert);
                }

                // Extract base64 from PEM
                string base64 = ExtractBase64FromPem(pemCert);

                // Convert to certificate
                return ConvertBase64ToCertificate(base64);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error converting PEM to X509Certificate2: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Tự động phát hiện format và chuyển đổi sang X509Certificate2
        /// </summary>
        /// <param name="certString">Certificate string (Base64 hoặc PEM)</param>
        /// <returns>X509Certificate2 object</returns>
        public static X509Certificate2 ConvertStringToCertificate(string certString)
        {
            if (string.IsNullOrEmpty(certString))
            {
                throw new ArgumentException("Certificate string cannot be null or empty");
            }

            try
            {
                // Detect format
                if (certString.Contains("-----BEGIN CERTIFICATE-----"))
                {
                    // PEM format
                    return ConvertPemToCertificate(certString);
                }
                else
                {
                    // Assume Base64 format
                    return ConvertBase64ToCertificate(certString);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error converting certificate string: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Chuyển đổi X509Certificate2 sang Base64 string
        /// </summary>
        /// <param name="certificate">X509Certificate2 object</param>
        /// <returns>Base64 string</returns>
        public static string ConvertCertificateToBase64(X509Certificate2 certificate)
        {
            if (certificate == null)
            {
                throw new ArgumentNullException(nameof(certificate));
            }

            try
            {
                byte[] certBytes = certificate.RawData;
                return Convert.ToBase64String(certBytes);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error converting X509Certificate2 to Base64: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Chuyển đổi X509Certificate2 sang PEM format
        /// </summary>
        /// <param name="certificate">X509Certificate2 object</param>
        /// <returns>PEM format string</returns>
        public static string ConvertCertificateToPem(X509Certificate2 certificate)
        {
            if (certificate == null)
            {
                throw new ArgumentNullException(nameof(certificate));
            }

            try
            {
                string base64 = ConvertCertificateToBase64(certificate);
                return FormatAsPem(base64);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error converting X509Certificate2 to PEM: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Lấy thông tin chi tiết của certificate
        /// </summary>
        /// <param name="certBase64">Certificate Base64 string</param>
        /// <returns>Certificate information</returns>
        public static CertificateInfo GetCertificateInfo(string certBase64)
        {
            try
            {
                X509Certificate2 cert = ConvertStringToCertificate(certBase64);
                return new CertificateInfo
                {
                    SerialNumber = cert.SerialNumber,
                    Subject = cert.Subject,
                    Issuer = cert.Issuer,
                    NotBefore = cert.NotBefore,
                    NotAfter = cert.NotAfter,
                    HasPrivateKey = cert.HasPrivateKey,
                    KeyAlgorithm = cert.GetKeyAlgorithm(),
                    SignatureAlgorithm = cert.SignatureAlgorithm.FriendlyName,
                    Thumbprint = cert.Thumbprint,
                    Version = cert.Version
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting certificate info: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Validate certificate format
        /// </summary>
        /// <param name="certString">Certificate string</param>
        /// <returns>Validation result</returns>
        public static ValidationResult ValidateCertificateFormat(string certString)
        {
            var result = new ValidationResult();

            if (string.IsNullOrEmpty(certString))
            {
                result.IsValid = false;
                result.Errors.Add("Certificate string is null or empty");
                return result;
            }

            try
            {
                X509Certificate2 cert = ConvertStringToCertificate(certString);

                // Check if certificate is valid
                if (cert == null)
                {
                    result.IsValid = false;
                    result.Errors.Add("Cannot create certificate from string");
                    return result;
                }

                // Check validity period
                DateTime now = DateTime.Now;
                if (now < cert.NotBefore)
                {
                    result.Errors.Add("Certificate is not yet valid");
                }

                if (now > cert.NotAfter)
                {
                    result.Errors.Add("Certificate has expired");
                }

                // Check if certificate has required fields
                if (string.IsNullOrEmpty(cert.Subject))
                {
                    result.Errors.Add("Certificate subject is empty");
                }

                if (string.IsNullOrEmpty(cert.SerialNumber))
                {
                    result.Errors.Add("Certificate serial number is empty");
                }

                result.IsValid = result.Errors.Count == 0;
                result.CertificateInfo = GetCertificateInfo(certString);
            }
            catch (Exception ex)
            {
                result.IsValid = false;
                result.Errors.Add($"Error validating certificate: {ex.Message}");
            }

            return result;
        }

        #region Private Helper Methods

        /// <summary>
        /// Clean Base64 string by removing whitespace and line breaks
        /// </summary>
        /// <param name="base64String">Raw base64 string</param>
        /// <returns>Clean base64 string</returns>
        private static string CleanBase64String(string base64String)
        {
            if (string.IsNullOrEmpty(base64String))
                return string.Empty;

            // Remove all whitespace characters
            return Regex.Replace(base64String, @"\s", "");
        }

        /// <summary>
        /// Extract base64 content from PEM format
        /// </summary>
        /// <param name="pemCert">PEM certificate string</param>
        /// <returns>Base64 string</returns>
        private static string ExtractBase64FromPem(string pemCert)
        {
            const string beginCert = "-----BEGIN CERTIFICATE-----";
            const string endCert = "-----END CERTIFICATE-----";

            int beginIndex = pemCert.IndexOf(beginCert);
            int endIndex = pemCert.IndexOf(endCert);

            if (beginIndex == -1 || endIndex == -1)
            {
                throw new ArgumentException("Invalid PEM format: missing BEGIN/END markers");
            }

            beginIndex += beginCert.Length;
            string base64Content = pemCert.Substring(beginIndex, endIndex - beginIndex);

            // Clean the base64 string
            return CleanBase64String(base64Content);
        }

        /// <summary>
        /// Format base64 string as PEM
        /// </summary>
        /// <param name="base64String">Base64 string</param>
        /// <returns>PEM formatted string</returns>
        private static string FormatAsPem(string base64String)
        {
            const int lineLength = 64;
            StringBuilder pem = new StringBuilder();

            pem.AppendLine("-----BEGIN CERTIFICATE-----");

            for (int i = 0; i < base64String.Length; i += lineLength)
            {
                int length = Math.Min(lineLength, base64String.Length - i);
                pem.AppendLine(base64String.Substring(i, length));
            }

            pem.AppendLine("-----END CERTIFICATE-----");

            return pem.ToString();
        }

        #endregion
    }

    /// <summary>
    /// Certificate information class
    /// </summary>
    public class CertificateInfo
    {
        public string SerialNumber { get; set; }
        public string Subject { get; set; }
        public string Issuer { get; set; }
        public DateTime NotBefore { get; set; }
        public DateTime NotAfter { get; set; }
        public bool HasPrivateKey { get; set; }
        public string KeyAlgorithm { get; set; }
        public string SignatureAlgorithm { get; set; }
        public string Thumbprint { get; set; }
        public int Version { get; set; }
    }

    /// <summary>
    /// Validation result class
    /// </summary>
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
        public CertificateInfo CertificateInfo { get; set; }
    }

    /// <summary>
    /// Extension methods for X509Certificate2
    /// </summary>
    public static class X509Certificate2Extensions
    {
        /// <summary>
        /// Convert X509Certificate2 to Base64 string
        /// </summary>
        /// <param name="certificate">X509Certificate2 object</param>
        /// <returns>Base64 string</returns>
        public static string ToBase64String(this X509Certificate2 certificate)
        {
            return CertificateConverter.ConvertCertificateToBase64(certificate);
        }

        /// <summary>
        /// Convert X509Certificate2 to PEM format
        /// </summary>
        /// <param name="certificate">X509Certificate2 object</param>
        /// <returns>PEM format string</returns>
        public static string ToPemString(this X509Certificate2 certificate)
        {
            return CertificateConverter.ConvertCertificateToPem(certificate);
        }

        /// <summary>
        /// Get formatted serial number
        /// </summary>
        /// <param name="certificate">X509Certificate2 object</param>
        /// <param name="format">Format type (colon, hyphen, space, plain)</param>
        /// <returns>Formatted serial number</returns>
        public static string GetFormattedSerialNumber(this X509Certificate2 certificate, string format = "plain")
        {
            string serial = certificate.SerialNumber;

            switch (format.ToLower())
            {
                case "colon":
                    return Regex.Replace(serial, "(.{2})", "$1:").TrimEnd(':');
                case "hyphen":
                    return Regex.Replace(serial, "(.{2})", "$1-").TrimEnd('-');
                case "space":
                    return Regex.Replace(serial, "(.{2})", "$1 ").TrimEnd();
                default:
                    return serial;
            }
        }

        /// <summary>
        /// Check if certificate is currently valid
        /// </summary>
        /// <param name="certificate">X509Certificate2 object</param>
        /// <returns>True if valid, false otherwise</returns>
        public static bool IsCurrentlyValid(this X509Certificate2 certificate)
        {
            DateTime now = DateTime.Now;
            return now >= certificate.NotBefore && now <= certificate.NotAfter;
        }
    }
}