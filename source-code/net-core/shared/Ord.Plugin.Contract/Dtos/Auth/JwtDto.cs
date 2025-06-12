using System.Text.Json.Serialization;

namespace Ord.Plugin.Contract.Dtos
{
    public class JwtDto
    {
        public string AccessToken { get; set; }
        public int ExpireInSeconds { get; set; }
        public string RefreshToken { get; set; }
        [JsonIgnore]
        public Guid UserId { get; set; }
        [JsonIgnore]
        public Guid? TenantId { get; set; }
    }
}
