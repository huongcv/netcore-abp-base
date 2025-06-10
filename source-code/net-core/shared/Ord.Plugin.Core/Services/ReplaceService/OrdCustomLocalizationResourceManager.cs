using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Localization.VirtualFiles.Json;

namespace Ord.Plugin.Core.Services.ReplaceService
{
    public class OrdCustomLocalizationResourceManager: JsonVirtualFileLocalizationResourceContributor, ITransientDependency
    {
        public OrdCustomLocalizationResourceManager(string virtualPath) : base(virtualPath)
        {
        }
    }
}
