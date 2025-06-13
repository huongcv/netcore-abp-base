using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Localization;
using Ord.Plugin.HostBase.Localization;
using System.Globalization;


namespace Ord.Plugin.HostBase.Configurations
{
    public static class LanguageConfiguration
    {
        public static void AddLanguageLocalization(this IServiceCollection services)
        {
            services.AddSingleton<IOrdLocalizer, OrdLocalizer>();
            services.AddSingleton<ILocalizationPreloader, LocalizationPreloader>();
            services.AddHostedService<LocalizationPreloadHostedService>();
            services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[] { "vi", "en" };
                // Đặt tiếng Việt làm mặc định
                options.DefaultRequestCulture = new RequestCulture("vi");
                options.SupportedCultures = supportedCultures.Select(c => new CultureInfo(c)).ToList();
                options.SupportedUICultures = supportedCultures.Select(c => new CultureInfo(c)).ToList();

                // Fallback về tiếng Việt nếu không tìm thấy culture
                options.FallBackToParentCultures = true;
                options.FallBackToParentUICultures = true;

                // Thêm providers để detect culture (ưu tiên theo thứ tự)
                options.RequestCultureProviders.Clear();
                options.RequestCultureProviders.Add(new QueryStringRequestCultureProvider()); // ?culture=en
                options.RequestCultureProviders.Add(new CookieRequestCultureProvider());      // Cookie
                options.RequestCultureProviders.Add(new AcceptLanguageHeaderRequestCultureProvider()); // Browser language
            });
        }
    }
}
