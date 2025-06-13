using OfficeOpenXml;
namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Builder cho Print Configuration
    /// </summary>
    public class OrdExcelPrintBuilder
    {
        private readonly OrdExcelPrintConfiguration _print = new();

        public OrdExcelPrintBuilder WithOrientation(eOrientation orientation)
        {
            _print.Orientation = orientation;
            return this;
        }

        public OrdExcelPrintBuilder WithFitToPage(bool fit = true, int width = 1, int height = 0)
        {
            _print.FitToPage = fit;
            _print.FitToWidth = width;
            _print.FitToHeight = height;
            return this;
        }

        public OrdExcelPrintBuilder WithMargins(decimal left, decimal right, decimal top, decimal bottom)
        {
            _print.LeftMargin = left;
            _print.RightMargin = right;
            _print.TopMargin = top;
            _print.BottomMargin = bottom;
            return this;
        }

        public OrdExcelPrintBuilder WithHeader(string header)
        {
            _print.Header = header;
            return this;
        }

        public OrdExcelPrintBuilder WithFooter(string footer)
        {
            _print.Footer = footer;
            return this;
        }

        public OrdExcelPrintConfiguration Build() => _print;
    }
}
