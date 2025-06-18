using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Exceptions;
using Ord.Plugin.Contract.Factories;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Validation;

namespace Ord.Plugin.HostBase.Filters
{
    public class GlobalExceptionFilter : IExceptionFilter, ITransientDependency
    {
        private readonly ILogger<GlobalExceptionFilter> _logger;
        private readonly IAppFactory _appFactory;
        public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger,
            IAppFactory appFactory)
        {
            _logger = logger;
            _appFactory = appFactory;
        }
        public void OnException(ExceptionContext context)
        {
            var result = context.Exception switch
            {
                AbpValidationException validationEx => HandleValidationException(validationEx),
                BusinessException businessEx => HandleBusinessException(businessEx),
                IdDecodeException idDecodeEx => HandleIdDecodeException(idDecodeEx),
                OrdCommonException commonEx => HandleOrdCommonException(commonEx),
                EntityNotFoundException notFoundEx => HandleEntityNotFoundException(notFoundEx),
                _ => HandleGeneralException(context.Exception)
            };

            context.Result = new OkObjectResult(result);
            context.ExceptionHandled = true;
        }
        private CommonResultDto<object> HandleValidationException(AbpValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error occurred");
            return CommonResultDto<object>.ValidationFailure(ex);
        }
        private CommonResultDto<object> HandleIdDecodeException(IdDecodeException ex)
        {
            _logger.LogWarning(ex, "Id decode error occurred");
            var message = GetLocalizedMessage("exception.id_encode_invalid", ex.EncodedId);
            return CommonResultDto<object>.Failed(
                message,
                errorCode: "404"
            );
        }
        private CommonResultDto<object> HandleBusinessException(BusinessException ex)
        {
            _logger.LogWarning(ex, "Business logic error occurred");
            return CommonResultDto<object>.Failed(
                ex.Message,
                errorCode: "422"
            );
        }
        private CommonResultDto<object> HandleOrdCommonException(OrdCommonException ex)
        {
            _logger.LogWarning(ex, "ORD common logic error occurred");
            var message = ex.Message;
            if (ex.IsMustGetLocalized)
            {
                message = GetLocalizedMessage(ex.Message);
            }
            else
            {
                message = GetLocalizedMessage(ex.MessageLocalized ?? ex.Message);
            }
            return CommonResultDto<object>.Failed(message, ex.Code);
        }

        private CommonResultDto<object> HandleGeneralException(Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");

            return CommonResultDto<object>.ServerFailure(ex, GetLocalizedMessage("exception.server_err"));
        }

        private CommonResultDto<object> HandleEntityNotFoundException(EntityNotFoundException ex)
        {
            _logger.LogWarning(ex, "Entity not found");
            var message = GetLocalizedMessage(ex.Message);
            return CommonResultDto<object>.Failed(
                message,
                errorCode: "404"
            );
        }


        public string GetLocalizedMessage(string key, params object[] formatArgs)
        {
            return _appFactory.GetLocalizedMessage(key, formatArgs);
        }
    }
}
