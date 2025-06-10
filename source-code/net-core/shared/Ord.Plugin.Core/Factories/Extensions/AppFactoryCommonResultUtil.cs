using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;

namespace Ord
{
    public static class AppFactoryCommonResultUtil
    {
        #region Success result
        public static async Task<CommonResultDto<T>> CreateSuccessResultAsync<T>(this IAppFactory factory, Func<Task<T>> getDataFunc, string message = "", params object[] formatArgs)
        {
            var data = await getDataFunc();
            return factory.CreateSuccessResult(data, message, formatArgs);
        }
        public static CommonResultDto<T> CreateSuccessResult<T>(this IAppFactory factory, T data, string message = "", params object[] formatArgs)
        {
            return CommonResultDto<T>.Ok(data, factory.GetLocalizedMessage(message, formatArgs));
        }

        #endregion

        #region Error result 
        public static CommonResultDto<T> CreateBadRequestResult<T>(this IAppFactory factory, string message, params object[] formatArgs)
        {
            return CommonResultDto<T>.ValidationFailure(factory.GetLocalizedMessage( message, formatArgs));
        }
        public static CommonResultDto<T> CreateNotFoundResult<T>(this IAppFactory factory, string message, params object[] formatArgs)
        {
            return CommonResultDto<T>.Failed(factory.GetLocalizedMessage(message, formatArgs), "404");
        }

        #endregion
    }
}
