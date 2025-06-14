using OfficeOpenXml;
using OfficeOpenXml.Style;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using System.Drawing;

namespace Ord.Plugin.Core.Features.DataExporting
{
    /// <summary>
    /// Static helper chuyên dụng để tạo summary sections trong Excel
    /// </summary>
    public static class ExcelSummaryHelper
    {
        /// <summary>
        /// Configuration cho một summary item với style riêng
        /// </summary>
        public class SummaryItem
        {
            public string Label { get; set; } = string.Empty;
            public object Value { get; set; } = string.Empty;
            public Action<OrdExcelStyleBuilder>? StyleBuilder { get; set; }

            public static SummaryItem Create(string label, object value, Action<OrdExcelStyleBuilder>? styleBuilder = null) =>
                new() { Label = label, Value = value, StyleBuilder = styleBuilder };
        }

        /// <summary>
        /// Configuration cho summary layout
        /// </summary>
        public class SummaryLayout
        {
            public int MarginTop { get; set; } = 3;
            public int StartColumn { get; set; } = 1;
            public int LabelColumnSpan { get; set; } = 2;
            public int ValueColumnSpan { get; set; } = 1;
            public bool AddBorder { get; set; } = false;
            public ExcelBorderStyle BorderStyle { get; set; } = ExcelBorderStyle.Medium;

            public static SummaryLayout Default() => new();
            public static SummaryLayout WithBorder() => new() { AddBorder = true };
            public static SummaryLayout Custom(int marginTop, int startColumn, int labelSpan, int valueSpan) =>
                new() { MarginTop = marginTop, StartColumn = startColumn, LabelColumnSpan = labelSpan, ValueColumnSpan = valueSpan };
        }

        #region Main Methods

        /// <summary>
        /// Tạo summary đơn giản với Dictionary và style chung
        /// </summary>
        public static int CreateSimple(
            ExcelWorksheet worksheet,
            Dictionary<string, object> summaryItems,
            Action<OrdExcelStyleBuilder>? styleBuilder = null,
            SummaryLayout? layout = null)
        {
            layout ??= SummaryLayout.Default();

            var items = summaryItems.Select(kvp =>
                SummaryItem.Create(kvp.Key, kvp.Value, styleBuilder)).ToArray();

            return CreateStyled(worksheet, items, layout);
        }

        /// <summary>
        /// Tạo summary với style riêng cho từng item
        /// </summary>
        public static int CreateStyled(
            ExcelWorksheet worksheet,
            IEnumerable<SummaryItem> summaryItems,
            SummaryLayout? layout = null,
            Action<OrdExcelStyleBuilder>? defaultStyleBuilder = null)
        {
            layout ??= SummaryLayout.Default();
            var lastRow = worksheet.Dimension?.End.Row ?? 1;
            var summaryStartRow = lastRow + layout.MarginTop;
            var currentRow = summaryStartRow;

            foreach (var item in summaryItems)
            {
                var styleToUse = item.StyleBuilder ?? defaultStyleBuilder;

                // Create label
                ExcelTitleHelper.CreateTitle(worksheet, currentRow, layout.StartColumn,
                    layout.LabelColumnSpan, item.Label, styleToUse);

                // Create value
                ExcelTitleHelper.CreateTitle(worksheet, currentRow,
                    layout.StartColumn + layout.LabelColumnSpan, layout.ValueColumnSpan,
                    item.Value?.ToString() ?? "", styleToUse);

                currentRow++;
            }

            // Add border if requested
            if (layout.AddBorder)
            {
                AddBorderToSummary(worksheet, summaryStartRow, currentRow - 1, layout);
            }

            return currentRow;
        }

        /// <summary>
        /// Tạo summary với style riêng cho label và value
        /// </summary>
        public static int CreateWithSeparateStyles(
            ExcelWorksheet worksheet,
            Dictionary<string, object> summaryItems,
            Action<OrdExcelStyleBuilder>? labelStyleBuilder = null,
            Action<OrdExcelStyleBuilder>? valueStyleBuilder = null,
            SummaryLayout? layout = null)
        {
            layout ??= SummaryLayout.Default();
            var lastRow = worksheet.Dimension?.End.Row ?? 1;
            var summaryStartRow = lastRow + layout.MarginTop;
            var currentRow = summaryStartRow;

            foreach (var item in summaryItems)
            {
                // Create label with label style
                ExcelTitleHelper.CreateTitle(worksheet, currentRow, layout.StartColumn,
                    layout.LabelColumnSpan, item.Key, labelStyleBuilder);

                // Create value with value style
                ExcelTitleHelper.CreateTitle(worksheet, currentRow,
                    layout.StartColumn + layout.LabelColumnSpan, layout.ValueColumnSpan,
                    item.Value?.ToString() ?? "", valueStyleBuilder);

                currentRow++;
            }

            // Add border if requested
            if (layout.AddBorder)
            {
                AddBorderToSummary(worksheet, summaryStartRow, currentRow - 1, layout);
            }

            return currentRow;
        }

        #endregion

        #region Quick Methods

        /// <summary>
        /// Tạo summary với style báo cáo mặc định (màu xanh đậm)
        /// </summary>
        public static int CreateReport(
            ExcelWorksheet worksheet,
            Dictionary<string, object> summaryItems,
            SummaryLayout? layout = null)
        {
            return CreateSimple(worksheet, summaryItems, Styles.Report(), layout);
        }

