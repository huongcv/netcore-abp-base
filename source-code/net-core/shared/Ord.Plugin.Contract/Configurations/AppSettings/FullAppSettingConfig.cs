using Microsoft.Extensions.DependencyInjection;

namespace Ord.Plugin.Contract.Configurations
{
    public sealed class FullAppSettingConfig
    {
        private static FullAppSettingConfig _instance;

        public static FullAppSettingConfig GetInstance()
        {
            return _instance;
        }
        public static FullAppSettingConfig GetInstance(IServiceProvider service)
        {
            if (_instance == null)
            {
                _instance = new FullAppSettingConfig()
                {
                    App = service.GetService<AppSettings>(),
                    Authentication = service.GetService<AuthenticationSettings>(),
                };
            }
            return _instance;
        }
       public AppSettings App { get; set; }
       public AuthenticationSettings Authentication { get; set; }
    }
    public class AppSettings
    {
        public string Name { get; set; }
        public bool IsMariaDb { get; set; }
    }

    public class AuthenticationSettings
    {
        public bool IsPasswordChangeMiddleware { get; set; }
        public bool IsCheckRevokeToken { get; set; }
        public JwtBearerSetting JwtBearer { get; set; }

        public class JwtBearerSetting
        {
            public string Issuer { get; set; }
            public string Audience { get; set; }
            public string SecurityKey { get; set; }
            public int TimeLifeTokenSeconds { get; set; }
        }
    }
}
