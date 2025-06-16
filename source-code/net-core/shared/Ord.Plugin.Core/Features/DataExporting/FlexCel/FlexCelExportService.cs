using FlexCel.Render;
using FlexCel.Report;
using FlexCel.XlsAdapter;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Features.BlobStoring;

namespace Ord.Plugin.Core.Features.DataExporting
{
    public class FlexCelExportingService : OrdManagerBase, IFlexCelExportingService
    {
        private ITemplateProvider _templateProvider;
        public async Task<byte[]> ExportExcelAsync(string templatePath, Func<FlexCelReport, Task>? reportHandler = null, Func<XlsFile, Task>? fileHandler = null)
        {
            var xls = await RunReportAsync(templatePath, reportHandler);
            await using var memoryStream = new MemoryStream();
            xls.Save(memoryStream);
            memoryStream.Position = 0;
            return memoryStream.ToArray();
        }
        public void SetTemplateProvider(TemplateProvider provider)
        {
            if (provider == TemplateProvider.MinIO)
            {
                _templateProvider = AppFactory.GetServiceDependency<MinioTemplateProvider>();
                return;
            }
            _templateProvider ??= AppFactory.GetServiceDependency<FileSystemTemplateProvider>();
        }
        public async Task<byte[]> ExportPdfAsync(string templatePath, Func<FlexCelReport, Task>? reportHandler = null, Func<XlsFile, Task>? fileHandler = null)
        {
            var xls = await RunReportAsync(templatePath, reportHandler);
            await using var memoryStream = new MemoryStream();

            using (var pdf = new FlexCelPdfExport(xls, true))
            {
                pdf.BeginExport(memoryStream);
                pdf.ExportAllVisibleSheets(false, "Export");
                pdf.EndExport();
            }

            memoryStream.Position = 0;
            return memoryStream.ToArray();
        }



        private async Task<XlsFile> RunReportAsync(string templatePath, Func<FlexCelReport, Task>? reportHandler = null, Func<XlsFile, Task>? fileHandler = null)
        {
            // mặc định lấy trong file
            _templateProvider ??= AppFactory.GetServiceDependency<FileSystemTemplateProvider>();
            await using var templateStream = await _templateProvider.GetTemplateStreamAsync(templatePath);
            var xls = new XlsFile(true);
            xls.Open(templateStream);
            using var report = new FlexCelReport(true);
            if (reportHandler != null)
            {
                await reportHandler(report);
            }

            if (fileHandler != null)
            {
                await fileHandler(xls);
            }
            report.Run(xls);

            return xls;
        }
    }
}