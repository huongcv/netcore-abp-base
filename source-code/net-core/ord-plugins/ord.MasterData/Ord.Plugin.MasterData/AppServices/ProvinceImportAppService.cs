using FlexCel.XlsAdapter;
using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Services;
using Ord.Plugin.MasterData.Shared.Dtos;
using Ord.Plugin.MasterData.Shared.Repositories;
using Ord.Plugin.MasterData.Shared.Services;
using Volo.Abp.Validation;

namespace Ord.Plugin.MasterData.AppServices
{
    [OrdAuth]
    public class ProvinceImportAppService : OrdAppServiceBase, IImportExcelAppService<ProvinceImportDto>
    {
        private IProvinceRepository Repository => AppFactory.GetServiceDependency<IProvinceRepository>();
        protected override string GetBasePermissionName()
        {
            return "MasterData.Province";
        }

        public IExcelImportService<ProvinceImportDto> ImportManager => AppFactory.GetServiceDependency<IProvinceImportManager>();

        [HttpPost]
        [ActionName("DownloadSampleTemplate")]
        public virtual async Task<IActionResult> DownloadSampleTemplateAsync()
        {
            await CheckPermissionForOperation(CrudOperationType.Import);
            return await TryReturnExcelAsync(() => ImportManager.ExportSampleTemplateExcel(DoHandlerXlsFileAfterBindData),
                "file.ImportSampleTemplate.Province", false);

        }
        [HttpPost]
        [ActionName("DownloadImportResult")]
        public virtual async Task<IActionResult> DownloadImportResultAsync(DownloadResultFileImport<ProvinceImportDto> input)
        {
            await CheckPermissionForOperation(CrudOperationType.Import);
            var fileName = input.IsSuccessList
                ? "file.ImportResultSuccess.Province"
                : "file.ImportResultErrors.Province";
            return await TryReturnExcelAsync(() => ImportManager.ExportResultDataAsync(input?.Items ?? new(), DoHandlerXlsFileAfterBindData),
                fileName, false);

        }

        private async Task DoHandlerXlsFileAfterBindData(XlsFile xls)
        {
            // xóa cột trạng thái
            xls.DeleteColumn(6);
        }


        [HttpPost]
        [ActionName("ValidateDataImport")]
        [DisableValidation]
        public virtual async Task<CommonResultDto<ImportOutputDto<ProvinceImportDto>>> ValidateDataImportAsync(List<ProvinceImportDto> dataImports)
        {
            await CheckPermissionForOperation(CrudOperationType.Import);
            var result = await ImportManager.ValidateProcessDataAsync(dataImports);
            return AppFactory.CreateSuccessResult(result);
        }
       

        [HttpPost]
        [ActionName("Import")]
        [DisableValidation]
        public virtual async Task<CommonResultDto<ImportOutputDto<ProvinceImportDto>>> ImportAsync(List<ProvinceImportDto> dataImports)
        {
            await CheckPermissionForOperation(CrudOperationType.Import);
            var result = await ImportManager.ValidateProcessDataAsync(dataImports);
            if (result.SuccessImportList?.Any() == true)
            {
                await DoBulkImportDataAsync(result.SuccessImportList);
            }
            return AppFactory.CreateSuccessResult(result);
        }
        protected async Task DoBulkImportDataAsync(List<ProvinceImportDto> bulkItems)
        {
            var bulkCreateDto = bulkItems.Select(importDto =>
            {
                var createDto = AppFactory.ObjectMap<ProvinceImportDto, CreateProvinceDto>(importDto);
                // mặc định true 
                createDto.IsActived = true;
                return createDto;
            });
            var entities = await Repository.CreateManyAsync(bulkCreateDto);
        }
    }
}
