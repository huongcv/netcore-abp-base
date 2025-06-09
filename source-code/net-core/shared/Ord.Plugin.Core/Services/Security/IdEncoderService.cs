using Newtonsoft.Json;
using Ord.Plugin.Contract.Exceptions;
using Ord.Plugin.Contract.Services.Security;
using System.Text;
using Volo.Abp.Security.Encryption;

namespace Ord.Plugin.Core.Services.Security
{
    public class IdEncoderService<TEntity, TKey>(IStringEncryptionService stringEncryptionService) : IIdEncoderService<TEntity, TKey>
        where TEntity : class
    {
        private readonly string _entityType = typeof(TEntity).Name;

        public string? EncodeId(TKey id)
        {
            if (id == null)
            {
                return null;
            }

            try
            {
                var payload = new IdPayload<TKey>
                {
                    EntityType = _entityType,
                    Id = id
                };

                var jsonString = JsonConvert.SerializeObject(payload);
                var encrypted = stringEncryptionService.Encrypt(jsonString);

                // Base64 URL-safe encoding
                return Base64UrlEncode(encrypted);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to encode ID for entity '{_entityType}': {ex.Message}", ex);
            }
        }

        public TKey DecodeId(string encodedId)
        {
            if (string.IsNullOrEmpty(encodedId))
                return default;

            try
            {
                // Base64 URL-safe decoding
                var encrypted = Base64UrlDecode(encodedId);

                var decryptedJson = stringEncryptionService.Decrypt(encrypted);
                var payload = JsonConvert.DeserializeObject<IdPayload<TKey>>(decryptedJson);

                if (payload.EntityType != _entityType)
                {
                    throw new IdDecodeException(encodedId, _entityType);
                }

                var id =  payload.Id;
                var encodedIdCheck = EncodeId(id);
                if (!string.Equals(encodedId, encodedIdCheck))
                {
                    throw new IdDecodeException(encodedId, _entityType);
                }
                return id;
            }
            catch (Exception ex)
            {
                throw new IdDecodeException(encodedId, _entityType);
            }
        }

        public bool TryDecodeId(string encodedId, out TKey id)
        {
            id = default;
            try
            {
                id = DecodeId(encodedId);
                return true;
            }
            catch
            {
                return false;
            }
        }
        private class IdPayload<T>
        {
            [JsonProperty("e")]
            public string EntityType { get; set; }
            [JsonProperty("i")]
            public T Id { get; set; }
        }

        private static string Base64UrlEncode(string input)
        {
            var bytes = Encoding.UTF8.GetBytes(input);
            return Convert.ToBase64String(bytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "");
        }

        private static string Base64UrlDecode(string input)
        {
            string base64 = input.Replace("-", "+").Replace("_", "/");
            int mod4 = base64.Length % 4;
            if (mod4 > 0)
            {
                base64 += new string('=', 4 - mod4);
            }

            byte[] bytes;
            try
            {
                bytes = Convert.FromBase64String(base64);
            }
            catch (FormatException ex)
            {
                throw new FormatException("Base64 string is not valid.", ex);
            }

            return Encoding.UTF8.GetString(bytes);
        }
    }
}
