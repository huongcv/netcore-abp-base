using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Exceptions;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Localization;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Validation;

namespace Ord.Plugin.HostBase.Filters
{
    public class GlobalExceptionFilter : IExceptionFilter, ITransientDependency
    {
        private readonly ILogger<GlobalExceptionFilter> _logger;
        private readonly IAppFactory _appFactory;

        private IStringLocalizer<OrdLocalizationResource> L =>
            _appFactory.GetServiceDependency<IStringLocalizer<OrdLocalizationResource>>();
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
                EntityNotFoundException entityNotFoundEx => HandleEntityNotFoundException(entityNotFoundEx),
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
            var encodeid = $@"'{ex.EncodedId}'";
            if (!string.IsNullOrEmpty(ex.EntityType))
            {
                var entityName = L["entity_name_" + ex.EntityType].Value;
                if (!string.IsNullOrEmpty(entityName) && !entityName.StartsWith("entity_name_"))
                {
                    encodeid = $@"{encodeid} {L["of"]} {entityName}";
                }
            }
            var message = GetLocalizedMessageOrDefault("id_encode_invalid", "EncodedId không chính xác", encodeid);
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

        private CommonResultDto<object> HandleEntityNotFoundException(EntityNotFoundException ex)
        {
            _logger.LogWarning(ex, "Not found entity");
            var message = ex.Message;
            if (ex.IsMustGetLocalized)
            {
                message = GetLocalizedMessageOrDefault(ex.Message);
            }

            return CommonResultDto<object>.Failed(
                ex.Message,
                errorCode: "404"
            );
        }

        private CommonResultDto<object> HandleGeneralException(Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");

            return CommonResultDto<object>.ServerFailure(ex, GetLocalizedMessageOrDefault("server_err_common", "Có lỗi trong quá trình xử lý"));
        }

        public string GetLocalizedMessageOrDefault(string key, string defaultValue = "", params object[] formatArgs)
        {
            try
            {
                var localizedString = formatArgs?.Length > 0
                    ? L[key, formatArgs]
                    : L[key];

                return localizedString.ResourceNotFound ? defaultValue : localizedString.Value;
            }
            catch
            {
                return defaultValue;
            }
        }
    }
}
