using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Contract.Exceptions
{
    public class OrdCommonException(string code, string message) : Exception(message)
    {
        public bool IsMustGetLocalized { get; private set; } = true;
        public string? MessageLocalized { get; private set; }
        public string Code { get; } = code;

        public OrdCommonException SetMessageLocalized(IAppFactory appFactory, string key, params object[] formatArgs)
        {
            MessageLocalized = appFactory.GetLocalizedMessage(key, formatArgs);
            IsMustGetLocalized = false;
            return this;
        }
    }
}
