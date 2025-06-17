using Microsoft.AspNetCore.Mvc.Filters;
using Ord.Plugin.Contract.Attributes;
using System.Collections;
using System.Collections.Concurrent;
using System.Reflection;

namespace Ord.Plugin.HostBase.Filters;


/// <summary>
/// Trim toàn bộ chuỗi string trong input của controller với hiệu suất tối ưu.
/// Hỗ trợ disable trim thông qua NoTrimAttribute và custom trim qua TrimConditionAttribute.
/// </summary>
public class TrimStringActionFilter : IAsyncActionFilter
{
    // Cache PropertyInfo để tránh reflection nhiều lần
    private static readonly ConcurrentDictionary<Type, PropertyInfo[]> PropertyCache = new();

    // Cache NoTrim attributes
    private static readonly ConcurrentDictionary<Type, bool> NoTrimTypeCache = new();
    private static readonly ConcurrentDictionary<PropertyInfo, bool> NoTrimPropertyCache = new();
    private static readonly ConcurrentDictionary<PropertyInfo, TrimConditionAttribute?> TrimConditionCache = new();

    // Các type không cần xử lý
    private static readonly HashSet<Type> IgnoredTypes = new()
    {
        typeof(DateTime), typeof(DateTimeOffset), typeof(TimeSpan),
        typeof(Guid), typeof(decimal), typeof(bool),
        typeof(byte), typeof(sbyte), typeof(short), typeof(ushort),
        typeof(int), typeof(uint), typeof(long), typeof(ulong),
        typeof(float), typeof(double), typeof(char)
    };

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var visitedObjects = new HashSet<object>(ReferenceEqualityComparer.Instance);

        var keys = context.ActionArguments.Keys.ToList();
        foreach (var key in keys)
        {
            var value = context.ActionArguments[key];
            if (value != null)
            {
                // Check if parameter has NoTrim attribute
                var parameterInfo = GetParameterInfo(context, key);
                if (parameterInfo?.GetCustomAttribute<NoTrimAttribute>() != null)
                {
                    continue; // Skip trimming for this parameter
                }

                var trimmedValue = TrimValue(value, visitedObjects);
                if (trimmedValue != value)
                {
                    context.ActionArguments[key] = trimmedValue;
                }
            }
        }

