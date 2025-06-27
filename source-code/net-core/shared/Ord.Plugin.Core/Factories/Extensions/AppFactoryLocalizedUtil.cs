using Ord.Plugin.Contract;
using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Core.Factories.Extensions
{
    public static class AppFactoryLocalizedUtil
    {
        public static string GetLocalizedIsActive(this IAppFactory factory, bool? isActive, string? nullMessage = null)
        {
            if (isActive == true)
            {
                return factory.GetLocalizedMessage("status.active");
            }
            if (isActive == false || string.IsNullOrEmpty(nullMessage))
            {
                return factory.GetLocalizedMessage("status.inactive");
            }

            return factory.GetLocalizedMessage(nullMessage);

        }
        public static ExportEpplusFileSetting GetExportFileName(this IAppFactory factory, string name)
        {
            var baseExcel = "excel." + name;
            return new ExportEpplusFileSetting()
            {
                FileName = factory.GetLocalizedMessage(baseExcel + ".file-name"),
                Title = factory.GetLocalizedMessage(baseExcel + ".title"),
                SheetName = factory.GetLocalizedMessage(baseExcel + ".sheet-name"),
            };
        }

    }
}
