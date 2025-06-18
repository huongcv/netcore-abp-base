using FlexCel.Core;
using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Core.Base;
using Ord.Plugin.MasterData.Shared.Services;

namespace Ord.Plugin.MasterData.AppServices
{
    [OrdAuth]
    public class CountryImportAppService : OrdAppServiceBase
    {
        private readonly ICountryImportManger _importManger;
        protected override string GetBasePermissionName()
        {
            return "MasterData.Country";
        }
        public CountryImportAppService(ICountryImportManger importManger)
        {
            _importManger = importManger;
        }
        [HttpPost]
        [ActionName("DownloadSampleTemplate")]
        public virtual async Task<IActionResult> DownloadSampleTemplateAsync()
        {
            await CheckPermissionForActionName("Import");
            return await TryReturnExcelAsync(() => _importManger.ExportSampleTemplateExcel(async (xls) =>
            {
                // xóa cột trạng thái
                xls.DeleteRange(new TXlsCellRange(1, 5, 1, 5), TFlxInsertMode.ShiftColRight);
            }), "file.ImportSampleTemplate.Country", false);

        }

    }
}