        await next();
    }

    private ParameterInfo? GetParameterInfo(ActionExecutingContext context, string parameterName)
    {
        var actionDescriptor = context.ActionDescriptor as Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor;
        return actionDescriptor?.MethodInfo.GetParameters()
            .FirstOrDefault(p => p.Name == parameterName);
    }

    private object TrimValue(object obj, HashSet<object> visitedObjects)
    {
        if (obj == null) return null;

        var type = obj.GetType();

        // Check if type has NoTrim attribute
        if (HasNoTrimAttribute(type))
        {
            return obj;
        }

        // Nếu là string, trim trực tiếp
        if (type == typeof(string))
        {
            return TrimString((string)obj);
        }

        // Kiểm tra circular reference
        if (!type.IsValueType && visitedObjects.Contains(obj))
        {
            return obj;
        }

        // Thêm vào visited để tránh circular reference
        if (!type.IsValueType)
        {
            visitedObjects.Add(obj);
        }

        try
        {
            // Xử lý các type đặc biệt
            if (ShouldIgnoreType(type))
            {
                return obj;
            }

            // Xử lý Nullable types
            if (IsNullable(type))
            {
                return obj; // Nullable value types không cần trim
            }

            // Xử lý Array
            if (type.IsArray && type.GetElementType() != null)
            {
                return TrimArray((Array)obj, visitedObjects);
            }

            // Xử lý List<T>
            if (IsGenericList(type))
            {
                return TrimList(obj, visitedObjects);
            }

            // Xử lý Dictionary
            if (IsGenericDictionary(type))
            {
                TrimDictionary(obj, visitedObjects);
                return obj;
            }

            // Xử lý IEnumerable khác (nhưng không modify được)
            if (typeof(IEnumerable).IsAssignableFrom(type))
            {
                TrimEnumerable(obj, visitedObjects);
                return obj;
            }

            // Xử lý object properties
            TrimObjectProperties(obj, visitedObjects);
            return obj;
        }
        finally
        {
            // Remove từ visited khi hoàn thành
            if (!type.IsValueType)
            {
                visitedObjects.Remove(obj);
            }
        }
    }

    private bool HasNoTrimAttribute(Type type)
    {
        return NoTrimTypeCache.GetOrAdd(type, t =>
            t.GetCustomAttribute<NoTrimAttribute>() != null);
    }

    private string TrimString(string str, TrimConditionAttribute? condition = null)
    {
        if (string.IsNullOrEmpty(str)) return str;

        condition ??= new TrimConditionAttribute();

        if (!condition.TrimWhiteSpace) return str;

        if (!string.IsNullOrEmpty(condition.CustomTrimChars))
        {
            var trimChars = condition.CustomTrimChars.ToCharArray();
            if (condition.TrimStart && condition.TrimEnd)
                return str.Trim(trimChars);
            else if (condition.TrimStart)
                return str.TrimStart(trimChars);
            else if (condition.TrimEnd)
                return str.TrimEnd(trimChars);
        }
        else
        {
            if (condition.TrimStart && condition.TrimEnd)
                return str.Trim();
            else if (condition.TrimStart)
                return str.TrimStart();
            else if (condition.TrimEnd)
                return str.TrimEnd();
        }

        return str;
    }

    private bool ShouldIgnoreType(Type type)
    {
        return type.IsPrimitive ||
               type.IsEnum ||
               IgnoredTypes.Contains(type) ||
               IgnoredTypes.Contains(Nullable.GetUnderlyingType(type));
    }

    private bool IsNullable(Type type)
    {
        return Nullable.GetUnderlyingType(type) != null;
    }

    private bool IsGenericList(Type type)
    {
        return type.IsGenericType &&
               (type.GetGenericTypeDefinition() == typeof(List<>) ||
                type.GetGenericTypeDefinition() == typeof(IList<>) ||
                typeof(IList).IsAssignableFrom(type));
    }

    private bool IsGenericDictionary(Type type)
    {
        return type.IsGenericType &&
               (type.GetGenericTypeDefinition() == typeof(Dictionary<,>) ||
                type.GetGenericTypeDefinition() == typeof(IDictionary<,>) ||
                typeof(IDictionary).IsAssignableFrom(type));
    }

    private Array TrimArray(Array array, HashSet<object> visitedObjects)
    {
        var elementType = array.GetType().GetElementType();
        if (elementType == typeof(string))
        {
            // Tối ưu cho string array
            var stringArray = (string[])array;
            for (int i = 0; i < stringArray.Length; i++)
            {
                if (stringArray[i] != null)
                {
                    stringArray[i] = TrimString(stringArray[i]);
                }
            }
        }
        else if (!ShouldIgnoreType(elementType) && !HasNoTrimAttribute(elementType))
        {
            // Xử lý array của objects
            for (int i = 0; i < array.Length; i++)
            {
                var item = array.GetValue(i);
                if (item != null)
                {
                    var trimmedItem = TrimValue(item, visitedObjects);
                    if (trimmedItem != item)
                    {
                        array.SetValue(trimmedItem, i);
                    }
                }
            }
        }
        return array;
    }

    private object TrimList(object list, HashSet<object> visitedObjects)
    {
        var listType = list.GetType();
        var genericArgs = listType.GetGenericArguments();

        if (genericArgs.Length == 1)
        {
            var elementType = genericArgs[0];

            if (elementType == typeof(string))
            {
                // Tối ưu cho List<string>
                var stringList = (IList<string>)list;
                for (int i = 0; i < stringList.Count; i++)
                {
                    if (stringList[i] != null)
                    {
                        stringList[i] = TrimString(stringList[i]);
                    }
                }
            }
            else if (!ShouldIgnoreType(elementType) && !HasNoTrimAttribute(elementType))
            {
                // Xử lý List<object>
                var ilist = (IList)list;
                for (int i = 0; i < ilist.Count; i++)
                {
                    var item = ilist[i];
                    if (item != null)
                    {
                        var trimmedItem = TrimValue(item, visitedObjects);
                        if (trimmedItem != item)
                        {
                            ilist[i] = trimmedItem;
                        }
                    }
                }
            }
        }

        return list;
    }

    private void TrimDictionary(object dictionary, HashSet<object> visitedObjects)
    {
        var dictType = dictionary.GetType();
        var genericArgs = dictType.GetGenericArguments();

        if (genericArgs.Length == 2)
        {
            var keyType = genericArgs[0];
            var valueType = genericArgs[1];

            // Chỉ xử lý value, không trim key
            if (valueType == typeof(string))
            {
                var stringDict = (IDictionary<object, string>)dictionary;
                var keys = stringDict.Keys.ToList();
                foreach (var key in keys)
                {
                    if (stringDict[key] != null)
                    {
                        stringDict[key] = TrimString(stringDict[key]);
                    }
                }
            }
            else if (!ShouldIgnoreType(valueType) && !HasNoTrimAttribute(valueType))
            {
                var dict = (IDictionary)dictionary;
                var keys = dict.Keys.Cast<object>().ToList();
                foreach (var key in keys)
                {
                    var value = dict[key];
                    if (value != null)
                    {
                        var trimmedValue = TrimValue(value, visitedObjects);
                        if (trimmedValue != value)
                        {
                            dict[key] = trimmedValue;
                        }
                    }
                }
            }
        }
    }

    private void TrimEnumerable(object enumerable, HashSet<object> visitedObjects)
    {
        // Chỉ đệ quy, không modify được
        foreach (var item in (IEnumerable)enumerable)
        {
            if (item != null)
            {
                TrimValue(item, visitedObjects);
            }
        }
    }

    private void TrimObjectProperties(object obj, HashSet<object> visitedObjects)
    {
        var type = obj.GetType();

        // Sử dụng cache để tránh reflection nhiều lần
        var properties = PropertyCache.GetOrAdd(type, t =>
            t.GetProperties(BindingFlags.Instance | BindingFlags.Public)
             .Where(p => p.CanRead && p.CanWrite)
             .ToArray());

        foreach (var prop in properties)
        {
            // Check if property has NoTrim attribute
            var hasNoTrimAttribute = NoTrimPropertyCache.GetOrAdd(prop, p =>
                p.GetCustomAttribute<NoTrimAttribute>() != null);

            if (hasNoTrimAttribute) continue;

            try
            {
                var value = prop.GetValue(obj);
                if (value != null)
                {
                    if (prop.PropertyType == typeof(string))
                    {
                        // Xử lý string property với custom trim condition
                        var trimCondition = TrimConditionCache.GetOrAdd(prop, p =>
                            p.GetCustomAttribute<TrimConditionAttribute>());

                        var trimmedValue = TrimString((string)value, trimCondition);
                        if (trimmedValue != (string)value)
                        {
                            prop.SetValue(obj, trimmedValue);
                        }
                    }
                    else
                    {
                        var trimmedValue = TrimValue(value, visitedObjects);
                        if (trimmedValue != value)
                        {
                            prop.SetValue(obj, trimmedValue);
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Ignore properties that can't be set (computed properties, etc.)
                continue;
            }
        }
    }
}