namespace Ord.Plugin.Contract.Dtos
{
    public class JwtDto
    {
        public string AccessToken { get; set; }
        public int ExpireInSeconds { get; set; }
        public string RefreshToken { get; set; }
    }
}
