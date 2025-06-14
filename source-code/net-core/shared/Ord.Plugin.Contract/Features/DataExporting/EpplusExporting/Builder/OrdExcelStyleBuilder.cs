using OfficeOpenXml.Style;
using System.Drawing;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Builder cho Style
    /// </summary>
    public class OrdExcelStyleBuilder
    {
        private readonly OrdExcelStyleConfiguration _style = new();

        #region Font Settings

        public OrdExcelStyleBuilder WithFont(string fontName, float? fontSize = null)
        {
            _style.FontName = fontName;
            if (fontSize.HasValue)
                _style.FontSize = fontSize;
            return this;
        }

        public OrdExcelStyleBuilder WithFontSize(float size)
        {
            _style.FontSize = size;
            return this;
        }

        public OrdExcelStyleBuilder WithBoldFont(bool bold = true)
        {
            _style.IsBold = bold;
            return this;
        }

        public OrdExcelStyleBuilder WithItalicFont(bool italic = true)
        {
            _style.IsItalic = italic;
            return this;
        }

        public OrdExcelStyleBuilder WithUnderlineFont(bool underline = true)
        {
            _style.IsUnderline = underline;
            return this;
        }

        public OrdExcelStyleBuilder WithFontColor(Color color)
        {
            _style.FontColor = color;
            return this;
        }

        #endregion

        #region Alignment Settings

        public OrdExcelStyleBuilder WithHorizontalAlignment(ExcelHorizontalAlignment alignment)
        {
            _style.HorizontalAlignment = alignment;
            return this;
        }

        public OrdExcelStyleBuilder WithVerticalAlignment(ExcelVerticalAlignment alignment)
        {
            _style.VerticalAlignment = alignment;
            return this;
        }

        public OrdExcelStyleBuilder WithCenterAlignment()
        {
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            _style.VerticalAlignment = ExcelVerticalAlignment.Center;
            return this;
        }

        public OrdExcelStyleBuilder WithWrapText(bool wrap = true)
        {
            _style.WrapText = wrap;
            return this;
        }

        #endregion

        #region Background Settings

        public OrdExcelStyleBuilder WithBackgroundColor(Color color, ExcelFillStyle? pattern = null)
        {
            _style.BackgroundColor = color;
            _style.FillPattern = pattern ?? ExcelFillStyle.Solid;
            return this;
        }

        #endregion

        #region Border Settings

        public OrdExcelStyleBuilder WithBorder(Action<OrdExcelBorderBuilder> borderBuilder)
        {
            var builder = new OrdExcelBorderBuilder();
            borderBuilder(builder);
            _style.Border = builder.Build();
            return this;
        }

        public OrdExcelStyleBuilder WithAllBorders(ExcelBorderStyle style = ExcelBorderStyle.Thin)
        {
            _style.Border = OrdExcelBorderConfiguration.All(style);
            return this;
        }

        public OrdExcelStyleBuilder WithAroundBorder(ExcelBorderStyle style = ExcelBorderStyle.Medium)
        {
            _style.Border = OrdExcelBorderConfiguration.Around(style);
            return this;
        }

        #endregion

        #region Number Format Settings

        public OrdExcelStyleBuilder WithNumberFormat(string format)
        {
            _style.NumberFormat = format;
            return this;
        }

        public OrdExcelStyleBuilder WithCurrencyFormat(string currencySymbol = "₫")
        {
            _style.NumberFormat = $"#,##0.00 {currencySymbol}";
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            return this;
        }

        public OrdExcelStyleBuilder WithDateFormat(string format = "dd/mm/yyyy")
        {
            _style.NumberFormat = format;
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            return this;
        }

        public OrdExcelStyleBuilder WithDateTimeFormat(string format = "dd/mm/yyyy hh:mm:ss")
        {
            _style.NumberFormat = format;
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            return this;
        }

        public OrdExcelStyleBuilder WithPercentageFormat(int decimals = 2)
        {
            _style.NumberFormat = decimals == 0 ? "0%" : $"0.{new string('0', decimals)}%";
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            return this;
        }

        #endregion
        #region Row Settings

        /// <summary>
        /// Thiết lập chiều cao hàng
        /// </summary>
        public OrdExcelStyleBuilder WithRowHeight(double height)
        {
            _style.RowHeight = height;
            return this;
        }

        #endregion
        public OrdExcelStyleConfiguration Build() => _style;
    }

}
