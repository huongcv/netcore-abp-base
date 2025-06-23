using Microsoft.AspNetCore.Http;

namespace Ord.Plugin.Auth.Middlewares
{
    public class RefreshTokenCookieMiddleware
    {
        private readonly RequestDelegate _next;

        public RefreshTokenCookieMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Chỉ can thiệp với endpoint refresh-token
            if (context.Request.Path.StartsWithSegments("/api/auth/refresh-token", StringComparison.OrdinalIgnoreCase)
                && context.Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase))
            {
                // Lấy refresh_token từ cookie nếu có
                if (context.Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
                {
                    // Lưu vào Items để controller hoặc model binder có thể lấy ra dùng
                    context.Items["RefreshTokenFromCookie"] = refreshToken;
                }
            }

            await _next(context);
        }
    }
}