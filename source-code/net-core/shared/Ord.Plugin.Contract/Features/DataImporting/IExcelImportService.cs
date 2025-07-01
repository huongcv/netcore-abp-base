using FlexCel.XlsAdapter;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Features.DataImporting
{
    public interface IExcelImportService<TImportDto> : IScopedDependency
        where TImportDto : class, IImportDto, new()
    {
        Task<ImportOutputDto<TImportDto>> ValidateProcessDataAsync(List<TImportDto> rawDataList);
        Task<byte[]> ExportResultDataAsync(List<TImportDto> rawDataList,
             Func<XlsFile, Task> funResultXls = null);
        Task<byte[]> ExportSampleTemplateExcel(Func<XlsFile, Task> funResultXls = null);
    }
}
