using FlexCel.Report;
using Ord.Plugin.Contract.Features.BlobStoring;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin
{
    public interface IFlexCelExportingService : IDomainService
    {
        Task<byte[]> ExportExcelAsync(string fileTemplatePath, Func<FlexCelReport, Task> excelHandler);
        Task<byte[]> ExportPdfAsync(string fileTemplatePath, Func<FlexCelReport, Task> excelHandler);
        void SetTemplateProvider(TemplateProvider provider);
    }
}
