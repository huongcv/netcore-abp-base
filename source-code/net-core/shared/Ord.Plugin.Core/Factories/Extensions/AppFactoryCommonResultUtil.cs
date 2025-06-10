using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Localization;

namespace Ord
{
    public static class AppFactoryCommonResultUtil
    {
        #region Success result

        public static CommonResultDto<T> CreateSuccessResult<T>(this IAppFactory factory, T data, string message = "", params object[] formatArgs)
        {
            return factory.CreateSuccessResult<T, OrdLocalizationResource>(data, message, formatArgs);
        }
        public static CommonResultDto<T> CreateSuccessResult<T, TResource>(this IAppFactory factory, T data, string message = "", params object[] formatArgs)
        {
            return CommonResultDto<T>.Ok(data, factory.GetLocalizedMessage<TResource>(message, formatArgs));
        }

        #endregion

        #region Error result 

        public static CommonResultDto<T> CreateBadRequestResult<T>(this IAppFactory factory, string message, params object[] formatArgs)
        {
            return CreateBadRequestResult<T, OrdLocalizationResource>(factory, message, formatArgs);
        }
        public static CommonResultDto<T> CreateBadRequestResult<T, TResource>(this IAppFactory factory, string message, params object[] formatArgs)
        {
            return CommonResultDto<T>.ValidationFailure(GetLocalizedMessage<TResource>(factory, message, formatArgs));
        }
        public static CommonResultDto<T> CreateNotFoundResult<T>(this IAppFactory factory, string message, params object[] formatArgs)
        {
            return CreateNotFoundResult<T, OrdLocalizationResource>(factory, message, formatArgs);
        }
        public static CommonResultDto<T> CreateNotFoundResult<T, TResource>(this IAppFactory factory, string message, params object[] formatArgs)
        {
            return CommonResultDto<T>.Failed(GetLocalizedMessage<TResource>(factory, message, formatArgs), "404");
        }

        #endregion



        public static string GetLocalizedMessage<TResource>(this IAppFactory factory, string key, params object[] formatArgs)
        {
            var l = factory.GetServiceDependency<IStringLocalizer<TResource>>();
            return formatArgs?.Length > 0
                ? l[key, formatArgs]
                : l[key];
        }

        public static string GetLocalizedMessage(this IAppFactory factory, string key, params object[] formatArgs)
        {
            return factory.GetLocalizedMessage<OrdLocalizationResource>(key, formatArgs);
        }
        public static string GetLocalizedMessageOrDefault<TResource>(this IAppFactory factory, string key, string defaultValue = "", params object[] formatArgs)
        {
            try
            {
                var l = factory.GetServiceDependency<IStringLocalizer<TResource>>();
                var localizedString = formatArgs?.Length > 0
                    ? l[key, formatArgs]
                    : l[key];

                return localizedString.ResourceNotFound ? defaultValue : localizedString.Value;
            }
            catch
            {
                return defaultValue;
            }
        }
        public static string GetLocalizedMessageOrDefault(this IAppFactory factory, string key, string defaultValue = "", params object[] formatArgs)
        {
            return factory.GetLocalizedMessageOrDefault<OrdLocalizationResource>(key, defaultValue, formatArgs);
        }
    }
}
