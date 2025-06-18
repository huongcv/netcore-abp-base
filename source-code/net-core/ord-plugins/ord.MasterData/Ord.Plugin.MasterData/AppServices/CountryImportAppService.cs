using FlexCel.XlsAdapter;
using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Core.Base;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Repositories;
using Ord.Plugin.MasterData.Shared.Services;
using Volo.Abp.Validation;

namespace Ord.Plugin.MasterData.AppServices
{
    [OrdAuth]
    public class CountryImportAppService : OrdAppServiceBase
    {
        private ICountryImportManager ImportManager => AppFactory.GetServiceDependency<ICountryImportManager>();
        private ICountryRepository Repository => AppFactory.GetServiceDependency<ICountryRepository>();
        private ICountryReaderManager ReaderManager => AppFactory.GetServiceDependency<ICountryReaderManager>();
        protected override string GetBasePermissionName()
        {
            return "MasterData.Country";
        }
        [HttpPost]
        [ActionName("DownloadSampleTemplate")]
        public virtual async Task<IActionResult> DownloadSampleTemplateAsync()
        {
            await CheckPermissionForActionName("Import");
            return await TryReturnExcelAsync(() => ImportManager.ExportSampleTemplateExcel(DoHandlerXlsFileAfterBindData),
                "file.ImportSampleTemplate.Country", false);

        }
        [HttpPost]
        [ActionName("DownloadImportResult")]
        public virtual async Task<IActionResult> DownloadImportResultAsync(DownloadResultFileImport<CountryImportDto> input)
        {
            await CheckPermissionForActionName("Import");
            var fileName = input.IsSuccessList
                ? "file.ImportResultSuccess.Country"
                : "file.ImportResultErrors.Country";
            return await TryReturnExcelAsync(() => ImportManager.ExportResultDataAsync(input?.Items ?? new(), DoHandlerXlsFileAfterBindData),
                fileName, false);

        }

        private async Task DoHandlerXlsFileAfterBindData(XlsFile xls)
        {
            // xóa cột trạng thái
            xls.DeleteColumn(5);
        }


        [HttpPost]
        [ActionName("ValidateDataImport")]
        [DisableValidation]
        public virtual async Task<CommonResultDto<ImportOutputDto<CountryImportDto>>> ValidateDataImportAsync(List<CountryImportDto> dataImports)
        {
            await CheckPermissionForActionName("Import");
            var result = await ImportManager.ValidateProcessDataAsync(dataImports);
            return AppFactory.CreateSuccessResult(result);
        }
        [HttpPost]
        [ActionName("ValidateFile")]
        public virtual async Task<CommonResultDto<ImportOutputDto<CountryImportDto>>> ValidateFileAsync([FromForm] ExcelImportFileRequest input)
        {
            var dataExcel = await ReaderManager.ReadFromExcelAsync(input.File);
            if (dataExcel?.Any() != true)
            {
                return AppFactory.CreateBadRequestResult<ImportOutputDto<CountryImportDto>>(AppFactory.GetLocalizedMessage("message.validation.file_not_data"));
            }
            return await ValidateDataImportAsync(dataExcel);
        }


        [HttpPost]
        [ActionName("Import")]
        [DisableValidation]
        public virtual async Task<CommonResultDto<ImportOutputDto<CountryImportDto>>> ImportAsync(List<CountryImportDto> dataImports)
        {
            await CheckPermissionForActionName("Import");
            var result = await ImportManager.ValidateProcessDataAsync(dataImports);
            if (result.SuccessImportList?.Any() == true)
            {
                await DoBulkImportDataAsync(result.SuccessImportList);
            }
            return AppFactory.CreateSuccessResult(result);
        }


        protected async Task DoBulkImportDataAsync(List<CountryImportDto> bulkItems)
        {
            var bulkCreateDto = bulkItems.Select(importDto =>
            {
                var createDto = AppFactory.ObjectMap<CountryImportDto, CreateCountryDto>(importDto);
                return createDto;
            });
            var entities = await Repository.CreateManyAsync(bulkCreateDto);
        }
    }
}
