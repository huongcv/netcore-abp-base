using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Localization;
using Volo.Abp;
using Volo.Abp.Http;

namespace Ord.Plugin.Core.Middlewares;


/// <summary>
/// Dịch lỗi mặc định của ABP sang  ngôn ngữ hệ thống
/// </summary>
public class OrdExceptionFilter : IExceptionFilter
{
    private readonly IStringLocalizer<OrdLocalizationResource> _translator;

    public OrdExceptionFilter(IStringLocalizer<OrdLocalizationResource> translator)
    {
        _translator = translator;
    }

    public void OnException(ExceptionContext context)
    {
        var exception = context.Exception;
        if (exception is BusinessException remoteErrorResponse )
        {
            string originalMessage = remoteErrorResponse.Message;
            string translatedMessage = _translator[originalMessage];
            
            var errorInfo = new RemoteServiceErrorInfo
            {
                Message = translatedMessage,
                Code = remoteErrorResponse.Code,
                Details = remoteErrorResponse.Details,
                Data = remoteErrorResponse.Data
            };

            context.Result = new ObjectResult(new RemoteServiceErrorResponse(errorInfo))
            {
                StatusCode = 500
            };
            context.ExceptionHandled = true;
        }
    }
}
