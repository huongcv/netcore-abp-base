using FlexCel.Core;
using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Core.Base;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Services;
using Volo.Abp.Validation;

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
        [HttpPost]
        [ActionName("ValidateDataImport")]
        [DisableValidation]
        public virtual async Task<CommonResultDto<ImportOutputDto<CountryImportDto>>> ValidateDataImportAsync(List<CountryImportDto> dataImports)
        {
            await CheckPermissionForActionName("Import");
            var result = await _importManger.ValidateProcessDataAsync(dataImports);
            return AppFactory.CreateSuccessResult(result);
        }

    }
}
