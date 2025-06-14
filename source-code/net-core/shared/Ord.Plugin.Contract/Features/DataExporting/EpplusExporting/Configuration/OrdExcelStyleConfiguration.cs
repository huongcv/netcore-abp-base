using OfficeOpenXml.Style;
using System.Drawing;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Cấu hình style được tối ưu hóa
    /// </summary>
    public class OrdExcelStyleConfiguration
    {
        #region Font Settings

        public string? FontName { get; set; }
        public float? FontSize { get; set; }
        public bool IsBold { get; set; } = false;
        public bool IsItalic { get; set; } = false;
        public bool IsUnderline { get; set; } = false;
        public Color? FontColor { get; set; }

        #endregion

        #region Alignment Settings

        public ExcelHorizontalAlignment? HorizontalAlignment { get; set; }
        public ExcelVerticalAlignment? VerticalAlignment { get; set; }
        public bool WrapText { get; set; } = false;

        #endregion

        #region Background Settings

        public Color? BackgroundColor { get; set; }
        public ExcelFillStyle? FillPattern { get; set; }

        #endregion

        #region Border Settings

        public OrdExcelBorderConfiguration? Border { get; set; }

        #endregion

        #region Number Format Settings

        public string? NumberFormat { get; set; }

        #endregion

        #region Row Settings

        /// <summary>
        /// Chiều cao hàng cho style này
        /// </summary>
        public double? RowHeight { get; set; }

        #endregion

        #region Factory Methods

        public static OrdExcelStyleConfiguration Default() => new();

        public static OrdExcelStyleConfiguration Header() => new()
        {
            IsBold = true,
            HorizontalAlignment = ExcelHorizontalAlignment.Center,
            VerticalAlignment = ExcelVerticalAlignment.Center,
            BackgroundColor = Color.LightGray,
            Border = OrdExcelBorderConfiguration.All()
        };

        public static OrdExcelStyleConfiguration Currency() => new()
        {
            NumberFormat = "#,##0.00 ₫",
            HorizontalAlignment = ExcelHorizontalAlignment.Right
        };

        public static OrdExcelStyleConfiguration Date() => new()
        {
            NumberFormat = "dd/mm/yyyy",
            HorizontalAlignment = ExcelHorizontalAlignment.Center
        };

        public static OrdExcelStyleConfiguration DateTime() => new()
        {
            NumberFormat = "dd/mm/yyyy hh:mm:ss",
            HorizontalAlignment = ExcelHorizontalAlignment.Center
        };

        public static OrdExcelStyleConfiguration Percentage() => new()
        {
            NumberFormat = "0.00%",
            HorizontalAlignment = ExcelHorizontalAlignment.Right
        };

        #endregion

        /// <summary>
        /// Áp dụng style configuration vào ExcelStyle
        /// </summary>
        public void ApplyTo(ExcelStyle excelStyle)
        {
            // Font settings
            if (!string.IsNullOrEmpty(FontName))
                excelStyle.Font.Name = FontName;
            if (FontSize.HasValue)
                excelStyle.Font.Size = FontSize.Value;
            if (IsBold)
                excelStyle.Font.Bold = true;
            if (IsItalic)
                excelStyle.Font.Italic = true;
            if (IsUnderline)
                excelStyle.Font.UnderLine = true;
            if (FontColor.HasValue)
                excelStyle.Font.Color.SetColor(FontColor.Value);

            // Alignment settings
            if (HorizontalAlignment.HasValue)
                excelStyle.HorizontalAlignment = HorizontalAlignment.Value;
            if (VerticalAlignment.HasValue)
                excelStyle.VerticalAlignment = VerticalAlignment.Value;
            excelStyle.WrapText = WrapText;

            // Background settings
            if (BackgroundColor.HasValue)
            {
                excelStyle.Fill.PatternType = FillPattern ?? ExcelFillStyle.Solid;
                excelStyle.Fill.BackgroundColor.SetColor(BackgroundColor.Value);
            }

            // Border settings
            Border?.ApplyTo(excelStyle);

            // Number format
            if (!string.IsNullOrEmpty(NumberFormat))
                excelStyle.Numberformat.Format = NumberFormat;
        }
    }
}
