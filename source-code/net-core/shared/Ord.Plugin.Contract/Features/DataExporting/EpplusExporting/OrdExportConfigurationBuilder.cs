using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.Linq.Expressions;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Builder pattern để cấu hình export dễ dàng
    /// </summary>
    public class OrdExportConfigurationBuilder
    {
        private readonly OrdExportConfiguration _configuration = new();

        #region Worksheet Configuration

        /// <summary>
        /// Thiết lập tên worksheet
        /// </summary>
        public OrdExportConfigurationBuilder WithWorksheetName(string name)
        {
            _configuration.WorksheetName = name;
            return this;
        }

        /// <summary>
        /// Thiết lập chiều cao mặc định của hàng
        /// </summary>
        public OrdExportConfigurationBuilder WithDefaultRowHeight(double height)
        {
            _configuration.DefaultRowHeight = height;
            return this;
        }

        /// <summary>
        /// Thiết lập chiều rộng mặc định của cột
        /// </summary>
        public OrdExportConfigurationBuilder WithDefaultColumnWidth(double width)
        {
            _configuration.DefaultColumnWidth = width;
            return this;
        }

        /// <summary>
        /// Thiết lập auto fit columns
        /// </summary>
        public OrdExportConfigurationBuilder WithAutoFitColumns(bool autoFit = true, double minWidth = 8, double maxWidth = 50)
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
        public OrdExportConfigurationBuilder WithTitle(string title, int rowIndex = 2, double? rowHeight = 32)
        {
            _configuration.Title = new OrdExportTitle
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
        public OrdExportConfigurationBuilder WithTitle(Action<OrdExportTitleBuilder> titleBuilder)
        {
            var builder = new OrdExportTitleBuilder();
            titleBuilder(builder);
            _configuration.Title = builder.Build();
            return this;
        }

        #endregion

        #region Header Configuration

        /// <summary>
        /// Thiết lập vị trí header
        /// </summary>
        public OrdExportConfigurationBuilder WithHeaderRowIndex(int index)
        {
            _configuration.HeaderRowIndex = index;
            return this;
        }

        /// <summary>
        /// Thiết lập tên cột tùy chỉnh
        /// </summary>
        public OrdExportConfigurationBuilder WithCustomColumnNames(params string[] columnNames)
        {
            _configuration.CustomColumnNames = columnNames.ToList();
            return this;
        }

        /// <summary>
        /// Thiết lập style cho header
        /// </summary>
        public OrdExportConfigurationBuilder WithHeaderStyle(Action<OrdExportStyleBuilder> styleBuilder)
        {
            var builder = new OrdExportStyleBuilder();
            styleBuilder(builder);
            _configuration.HeaderStyle = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập style header mặc định
        /// </summary>
        public OrdExportConfigurationBuilder WithDefaultHeaderStyle()
        {
            _configuration.HeaderStyle = OrdExportStyleConfiguration.Header();
            return this;
        }

        #endregion

        #region Data Configuration

        /// <summary>
        /// Thiết lập style cho data cells
        /// </summary>
        public OrdExportConfigurationBuilder WithDataStyle(Action<OrdExportStyleBuilder> styleBuilder)
        {
            var builder = new OrdExportStyleBuilder();
            styleBuilder(builder);
            _configuration.DataStyle = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập hiển thị số thứ tự
        /// </summary>
        public OrdExportConfigurationBuilder WithRowNumber(bool show = true, string columnName = "STT", double width = 5)
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
        public OrdExportConfigurationBuilder WithPrintSettings(Action<OrdExportPrintBuilder> printBuilder)
        {
            var builder = new OrdExportPrintBuilder();
            printBuilder(builder);
            _configuration.PrintSettings = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập hướng in landscape
        /// </summary>
        public OrdExportConfigurationBuilder WithLandscapeOrientation()
        {
            _configuration.PrintSettings.Orientation = eOrientation.Landscape;
            return this;
        }

        /// <summary>
        /// Thiết lập hướng in portrait
        /// </summary>
        public OrdExportConfigurationBuilder WithPortraitOrientation()
        {
            _configuration.PrintSettings.Orientation = eOrientation.Portrait;
            return this;
        }

        #endregion

        #region Advanced Configuration

        /// <summary>
        /// Thiết lập function tùy chỉnh worksheet
        /// </summary>
        public OrdExportConfigurationBuilder WithCustomWorksheet(Action<ExcelWorksheet> customAction)
        {
            _configuration.CustomWorksheetAction = customAction;
            return this;
        }

        /// <summary>
        /// Thiết lập function tùy chỉnh worksheet async
        /// </summary>
        public OrdExportConfigurationBuilder WithCustomWorksheetAsync(Func<ExcelWorksheet, Task> customAction)
        {
            _configuration.CustomWorksheetAsyncAction = customAction;
            return this;
        }

        /// <summary>
        /// Thiết lập bảo vệ worksheet
        /// </summary>
        public OrdExportConfigurationBuilder WithProtection(string? password = null)
        {
            _configuration.ProtectWorksheet = true;
            _configuration.WorksheetPassword = password;
            return this;
        }

        #endregion

        /// <summary>
        /// Build configuration
        /// </summary>
        public OrdExportConfiguration Build() => _configuration;

        /// <summary>
        /// Build action delegate
        /// </summary>
        public Action<OrdExportConfiguration> BuildAction() => config =>
        {
            // Copy all properties from built configuration to the provided one
            typeof(OrdExportConfiguration).GetProperties()
                .Where(p => p.CanWrite)
                .ToList()
                .ForEach(p => p.SetValue(config, p.GetValue(_configuration)));
        };
    }

    /// <summary>
    /// Builder cho Title
    /// </summary>
    public class OrdExportTitleBuilder
    {
        private readonly OrdExportTitle _title = new();

        public OrdExportTitleBuilder WithText(string text)
        {
            _title.Text = text;
            return this;
        }

        public OrdExportTitleBuilder WithRowIndex(int rowIndex)
        {
            _title.RowIndex = rowIndex;
            return this;
        }

        public OrdExportTitleBuilder WithRowHeight(double height)
        {
            _title.RowHeight = height;
            return this;
        }

        public OrdExportTitleBuilder WithStyle(Action<OrdExportStyleBuilder> styleBuilder)
        {
            var builder = new OrdExportStyleBuilder();
            styleBuilder(builder);
            _title.Style = builder.Build();
            return this;
        }

        public OrdExportTitleBuilder WithCustomStyle(Action<ExcelStyle> customAction)
        {
            _title.CustomStyleAction = customAction;
            return this;
        }

        public OrdExportTitle Build() => _title;
    }

    /// <summary>
    /// Builder cho Style
    /// </summary>
    public class OrdExportStyleBuilder
    {
        private readonly OrdExportStyleConfiguration _style = new();

        #region Font Settings

        public OrdExportStyleBuilder WithFont(string fontName, float? fontSize = null)
        {
            _style.FontName = fontName;
            if (fontSize.HasValue)
                _style.FontSize = fontSize;
            return this;
        }

        public OrdExportStyleBuilder WithFontSize(float size)
        {
            _style.FontSize = size;
            return this;
        }

        public OrdExportStyleBuilder WithBoldFont(bool bold = true)
        {
            _style.IsBold = bold;
            return this;
        }

        public OrdExportStyleBuilder WithItalicFont(bool italic = true)
        {
            _style.IsItalic = italic;
            return this;
        }

        public OrdExportStyleBuilder WithUnderlineFont(bool underline = true)
        {
            _style.IsUnderline = underline;
            return this;
        }

        public OrdExportStyleBuilder WithFontColor(Color color)
        {
            _style.FontColor = color;
            return this;
        }

        #endregion

        #region Alignment Settings

        public OrdExportStyleBuilder WithHorizontalAlignment(ExcelHorizontalAlignment alignment)
        {
            _style.HorizontalAlignment = alignment;
            return this;
        }

        public OrdExportStyleBuilder WithVerticalAlignment(ExcelVerticalAlignment alignment)
        {
            _style.VerticalAlignment = alignment;
            return this;
        }

        public OrdExportStyleBuilder WithCenterAlignment()
        {
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            _style.VerticalAlignment = ExcelVerticalAlignment.Center;
            return this;
        }

        public OrdExportStyleBuilder WithWrapText(bool wrap = true)
        {
            _style.WrapText = wrap;
            return this;
        }

        #endregion

        #region Background Settings

        public OrdExportStyleBuilder WithBackgroundColor(Color color, ExcelFillStyle? pattern = null)
        {
            _style.BackgroundColor = color;
            _style.FillPattern = pattern ?? ExcelFillStyle.Solid;
            return this;
        }

        #endregion

        #region Border Settings

        public OrdExportStyleBuilder WithBorder(Action<OrdExportBorderBuilder> borderBuilder)
        {
            var builder = new OrdExportBorderBuilder();
            borderBuilder(builder);
            _style.Border = builder.Build();
            return this;
        }

        public OrdExportStyleBuilder WithAllBorders(ExcelBorderStyle style = ExcelBorderStyle.Thin)
        {
            _style.Border = OrdExportBorderConfiguration.All(style);
            return this;
        }

        public OrdExportStyleBuilder WithAroundBorder(ExcelBorderStyle style = ExcelBorderStyle.Medium)
        {
            _style.Border = OrdExportBorderConfiguration.Around(style);
            return this;
        }

        #endregion

        #region Number Format Settings

        public OrdExportStyleBuilder WithNumberFormat(string format)
        {
            _style.NumberFormat = format;
            return this;
        }

        public OrdExportStyleBuilder WithCurrencyFormat(string currencySymbol = "₫")
        {
            _style.NumberFormat = $"#,##0.00 {currencySymbol}";
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            return this;
        }

        public OrdExportStyleBuilder WithDateFormat(string format = "dd/mm/yyyy")
        {
            _style.NumberFormat = format;
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            return this;
        }

        public OrdExportStyleBuilder WithDateTimeFormat(string format = "dd/mm/yyyy hh:mm:ss")
        {
            _style.NumberFormat = format;
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            return this;
        }

        public OrdExportStyleBuilder WithPercentageFormat(int decimals = 2)
        {
            _style.NumberFormat = decimals == 0 ? "0%" : $"0.{new string('0', decimals)}%";
            _style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            return this;
        }

        #endregion

        public OrdExportStyleConfiguration Build() => _style;
    }

    /// <summary>
    /// Builder cho Border
    /// </summary>
    public class OrdExportBorderBuilder
    {
        private readonly OrdExportBorderConfiguration _border = new();

        public OrdExportBorderBuilder WithTop(ExcelBorderStyle style)
        {
            _border.Top = style;
            return this;
        }

        public OrdExportBorderBuilder WithBottom(ExcelBorderStyle style)
        {
            _border.Bottom = style;
            return this;
        }

        public OrdExportBorderBuilder WithLeft(ExcelBorderStyle style)
        {
            _border.Left = style;
            return this;
        }

        public OrdExportBorderBuilder WithRight(ExcelBorderStyle style)
        {
            _border.Right = style;
            return this;
        }

        public OrdExportBorderBuilder WithAll(ExcelBorderStyle style)
        {
            _border.Top = style;
            _border.Bottom = style;
            _border.Left = style;
            _border.Right = style;
            return this;
        }

        public OrdExportBorderBuilder WithColor(Color color)
        {
            _border.Color = color;
            return this;
        }

        public OrdExportBorderConfiguration Build() => _border;
    }

    /// <summary>
    /// Builder cho Print Configuration
    /// </summary>
    public class OrdExportPrintBuilder
    {
        private readonly OrdExportPrintConfiguration _print = new();

        public OrdExportPrintBuilder WithOrientation(eOrientation orientation)
        {
            _print.Orientation = orientation;
            return this;
        }

        public OrdExportPrintBuilder WithFitToPage(bool fit = true, int width = 1, int height = 0)
        {
            _print.FitToPage = fit;
            _print.FitToWidth = width;
            _print.FitToHeight = height;
            return this;
        }

        public OrdExportPrintBuilder WithMargins(decimal left, decimal right, decimal top, decimal bottom)
        {
            _print.LeftMargin = left;
            _print.RightMargin = right;
            _print.TopMargin = top;
            _print.BottomMargin = bottom;
            return this;
        }

        public OrdExportPrintBuilder WithHeader(string header)
        {
            _print.Header = header;
            return this;
        }

        public OrdExportPrintBuilder WithFooter(string footer)
        {
            _print.Footer = footer;
            return this;
        }

        public OrdExportPrintConfiguration Build() => _print;
    }

    /// <summary>
    /// Fluent column builder được tối ưu hóa
    /// </summary>
    public class OrdExportColumnBuilder<T>
    {
        private readonly List<OrdExportColumnData<T>> _columns = new();

        /// <summary>
        /// Thêm cột số thứ tự
        /// </summary>
        public OrdExportColumnBuilder<T> AddRowIndex(string headerName = "STT", double? width = 5)
        {
            _columns.Add(OrdExportColumnData<T>.RowIndex(headerName, width));
            return this;
        }

        /// <summary>
        /// Thêm cột đơn giản
        /// </summary>
        public OrdExportColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName = null,
            double? width = null)
        {
            _columns.Add(OrdExportColumnData<T>.Create(expression, headerName, width));
            return this;
        }

        /// <summary>
        /// Thêm cột với style configuration
        /// </summary>
        public OrdExportColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Action<OrdExportStyleBuilder> styleBuilder,
            double? width = null)
        {
            var builder = new OrdExportStyleBuilder();
            styleBuilder(builder);
            var style = builder.Build();

            _columns.Add(OrdExportColumnData<T>.Create(expression, headerName, style, width));
            return this;
        }

        /// <summary>
        /// Thêm cột với custom style action
        /// </summary>
        public OrdExportColumnBuilder<T> AddColumn<TProperty>(
            Expression<Func<T, TProperty>> expression,
            string? headerName,
            Action<T, ExcelStyle> customStyleAction,
            double? width = null)
        {
            var column = OrdExportColumnData<T>.Create(expression, headerName, width);
            column.CustomStyleAction = customStyleAction;
            _columns.Add(column);
            return this;
        }

        /// <summary>
        /// Thêm cột currency
        /// </summary>
        public OrdExportColumnBuilder<T> AddCurrencyColumn<TProperty>(
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
        public OrdExportColumnBuilder<T> AddDateColumn<TProperty>(
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
        public OrdExportColumnBuilder<T> AddDateTimeColumn<TProperty>(
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
        public OrdExportColumnBuilder<T> AddPercentageColumn<TProperty>(
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
        public OrdExportColumnBuilder<T> AddConditionalColumn<TProperty>(
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
        public OrdExportColumnBuilder<T> AddConditionalBackgroundColumn<TProperty>(
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

        public OrdExportColumnData<T>[] Build() => _columns.ToArray();
    }
}