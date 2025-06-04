namespace Ord.Plugin.Contract.Configurations
{
    public class TokenAuthConfiguration
    {
        public string SecurityKey { get; set; }
        public string SecurityAlgorithm { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }

       // public SigningCredentials SigningCredentials { get; set; }
       public int TimeLifeTokenSeconds { get; set; }

        public TimeSpan AccessTokenExpiration { get; set; }
    }
}
