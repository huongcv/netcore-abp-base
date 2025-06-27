using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataImporting;

namespace Ord.Plugin.Contract.Base
{
    public interface IImportExcelAppService<TImportDto>
    where TImportDto : class, IImportDto, new()
    {
        IExcelImportService<TImportDto> ImportManager { get; }
        Task<IActionResult> DownloadSampleTemplateAsync();
        Task<IActionResult> DownloadImportResultAsync(DownloadResultFileImport<TImportDto> input);
        Task<CommonResultDto<ImportOutputDto<TImportDto>>> ValidateDataImportAsync(List<TImportDto> dataImports);
        Task<CommonResultDto<ImportOutputDto<TImportDto>>> ImportAsync(List<TImportDto> dataImports);
    }
}
