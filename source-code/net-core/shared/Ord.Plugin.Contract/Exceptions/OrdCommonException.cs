using Microsoft.Extensions.Localization;

namespace Ord.Plugin.Contract.Exceptions
{
    public class OrdCommonException(string code, string message) : Exception(message)
    {
        public bool IsMustGetLocalized { get; private set; } = true;
        public string? MessageLocalized { get; private set; }
        public string Code { get; } = code;

        public OrdCommonException SetMessageLocalized(IStringLocalizer l, string key, params object[] formatArgs)
        {
            MessageLocalized = l.GetLocalizedMessage(key, formatArgs);
            IsMustGetLocalized = false;
            return this;
        }
    }
}
