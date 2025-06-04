using System.Collections;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Ord.Plugin.Core.Middlewares;

/// <summary>
/// Trim toàn bộ chuỗi string trong input của controller.
/// </summary>
public class TrimStringsActionFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var keys = context.ActionArguments.Keys.ToList();

        foreach (var key in keys)
        {
            var value = context.ActionArguments[key];
            if (value == null) continue;

            // Nếu là string đơn giản
            if (value is string str)
            {
                context.ActionArguments[key] = str.Trim();
            }
            else
            {
                TrimStrings(value);
            }
        }

        await next();
    }

    private void TrimStrings(object obj)
    {
        if (obj == null) return;

        var type = obj.GetType();

        // Nếu là IEnumerable (List<string>, string[], List<object>...)
        if (typeof(IEnumerable).IsAssignableFrom(type) && type != typeof(string))
        {
            foreach (var item in (IEnumerable)obj)
            {
                TrimStrings(item);
            }

            return;
        }

        // Duyệt các property có thể đọc và ghi
        var props = type.GetProperties(BindingFlags.Instance | BindingFlags.Public)
            .Where(p => p.CanRead && p.CanWrite);

        foreach (var prop in props)
        {
            var propType = prop.PropertyType;
            var value = prop.GetValue(obj);

            if (value == null) continue;

            if (propType == typeof(string))
            {
                prop.SetValue(obj, ((string)value).Trim());
            }
            else if (typeof(IEnumerable).IsAssignableFrom(propType) && propType != typeof(string))
            {
                foreach (var item in (IEnumerable)value)
                {
                    TrimStrings(item);
                }
            }
            else if (!propType.IsPrimitive && !propType.IsEnum)
            {
                TrimStrings(value); // Đệ quy với object phức hợp
            }
        }
    }
}