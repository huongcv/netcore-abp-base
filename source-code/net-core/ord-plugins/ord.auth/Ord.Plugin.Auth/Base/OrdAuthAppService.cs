using Microsoft.Extensions.Localization;
using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Core.Base;

namespace Ord.Plugin.Auth.Base
{
    public class OrdAuthAppService : OrdAppServiceBase
    {
        protected override IStringLocalizer GetMainLocalizer()
        {
            return AppFactory.GetServiceDependency<IStringLocalizer<OrdAuthResource>>();
        }
    }
}