        /// <summary>
        /// Tạo summary với border xung quanh
        /// </summary>
        public static int CreateBordered(
            ExcelWorksheet worksheet,
            Dictionary<string, object> summaryItems,
            Action<OrdExcelStyleBuilder>? styleBuilder = null,
            SummaryLayout? layout = null)
        {
            layout ??= SummaryLayout.WithBorder();
            layout.AddBorder = true;
            return CreateSimple(worksheet, summaryItems, styleBuilder, layout);
        }

        /// <summary>
        /// Tạo summary với màu sắc theo trạng thái (colorized)
        /// </summary>
        public static int CreateColorized(
            ExcelWorksheet worksheet,
            IEnumerable<SummaryItem> summaryItems,
            SummaryLayout? layout = null)
        {
            return CreateStyled(worksheet, summaryItems, layout, Styles.Total());
        }

        #endregion

        #region Preset Templates

        /// <summary>
        /// Template cho thống kê người dùng
        /// </summary>
        public static int CreateUserStatistics<T>(
            ExcelWorksheet worksheet,
            IEnumerable<T> users,
            Func<T, bool> isActiveFunc,
            SummaryLayout? layout = null)
        {
            var userList = users.ToList();
            var totalUsers = userList.Count;
            var activeUsers = userList.Count(isActiveFunc);
            var inactiveUsers = totalUsers - activeUsers;

            var summaryItems = new[]
            {
                SummaryItem.Create("Tổng số người dùng:", totalUsers, Styles.Total()),
                SummaryItem.Create("Người dùng hoạt động:", $"{activeUsers} ({(activeUsers * 100.0 / totalUsers):F1}%)", Styles.Active()),
                SummaryItem.Create("Người dùng không hoạt động:", $"{inactiveUsers} ({(inactiveUsers * 100.0 / totalUsers):F1}%)", Styles.Inactive())
            };

            return CreateColorized(worksheet, summaryItems, layout);
        }

        /// <summary>
        /// Template cho thống kê đơn hàng
        /// </summary>
        public static int CreateOrderStatistics<T>(
            ExcelWorksheet worksheet,
            IEnumerable<T> orders,
            Func<T, string> getStatusFunc,
            Func<T, decimal> getAmountFunc,
            SummaryLayout? layout = null)
        {
            var orderList = orders.ToList();
            var totalOrders = orderList.Count;
            var completedOrders = orderList.Count(o => getStatusFunc(o) == "Completed");
            var processingOrders = orderList.Count(o => getStatusFunc(o) == "Processing");
            var cancelledOrders = orderList.Count(o => getStatusFunc(o) == "Cancelled");
            var totalRevenue = orderList.Where(o => getStatusFunc(o) == "Completed").Sum(getAmountFunc);

            var summaryItems = new[]
            {
                SummaryItem.Create("Tổng đơn hàng:", totalOrders, Styles.Total()),
                SummaryItem.Create("Đơn hàng thành công:", completedOrders, Styles.Success()),
                SummaryItem.Create("Đơn hàng đang xử lý:", processingOrders, Styles.Warning()),
                SummaryItem.Create("Đơn hàng bị hủy:", cancelledOrders, Styles.Error()),
                SummaryItem.Create("Tổng doanh thu:", totalRevenue.ToString("C"), Styles.Revenue())
            };

            return CreateColorized(worksheet, summaryItems, layout);
        }

        #endregion

        #region Styles

        /// <summary>
        /// Preset styles cho summary
        /// </summary>
        public static class Styles
        {
            public static Action<OrdExcelStyleBuilder> Total(string fontName = "Arial", float fontSize = 13) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithFontColor(Color.Black);

            public static Action<OrdExcelStyleBuilder> Active(string fontName = "Arial", float fontSize = 13) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithFontColor(Color.Green);

            public static Action<OrdExcelStyleBuilder> Inactive(string fontName = "Arial", float fontSize = 13) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithFontColor(Color.Red);

            public static Action<OrdExcelStyleBuilder> Success(string fontName = "Arial", float fontSize = 13) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithFontColor(Color.Green);

            public static Action<OrdExcelStyleBuilder> Warning(string fontName = "Arial", float fontSize = 13) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithFontColor(Color.Orange);

            public static Action<OrdExcelStyleBuilder> Error(string fontName = "Arial", float fontSize = 13) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithFontColor(Color.DarkRed);

            public static Action<OrdExcelStyleBuilder> Revenue(string fontName = "Arial", float fontSize = 13) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithFontColor(Color.DarkGreen)
                    .WithBackgroundColor(Color.LightGreen);

            public static Action<OrdExcelStyleBuilder> Report(string fontName = "Arial", float fontSize = 13) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithFontColor(Color.DarkBlue);

            public static Action<OrdExcelStyleBuilder> Highlighted(string fontName = "Arial", float fontSize = 13) =>
                style => style
                    .WithFont(fontName, fontSize)
                    .WithBoldFont()
                    .WithFontColor(Color.White)
                    .WithBackgroundColor(Color.DarkBlue)
                    .WithAllBorders(ExcelBorderStyle.Medium);
        }

        #endregion

        #region Private Helpers

        private static void AddBorderToSummary(ExcelWorksheet worksheet, int startRow, int endRow, SummaryLayout layout)
        {
            var totalColumns = layout.LabelColumnSpan + layout.ValueColumnSpan;
            var summaryRange = worksheet.Cells[startRow, layout.StartColumn, endRow, layout.StartColumn + totalColumns - 1];
            summaryRange.Style.Border.BorderAround(layout.BorderStyle);
        }

        #endregion
    }
}