using OfficeOpenXml;
using OfficeOpenXml.Style;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;

namespace Ord.Plugin.Core.Features.DataExporting
{
    /// <summary>
    /// Static helper để tạo title trong Excel với EPPlus
    /// </summary>
    public static class ExcelTitleHelper
    {
        /// <summary>
        /// Tạo title đơn giản với text và style
        /// </summary>
        /// <param name="worksheet">Excel worksheet</param>
        /// <param name="startRow">Hàng bắt đầu (1-based)</param>
        /// <param name="startColumn">Cột bắt đầu (1-based)</param>
        /// <param name="columnSpan">Số cột để span</param>
        /// <param name="text">Nội dung title</param>
        /// <param name="styleBuilder">Style configuration</param>
        /// <returns>Hàng tiếp theo sau title</returns>
        public static int CreateTitle(
            ExcelWorksheet worksheet,
            int startRow,
            int startColumn,
            int columnSpan,
            string text,
            Action<OrdExcelStyleBuilder>? styleBuilder = null)
        {
            return CreateTitle(worksheet, startRow, startColumn, columnSpan, 1, text, styleBuilder);
        }

        /// <summary>
        /// Tạo title với cấu hình đầy đủ (span cột và hàng)
        /// </summary>
        /// <param name="worksheet">Excel worksheet</param>
        /// <param name="startRow">Hàng bắt đầu (1-based)</param>
        /// <param name="startColumn">Cột bắt đầu (1-based)</param>
        /// <param name="columnSpan">Số cột để span</param>
        /// <param name="rowSpan">Số hàng để span</param>
        /// <param name="text">Nội dung title</param>
        /// <param name="styleBuilder">Style configuration</param>
        /// <returns>Hàng tiếp theo sau title</returns>
        public static int CreateTitle(
            ExcelWorksheet worksheet,
            int startRow,
            int startColumn,
            int columnSpan,
            int rowSpan,
            string text,
            Action<OrdExcelStyleBuilder>? styleBuilder = null)
        {
            // Validate parameters
            if (worksheet == null) throw new ArgumentNullException(nameof(worksheet));
            if (startRow < 1) throw new ArgumentException("Start row must be >= 1", nameof(startRow));
            if (startColumn < 1) throw new ArgumentException("Start column must be >= 1", nameof(startColumn));
            if (columnSpan < 1) throw new ArgumentException("Column span must be >= 1", nameof(columnSpan));
            if (rowSpan < 1) throw new ArgumentException("Row span must be >= 1", nameof(rowSpan));
            var endRow = startRow + rowSpan - 1;
            var endColumn = startColumn + columnSpan - 1;

            // Get range for title
            var titleRange = worksheet.Cells[startRow, startColumn, endRow, endColumn];

            // Merge cells if spanning more than 1 cell
            if (columnSpan > 1 || rowSpan > 1)
            {
                titleRange.Merge = true;
            }

            // Set text
            titleRange.Value = text;

            // Apply style if provided
            if (styleBuilder != null)
            {
                var builder = new OrdExcelStyleBuilder();
                styleBuilder(builder);
                var style = builder.Build();
                style.ApplyTo(titleRange.Style);

                // Apply row height if specified in style
                if (style.RowHeight.HasValue)
                {
                    for (int row = startRow; row <= endRow; row++)
                    {
                        worksheet.Row(row).Height = style.RowHeight.Value;
                    }
                }
            }

            return endRow + 1;
        }

        /// <summary>
        /// Tạo title với auto-detect column span (span toàn bộ used range)
        /// </summary>
        /// <param name="worksheet">Excel worksheet</param>
        /// <param name="startRow">Hàng bắt đầu (1-based)</param>
        /// <param name="text">Nội dung title</param>
        /// <param name="styleBuilder">Style configuration</param>
        /// <returns>Hàng tiếp theo sau title</returns>
        public static int CreateAutoSpanTitle(
            ExcelWorksheet worksheet,
            int startRow,
            string text,
            Action<OrdExcelStyleBuilder>? styleBuilder = null)
        {
            // Detect used columns
            var usedRange = worksheet.Dimension;
            var columnSpan = usedRange?.End.Column ?? 1;

            return CreateTitle(worksheet, startRow, 1, columnSpan, text, styleBuilder);
        }

        /// <summary>
        /// Tạo title với preset styles phổ biến
        /// </summary>
        public static class PresetStyles
        {
            /// <summary>
            /// Style cho title chính (lớn, đậm, căn giữa)
            /// </summary>
            public static Action<OrdExcelStyleBuilder> MainTitle(string fontName = "Arial", float fontSize = 18) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithCenterAlignment()
                    .WithRowHeight(40);

            /// <summary>
            /// Style cho subtitle (vừa, đậm, căn giữa)
            /// </summary>
            public static Action<OrdExcelStyleBuilder> SubTitle(string fontName = "Arial", float fontSize = 14) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithCenterAlignment()
                    .WithRowHeight(30);

            /// <summary>
            /// Style cho section header (nhỏ, đậm, căn trái)
            /// </summary>
            public static Action<OrdExcelStyleBuilder> SectionHeader(string fontName = "Arial", float fontSize = 12) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithHorizontalAlignment(ExcelHorizontalAlignment.Left)
                    .WithRowHeight(25);

            /// <summary>
            /// Style cho company header (lớn, đậm, có border)
            /// </summary>
            public static Action<OrdExcelStyleBuilder> CompanyHeader(string fontName = "Times New Roman", float fontSize = 16) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithCenterAlignment()
                    .WithAllBorders(ExcelBorderStyle.Medium)
                    .WithRowHeight(45);
        }

        /// <summary>
        /// Tạo multiple titles trong một lần gọi
        /// </summary>
        /// <param name="worksheet">Excel worksheet</param>
        /// <param name="titles">Danh sách title configurations</param>
        /// <returns>Hàng tiếp theo sau tất cả titles</returns>
        public static int CreateMultipleTitles(
            ExcelWorksheet worksheet,
            params TitleConfiguration[] titles)
        {
            var currentRow = 1;

            foreach (var titleConfig in titles)
            {
                currentRow = CreateTitle(
                    worksheet,
                    titleConfig.StartRow ?? currentRow,
                    titleConfig.StartColumn,
                    titleConfig.ColumnSpan,
                    titleConfig.RowSpan,
                    titleConfig.Text,
                    titleConfig.StyleBuilder);

                // Add margin if specified
                if (titleConfig.MarginBottom > 0)
                {
                    currentRow += titleConfig.MarginBottom;
                }
            }

            return currentRow;
        }

        /// <summary>
        /// Configuration cho một title
        /// </summary>
        public class TitleConfiguration
        {
            public int? StartRow { get; set; }
            public int StartColumn { get; set; } = 1;
            public int ColumnSpan { get; set; } = 1;
            public int RowSpan { get; set; } = 1;
            public string Text { get; set; } = string.Empty;
            public Action<OrdExcelStyleBuilder>? StyleBuilder { get; set; }
            public int MarginBottom { get; set; } = 1;

            public static TitleConfiguration Create(
                string text,
                int columnSpan = 1,
                Action<OrdExcelStyleBuilder>? styleBuilder = null) =>
                new()
                {
                    Text = text,
                    ColumnSpan = columnSpan,
                    StyleBuilder = styleBuilder
                };
        }
    }
}