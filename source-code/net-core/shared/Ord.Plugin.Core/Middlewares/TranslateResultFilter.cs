using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Localization;

namespace Ord.Plugin.Core.Middlewares;

/// <summary>
/// Dịch thông báo lỗi của CommonResultDto 
/// </summary>
public class TranslateResultFilter : IAsyncResultFilter
{
    private readonly IStringLocalizer<OrdLocalizationResource> _translator;

    public TranslateResultFilter(IStringLocalizer<OrdLocalizationResource> trans)
    {
        _translator = trans;
    }

    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        // var new RemoteServiceErrorResponse
        if (context.Result is ObjectResult objectResult &&
            objectResult.Value != null)
        {
            var resultType = objectResult.Value.GetType();
            if (resultType.IsGenericType &&
                resultType.GetGenericTypeDefinition() == typeof(CommonResultDto<>))
            {
                var isSuccessProp = resultType.GetProperty("IsSuccessful");
                var messRootProp = resultType.GetProperty("Message");
                var isSuccess = (bool)(isSuccessProp?.GetValue(objectResult.Value) ?? false);

                if (isSuccess)
                {
                    var notificationProp = resultType.GetProperty("Notification");
                    var notificationObj = notificationProp?.GetValue(objectResult.Value);

                    if (notificationObj != null)
                    {
                        var messageProp = notificationObj.GetType().GetProperty("Message");
                        var messageValue = messageProp?.GetValue(notificationObj) as string;
                        var paramMessage = notificationObj.GetType().GetProperty("ParamMessage");
                        var dataValue= paramMessage?.GetValue(notificationObj) as string[];

                        if (!string.IsNullOrWhiteSpace(messageValue))
                        {
                            var dtPr = dataValue == null ? [""] : dataValue.ToArray();
                            var translated = _translator[messageValue,dtPr ];
                            messageProp?.SetValue(notificationObj, translated.Value);
                            messRootProp?.SetValue(objectResult.Value, translated.Value);
                        }
                    }
                }
                else
                {
                    var errorDetailProp = resultType.GetProperty("ErrorDetail");
                    var errorDetailObj = errorDetailProp?.GetValue(objectResult.Value);

                    if (errorDetailObj != null)
                    {
                        var messageProp = errorDetailObj.GetType().GetProperty("Message");
                        var messageValue = messageProp?.GetValue(errorDetailObj) as string;
                        var paramMessage = errorDetailObj.GetType().GetProperty("ParamMessage");
                        var dataValue= paramMessage?.GetValue(errorDetailObj) as string[];

                        if (!string.IsNullOrWhiteSpace(messageValue))
                        {
                            var dtPr = dataValue == null ? [""] : dataValue.ToArray();
                            var translated = _translator[messageValue,dtPr ];
                            messageProp?.SetValue(errorDetailObj, translated.Value);
                            messRootProp?.SetValue(objectResult.Value, translated.Value);
                        }
                    }
                }
            }
        }

        await next();
    }
}