using FlexCel.Report;
using FlexCel.XlsAdapter;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Core.Features.DataExporting
{
    public abstract class FlexCelExportService : DomainService
    {
        protected async Task<byte[]> Export()
        {
            var resultXls = new XlsFile(true);
            resultXls.Open(Path.Combine(Directory.GetCurrentDirectory(), GetFileTemplatePath()));
            using FlexCelReport fr = new FlexCelReport(true);
            await BindDataIntoTemplate(fr, resultXls);
            fr.Run(resultXls);
            await using var memoryStream = new MemoryStream();
            resultXls.Save(memoryStream);
            memoryStream.Position = 0;
           
            return memoryStream.ToArray();
        }

        protected abstract Task BindDataIntoTemplate(FlexCelReport fr, XlsFile xlsFile);
        protected abstract string GetFileTemplatePath();
    }
}
