using FlexCel.Report;
using FlexCel.XlsAdapter;
using MediatR;

namespace Ord.Plugin.Core.DataExporting
{
    public class FlexCelExportExcelQuery : IRequest<byte[]>
    {
        public string FileTemplatePath { get; }
        public Func<FlexCelReport, XlsFile, Task> BindDataIntoTemplate { get; }
        public FlexCelExportExcelQuery(string fileTemplatePath,
            Func<FlexCelReport, XlsFile, Task> bindDataIntoTemplate)
        {
            FileTemplatePath = fileTemplatePath;
            BindDataIntoTemplate = bindDataIntoTemplate;
        }

        private class Handler : FlexCelExportService, IRequestHandler<FlexCelExportExcelQuery, byte[]>
        {
            private FlexCelExportExcelQuery _request;
            public Task<byte[]> Handle(FlexCelExportExcelQuery request, CancellationToken cancellationToken)
            {
                _request = request;
                return Export();
            }
            protected override async Task BindDataIntoTemplate(FlexCelReport fr, XlsFile xlsFile)
            {
                await _request.BindDataIntoTemplate.Invoke(fr, xlsFile);
            }

            protected override string GetFileTemplatePath()
            {
                return _request.FileTemplatePath;
            }


        }
    }
}
