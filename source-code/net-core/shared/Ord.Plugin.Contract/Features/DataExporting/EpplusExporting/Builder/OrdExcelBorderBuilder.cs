using OfficeOpenXml.Style;
using System.Drawing;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Builder cho Border
    /// </summary>
    public class OrdExcelBorderBuilder
    {
        private readonly OrdExcelBorderConfiguration _border = new();

        public OrdExcelBorderBuilder WithTop(ExcelBorderStyle style)
        {
            _border.Top = style;
            return this;
        }

        public OrdExcelBorderBuilder WithBottom(ExcelBorderStyle style)
        {
            _border.Bottom = style;
            return this;
        }

        public OrdExcelBorderBuilder WithLeft(ExcelBorderStyle style)
        {
            _border.Left = style;
            return this;
        }

        public OrdExcelBorderBuilder WithRight(ExcelBorderStyle style)
        {
            _border.Right = style;
            return this;
        }

        public OrdExcelBorderBuilder WithAll(ExcelBorderStyle style)
        {
            _border.Top = style;
            _border.Bottom = style;
            _border.Left = style;
            _border.Right = style;
            return this;
        }

        public OrdExcelBorderBuilder WithColor(Color color)
        {
            _border.Color = color;
            return this;
        }

        public OrdExcelBorderConfiguration Build() => _border;
    }
}
