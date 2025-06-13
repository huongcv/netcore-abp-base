using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.Linq.Expressions;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Builder pattern để cấu hình export dễ dàng
    /// </summary>
    public class OrdExcelConfigurationBuilder
    {
        private readonly OrdExcelConfiguration _configuration = new();

        #region Worksheet Configuration

        /// <summary>
        /// Thiết lập tên worksheet
        /// </summary>
        public OrdExcelConfigurationBuilder WithWorksheetName(string name)
        {
            _configuration.WorksheetName = name;
            return this;
        }

        /// <summary>
        /// Thiết lập chiều cao mặc định của hàng
        /// </summary>
        public OrdExcelConfigurationBuilder WithDefaultRowHeight(double height)
        {
            _configuration.DefaultRowHeight = height;
            return this;
        }

        /// <summary>
        /// Thiết lập chiều rộng mặc định của cột
        /// </summary>
        public OrdExcelConfigurationBuilder WithDefaultColumnWidth(double width)
        {
            _configuration.DefaultColumnWidth = width;
            return this;
        }

        /// <summary>
        /// Thiết lập auto fit columns
        /// </summary>
        public OrdExcelConfigurationBuilder WithAutoFitColumns(bool autoFit = true, double minWidth = 8, double maxWidth = 50)
        {
            _configuration.AutoFitColumns = autoFit;
            _configuration.MinColumnWidth = minWidth;
            _configuration.MaxColumnWidth = maxWidth;
            return this;
        }

        #endregion

        #region Title Configuration

        /// <summary>
        /// Thiết lập tiêu đề đơn giản
        /// </summary>
        public OrdExcelConfigurationBuilder WithTitle(string title, int rowIndex = 2, double? rowHeight = 32)
        {
            _configuration.Title = new OrdExcelTitle
            {
                Text = title,
                RowIndex = rowIndex,
                RowHeight = rowHeight
            };
            return this;
        }

        /// <summary>
        /// Thiết lập tiêu đề với cấu hình chi tiết
        /// </summary>
        public OrdExcelConfigurationBuilder WithTitle(Action<OrdExcelTitleBuilder> titleBuilder)
        {
            var builder = new OrdExcelTitleBuilder();
            titleBuilder(builder);
            _configuration.Title = builder.Build();
            return this;
        }

        #endregion

        #region Header Configuration

        /// <summary>
        /// Thiết lập vị trí header
        /// </summary>
        public OrdExcelConfigurationBuilder WithHeaderRowIndex(int index)
        {
            _configuration.HeaderRowIndex = index;
            return this;
        }

        /// <summary>
        /// Thiết lập tên cột tùy chỉnh
        /// </summary>
        public OrdExcelConfigurationBuilder WithCustomColumnNames(params string[] columnNames)
        {
            _configuration.CustomColumnNames = columnNames.ToList();
            return this;
        }

        /// <summary>
        /// Thiết lập style cho header
        /// </summary>
        public OrdExcelConfigurationBuilder WithHeaderStyle(Action<OrdExcelStyleBuilder> styleBuilder)
        {
            var builder = new OrdExcelStyleBuilder();
            styleBuilder(builder);
            _configuration.HeaderStyle = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập style header mặc định
        /// </summary>
        public OrdExcelConfigurationBuilder WithDefaultHeaderStyle()
        {
            _configuration.HeaderStyle = OrdExcelStyleConfiguration.Header();
            return this;
        }

        #endregion

        #region Data Configuration

        /// <summary>
        /// Thiết lập style cho data cells
        /// </summary>
        public OrdExcelConfigurationBuilder WithDataStyle(Action<OrdExcelStyleBuilder> styleBuilder)
        {
            var builder = new OrdExcelStyleBuilder();
            styleBuilder(builder);
            _configuration.DataStyle = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập hiển thị số thứ tự
        /// </summary>
        public OrdExcelConfigurationBuilder WithRowNumber(bool show = true, string columnName = "STT", double width = 5)
        {
            _configuration.ShowRowNumber = show;
            _configuration.RowNumberColumnName = columnName;
            _configuration.RowNumberColumnWidth = width;
            return this;
        }

        #endregion

        #region Print Configuration

        /// <summary>
        /// Thiết lập cấu hình in ấn
        /// </summary>
        public OrdExcelConfigurationBuilder WithPrintSettings(Action<OrdExcelPrintBuilder> printBuilder)
        {
            var builder = new OrdExcelPrintBuilder();
            printBuilder(builder);
            _configuration.PrintSettings = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập hướng in landscape
        /// </summary>
        public OrdExcelConfigurationBuilder WithLandscapeOrientation()
        {
            _configuration.PrintSettings.Orientation = eOrientation.Landscape;
            return this;
        }

        /// <summary>
        /// Thiết lập hướng in portrait
        /// </summary>
        public OrdExcelConfigurationBuilder WithPortraitOrientation()
        {
            _configuration.PrintSettings.Orientation = eOrientation.Portrait;
            return this;
        }

        #endregion

        #region Advanced Configuration

        /// <summary>
        /// Thiết lập function tùy chỉnh worksheet
        /// </summary>
        public OrdExcelConfigurationBuilder WithCustomWorksheet(Action<ExcelWorksheet> customAction)
        {
            _configuration.CustomWorksheetAction = customAction;
            return this;
        }

        /// <summary>
        /// Thiết lập function tùy chỉnh worksheet async
        /// </summary>
        public OrdExcelConfigurationBuilder WithCustomWorksheetAsync(Func<ExcelWorksheet, Task> customAction)
        {
            _configuration.CustomWorksheetAsyncAction = customAction;
            return this;
        }

        /// <summary>
        /// Thiết lập bảo vệ worksheet
        /// </summary>
        public OrdExcelConfigurationBuilder WithProtection(string? password = null)
        {
            _configuration.ProtectWorksheet = true;
            _configuration.WorksheetPassword = password;
            return this;
        }

        #endregion

        /// <summary>
        /// Build configuration
        /// </summary>
        public OrdExcelConfiguration Build() => _configuration;

        /// <summary>
        /// Build action delegate
        /// </summary>
        public Action<OrdExcelConfiguration> BuildAction() => config =>
        {
            // Copy all properties from built configuration to the provided one
            typeof(OrdExcelConfiguration).GetProperties()
                .Where(p => p.CanWrite)
                .ToList()
                .ForEach(p => p.SetValue(config, p.GetValue(_configuration)));
        };
    }

    /// <summary>
    /// Builder cho Title
    /// </summary>
    public class OrdExcelTitleBuilder
    {
        private readonly OrdExcelTitle _title = new();

        public OrdExcelTitleBuilder WithText(string text)
        {
            _title.Text = text;
            return this;
        }

        public OrdExcelTitleBuilder WithRowIndex(int rowIndex)
        {
            _title.RowIndex = rowIndex;
            return this;
        }

        public OrdExcelTitleBuilder WithRowHeight(double height)
        {
            _title.RowHeight = height;
            return this;
        }
        public OrdExcelTitleBuilder WithMarginBottomRow(int marginBottomRow)
        {
            _title.MarginBottomRow = marginBottomRow;
            return this;
        }

        public OrdExcelTitleBuilder WithStyle(Action<OrdExcelStyleBuilder> styleBuilder)
        {
            var builder = new OrdExcelStyleBuilder();
            styleBuilder(builder);
            _title.Style = builder.Build();
            return this;
        }

        public OrdExcelTitleBuilder WithCustomStyle(Action<ExcelStyle> customAction)
        {
            _title.CustomStyleAction = customAction;
            return this;
        }

        public OrdExcelTitle Build() => _title;
    }

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

        public OrdExcelStyleConfiguration Build() => _style;
    }

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

    /// <summary>
    /// Fluent column builder được tối ưu hóa
    /// </summary>
    public class OrdExcelColumnBuilder<T>
    {
        private readonly List<OrdExcelColumnData<T>> _columns = new();

        /// <summary>
        /// Thêm cột số thứ tự
        /// </summary>
        public OrdExcelColumnBuilder<T> AddRowIndex(string headerName = "STT", double? width = 5)
        {
            _columns.Add(OrdExcelColumnData<T>.RowIndex(headerName, width));
            return this;
        }

        /// <summary>
        /// Thêm cột đơn giản
        /// </summary>
        public OrdExcelColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            double? width = null)
        {
            _columns.Add(OrdExcelColumnData<T>.Create(expression, headerName, width));
            return this;
        }

        /// <summary>
        /// Thêm cột với style configuration
        /// </summary>
        public OrdExcelColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Action<OrdExcelStyleBuilder> styleBuilder,
            double? width = null)
        {
            var builder = new OrdExcelStyleBuilder();
            styleBuilder(builder);
            var style = builder.Build();

            _columns.Add(OrdExcelColumnData<T>.Create(expression, headerName, style, width));
            return this;
        }

        /// <summary>
        /// Thêm cột với custom style action
        /// </summary>
        public OrdExcelColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Action<T, ExcelStyle> customStyleAction,
            double? width = null)
        {
            var column = OrdExcelColumnData<T>.Create(expression, headerName, width);
            column.CustomStyleAction = customStyleAction;
            _columns.Add(column);
            return this;
        }

        /// <summary>
        /// Thêm cột currency
        /// </summary>
        public OrdExcelColumnBuilder<T> AddCurrencyColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            string currencySymbol = "₫",
            double? width = null)
        {
            return AddColumn(expression, headerName, style =>
            {
                style.WithCurrencyFormat(currencySymbol);
            }, width);
        }

        /// <summary>
        /// Thêm cột date
        /// </summary>
        public OrdExcelColumnBuilder<T> AddDateColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            string format = "dd/mm/yyyy",
            double? width = null)
        {
            return AddColumn(expression, headerName, style =>
            {
                style.WithDateFormat(format);
            }, width);
        }

        /// <summary>
        /// Thêm cột datetime
        /// </summary>
        public OrdExcelColumnBuilder<T> AddDateTimeColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            string format = "dd/mm/yyyy hh:mm:ss",
            double? width = null)
        {
            return AddColumn(expression, headerName, style =>
            {
                style.WithDateTimeFormat(format);
            }, width);
        }

        /// <summary>
        /// Thêm cột percentage
        /// </summary>
        public OrdExcelColumnBuilder<T> AddPercentageColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            int decimals = 2,
            double? width = null)
        {
            return AddColumn(expression, headerName, style =>
            {
                style.WithPercentageFormat(decimals);
            }, width);
        }

        /// <summary>
        /// Thêm cột với conditional formatting
        /// </summary>
        public OrdExcelColumnBuilder<T> AddConditionalColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Func<T, bool> condition,
            Color trueColor,
            Color falseColor,
            double? width = null)
        {
            return AddColumn(expression, headerName, (data, style) =>
            {
                var color = condition(data) ? trueColor : falseColor;
                style.Font.Color.SetColor(color);
            }, width);
        }

        /// <summary>
        /// Thêm cột với conditional background
        /// </summary>
        public OrdExcelColumnBuilder<T> AddConditionalBackgroundColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Func<T, bool> condition,
            Color trueBackgroundColor,
            Color falseBackgroundColor,
            double? width = null)
        {
            return AddColumn(expression, headerName, (data, style) =>
            {
                var color = condition(data) ? trueBackgroundColor : falseBackgroundColor;
                style.Fill.PatternType = ExcelFillStyle.Solid;
                style.Fill.BackgroundColor.SetColor(color);
            }, width);
        }

        public OrdExcelColumnData<T>[] Build() => _columns.ToArray();
    }
}