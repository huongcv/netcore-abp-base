using System.Globalization;
using Microsoft.AspNetCore.Http;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Middlewares
{
    public class LanguageMiddleware : ITransientDependency
    {
        private readonly RequestDelegate _next;

        public LanguageMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var currentLang = context.Request.Headers.AcceptLanguage.ToString();
            CultureInfo culture;

            try
            {
                culture = CultureInfo.GetCultureInfo(currentLang);
            }
            catch (CultureNotFoundException)
            {
                // Mặc định là tiếng Việt khi không tìm thấy culture
                culture = CultureInfo.GetCultureInfo("vi-VN");
            }

            // Kiểm tra nếu currentLang rỗng hoặc null thì cũng dùng tiếng Việt
            if (string.IsNullOrEmpty(currentLang))
            {
                culture = CultureInfo.GetCultureInfo("vi-VN");
            }

            if (culture != null && !string.IsNullOrEmpty(culture.Name))
            {
                Thread.CurrentThread.CurrentUICulture = culture;
                Thread.CurrentThread.CurrentCulture = culture; // Thêm dòng này cho format số, ngày tháng
            }

            await _next(context);
        }
    }
}