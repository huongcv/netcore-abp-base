using OfficeOpenXml;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Cấu hình in ấn
    /// </summary>
    public class OrdExcelPrintConfiguration
    {
        public eOrientation Orientation { get; set; } = eOrientation.Landscape;
        public bool FitToPage { get; set; } = true;
        public int FitToWidth { get; set; } = 1;
        public int FitToHeight { get; set; } = 0;
        public decimal LeftMargin { get; set; } = 0.7M;
        public decimal RightMargin { get; set; } = 0.7M;
        public decimal TopMargin { get; set; } = 0.75M;
        public decimal BottomMargin { get; set; } = 0.75M;
        public string? Header { get; set; }
        public string? Footer { get; set; }

        public void ApplyTo(ExcelWorksheet worksheet)
        {
            worksheet.PrinterSettings.Orientation = Orientation;
            worksheet.PrinterSettings.FitToPage = FitToPage;
            worksheet.PrinterSettings.FitToWidth = FitToWidth;
            worksheet.PrinterSettings.FitToHeight = FitToHeight;
            worksheet.PrinterSettings.LeftMargin = LeftMargin;
            worksheet.PrinterSettings.RightMargin = RightMargin;
            worksheet.PrinterSettings.TopMargin = TopMargin;
            worksheet.PrinterSettings.BottomMargin = BottomMargin;

            if (!string.IsNullOrEmpty(Header))
            {
                worksheet.HeaderFooter.OddHeader.CenteredText = Header;
            }

            if (!string.IsNullOrEmpty(Footer))
                worksheet.HeaderFooter.OddFooter.CenteredText = Footer;
        }
    }
}
