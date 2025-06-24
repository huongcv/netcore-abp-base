using Volo.Abp.Validation;

namespace Ord.Plugin
{
    public static class ValidationExceptionHelper
    {
        public static void Throw(string messageKey)
        {
            throw new AbpValidationException(messageKey);
        }
        public static void ThrowNotFound()
        {
            throw new AbpValidationException($"message.crud.not_found");
        }
    }

}
