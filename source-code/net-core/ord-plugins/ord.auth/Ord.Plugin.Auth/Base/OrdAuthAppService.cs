using Microsoft.Extensions.Localization;
using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Base;

namespace Ord.Plugin.Auth.Base
{
    public class OrdAuthAppService : OrdAppServiceBase
    {
        protected override IStringLocalizer GetMainLocalizer()
        {
            return AppFactory.GetServiceDependency<IStringLocalizer<OrdAuthResource>>();
        }

        public CommonResultDto<T> CreateNotFoundResult<T>(string message, params object[] formatArgs)
        {
            return AppFactory.CreateNotFoundResult<T, OrdAuthResource>(message, formatArgs);
        }
    }
}
