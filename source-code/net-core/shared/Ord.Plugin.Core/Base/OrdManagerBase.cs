using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Core.Base
{
    public abstract class OrdManagerBase : DomainService
    {
        protected IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
        protected IStringLocalizer L => GetMainLocalizer();

        protected CommonResultDto<T> CreateSuccessResult<T>(T data, string message = "", params object[] formatArgs)
        {
            return CommonResultDto<T>.Ok(data, GetLocalizedMessage(message));
        }
        protected CommonResultDto<T> CreateErrorResult<T>(string message, params object[] formatArgs)
        {
            return CommonResultDto<T>.Failed(GetLocalizedMessage(message));
        }
        protected string GetLocalizedMessage(string key, params object[] formatArgs)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return string.Empty;
            }
            return formatArgs?.Length > 0
                ? L[key, formatArgs].Value
                : L[key].Value;
        }

        protected abstract IStringLocalizer GetMainLocalizer();
    }
}
