using FlexCel.Report;
using FlexCel.XlsAdapter;
using Ord.Plugin.Contract.Features.BlobStoring;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin
{
    public interface IFlexCelExportingService : IDomainService
    {
        Task<byte[]> ExportExcelAsync(string fileTemplatePath, Func<FlexCelReport, Task>? reportHandler = null, Func<XlsFile, Task>? fileHandler = null);
        Task<byte[]> ExportPdfAsync(string fileTemplatePath, Func<FlexCelReport, Task>? reportHandler = null, Func<XlsFile, Task>? fileHandler = null);
        void SetTemplateProvider(TemplateProvider provider);
    }
}
