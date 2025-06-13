using OfficeOpenXml.Style;
using System.Drawing;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Cấu hình border
    /// </summary>
    public class OrdExcelBorderConfiguration
    {
        public ExcelBorderStyle? Top { get; set; }
        public ExcelBorderStyle? Bottom { get; set; }
        public ExcelBorderStyle? Left { get; set; }
        public ExcelBorderStyle? Right { get; set; }
        public Color? Color { get; set; }

        public static OrdExcelBorderConfiguration All(ExcelBorderStyle style = ExcelBorderStyle.Thin) => new()
        {
            Top = style,
            Bottom = style,
            Left = style,
            Right = style
        };

        public static OrdExcelBorderConfiguration Around(ExcelBorderStyle style = ExcelBorderStyle.Medium) => new()
        {
            Top = style,
            Bottom = style,
            Left = style,
            Right = style
        };

        public void ApplyTo(ExcelStyle excelStyle)
        {
            if (Top.HasValue)
                excelStyle.Border.Top.Style = Top.Value;
            if (Bottom.HasValue)
                excelStyle.Border.Bottom.Style = Bottom.Value;
            if (Left.HasValue)
                excelStyle.Border.Left.Style = Left.Value;
            if (Right.HasValue)
                excelStyle.Border.Right.Style = Right.Value;

            if (Color.HasValue)
            {
                excelStyle.Border.Top.Color.SetColor(Color.Value);
                excelStyle.Border.Bottom.Color.SetColor(Color.Value);
                excelStyle.Border.Left.Color.SetColor(Color.Value);
                excelStyle.Border.Right.Color.SetColor(Color.Value);
            }
        }
    }
}
