using OfficeOpenXml.Style;
using Ord.Plugin.Contract.Factories;
using System.Drawing;
using System.Linq.Expressions;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Fluent builder cho một cột cụ thể
    /// </summary>
    /// <typeparam name="T">Kiểu dữ liệu</typeparam>
    public class OrdExcelColumnFluentBuilder<T>
    {
        private readonly OrdExcelColumnData<T> _column;

        internal OrdExcelColumnFluentBuilder(IAppFactory appFactory)
        {
            _column = new OrdExcelColumnData<T>(data => string.Empty);
            AppFactory = appFactory;
        }
        public IAppFactory AppFactory { get; }

        /// <summary>
        /// Thiết lập base configuration cho cột với auto property name detection
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithBase<TProperty>(
            Expression<Func<T, TProperty>> expression,
            double? width = 10,
            string? headerName = null)
        {
            // Set value selector
            WithValue(expression);

            // Extract property name if headerName is null
            var finalHeaderName = headerName ?? GetPropertyName(expression);

            if (_column.Header == null)
            {
                _column.Header = OrdExcelTableHeader.Create(finalHeaderName, width);
            }
            else
            {
                _column.Header.HeaderName = finalHeaderName;
                _column.Header.Width = width;
            }

            if (width.HasValue)
            {
                _column.Width = width;
            }

            return this;
        }
        /// <summary>
        /// Extract property name from Expression
        /// </summary>
        private string GetPropertyName<TProperty>(Expression<Func<T, TProperty>> expression)
        {
            return expression.Body switch
            {
                MemberExpression member => member.Member.Name,
                UnaryExpression unary when unary.Operand is MemberExpression memberUnary => memberUnary.Member.Name,
                _ => "Column"
            };
        }
        /// <summary>
        /// Thiết lập value selector cho cột
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithValue<TProperty>(Expression<Func<T, TProperty>> expression)
        {
            _column.ValueSelector = data => expression.Compile()(data);
            if (_column.Header == null)
            {
                _column.Header = OrdExcelTableHeader.Create(GetPropertyName(expression), 10);
            }
            return this;
        }

        /// <summary>
        /// Thiết lập header cho cột
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithHeader(string headerName)
        {
            _column.Header = OrdExcelTableHeader.Create(headerName);
            return this;
        }

        /// <summary>
        /// Thiết lập header với cấu hình chi tiết
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithHeader(string headerName, Action<OrdExcelTableHeaderBuilder> headerBuilder)
        {
            var builder = new OrdExcelTableHeaderBuilder(headerName);
            headerBuilder(builder);
            _column.Header = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập chiều rộng cột
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithWidth(double width)
        {
            _column.Width = width;
            if (_column.Header != null)
            {
                _column.Header.Width = width;
            }
            return this;
        }

        /// <summary>
        /// Thiết lập style cho cột
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithStyle(Action<OrdExcelStyleBuilder> styleBuilder)
        {
            var builder = new OrdExcelStyleBuilder();
            styleBuilder(builder);
            var newStyle = builder.Build();

            if (_column.Style == null)
            {
                _column.Style = newStyle;
            }
            else
            {
                // Merge styles - giữ lại giá trị cũ và append giá trị mới
                _column.Style = MergeStyles(_column.Style, newStyle);
            }
            return this;
        }

        /// <summary>
        /// Merge two style configurations, new style overrides existing style where values are provided
        /// </summary>
        private OrdExcelStyleConfiguration MergeStyles(OrdExcelStyleConfiguration existingStyle, OrdExcelStyleConfiguration newStyle)
        {
            var mergedStyle = new OrdExcelStyleConfiguration();

            // Font settings - new overrides existing
            mergedStyle.FontName = newStyle.FontName ?? existingStyle.FontName;
            mergedStyle.FontSize = newStyle.FontSize ?? existingStyle.FontSize;
            mergedStyle.IsBold = newStyle.IsBold || existingStyle.IsBold; // True if either is true
            mergedStyle.IsItalic = newStyle.IsItalic || existingStyle.IsItalic;
            mergedStyle.IsUnderline = newStyle.IsUnderline || existingStyle.IsUnderline;
            mergedStyle.FontColor = newStyle.FontColor ?? existingStyle.FontColor;

            // Alignment settings - new overrides existing
            mergedStyle.HorizontalAlignment = newStyle.HorizontalAlignment ?? existingStyle.HorizontalAlignment;
            mergedStyle.VerticalAlignment = newStyle.VerticalAlignment ?? existingStyle.VerticalAlignment;
            mergedStyle.WrapText = newStyle.WrapText || existingStyle.WrapText; // True if either is true

            // Background settings - new overrides existing
            mergedStyle.BackgroundColor = newStyle.BackgroundColor ?? existingStyle.BackgroundColor;
            mergedStyle.FillPattern = newStyle.FillPattern ?? existingStyle.FillPattern;

            // Border settings - merge borders
            if (newStyle.Border != null || existingStyle.Border != null)
            {
                mergedStyle.Border = MergeBorders(existingStyle.Border, newStyle.Border);
            }

            // Number format - new overrides existing
            mergedStyle.NumberFormat = newStyle.NumberFormat ?? existingStyle.NumberFormat;

            return mergedStyle;
        }

        /// <summary>
        /// Merge border configurations
        /// </summary>
        private OrdExcelBorderConfiguration MergeBorders(OrdExcelBorderConfiguration? existingBorder, OrdExcelBorderConfiguration? newBorder)
        {
            if (existingBorder == null && newBorder == null)
                return null;

            if (existingBorder == null)
                return newBorder;

            if (newBorder == null)
                return existingBorder;

            return new OrdExcelBorderConfiguration
            {
                Top = newBorder.Top ?? existingBorder.Top,
                Bottom = newBorder.Bottom ?? existingBorder.Bottom,
                Left = newBorder.Left ?? existingBorder.Left,
                Right = newBorder.Right ?? existingBorder.Right,
                Color = newBorder.Color ?? existingBorder.Color
            };
        }

        /// <summary>
        /// Thiết lập custom style action
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithCustomStyle(Action<T, ExcelStyle> customStyleAction)
        {
            _column.CustomStyleAction = customStyleAction;
            return this;
        }

        /// <summary>
        /// Thiết lập value formatter
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithFormatter(Func<object, object> formatter)
        {
            _column.ValueFormatter = formatter;
            return this;
        }

        /// <summary>
        /// Thiết lập format currency
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithCurrencyFormat(string currencySymbol = "₫")
        {
            return WithStyle(style => style.WithCurrencyFormat(currencySymbol));
        }

        /// <summary>
        /// Thiết lập format date
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithDateFormat(string format = "dd/mm/yyyy")
        {
            return WithStyle(style => style.WithDateFormat(format));
        }

        /// <summary>
        /// Thiết lập format datetime
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithDateTimeFormat(string format = "dd/mm/yyyy hh:mm:ss")
        {
            return WithStyle(style => style.WithDateTimeFormat(format)).WithWrapText();
        }

        /// <summary>
        /// Thiết lập format percentage
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithPercentageFormat(int decimals = 2)
        {
            return WithStyle(style => style.WithPercentageFormat(decimals));
        }

        /// <summary>
        /// Thiết lập conditional formatting
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithConditionalFormat(
            Func<T, bool> condition,
            Color trueColor,
            Color falseColor)
        {
            return WithCustomStyle((data, style) =>
            {
                var color = condition(data) ? trueColor : falseColor;
                style.Font.Color.SetColor(color);
            });
        }

        /// <summary>
        /// Thiết lập conditional background
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithConditionalBackground(
            Func<T, bool> condition,
            Color trueBackgroundColor,
            Color falseBackgroundColor)
        {
            return WithCustomStyle((data, style) =>
            {
                var color = condition(data) ? trueBackgroundColor : falseBackgroundColor;
                style.Fill.PatternType = ExcelFillStyle.Solid;
                style.Fill.BackgroundColor.SetColor(color);
            });
        }

        /// <summary>
        /// Thiết lập căn giữa
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithCenterAlignment()
        {
            return WithStyle(style => style.WithCenterAlignment());
        }

        /// <summary>
        /// Thiết lập căn trái
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithLeftAlignment()
        {
            return WithStyle(style => style.WithHorizontalAlignment(ExcelHorizontalAlignment.Left));
        }

        /// <summary>
        /// Thiết lập căn phải
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithRightAlignment()
        {
            return WithStyle(style => style.WithHorizontalAlignment(ExcelHorizontalAlignment.Right));
        }

        /// <summary>
        /// Thiết lập font đậm
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithBoldFont()
        {
            return WithStyle(style => style.WithBoldFont());
        }

        /// <summary>
        /// Thiết lập wrap text
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithWrapText(bool wrap = true)
        {
            return WithStyle(style => style.WithWrapText(wrap));
        }

        /// <summary>
        /// Thiết lập viền
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithBorders(ExcelBorderStyle style = ExcelBorderStyle.Thin)
        {
            return WithStyle(s => s.WithAllBorders(style));
        }

        /// <summary>
        /// Thiết lập màu nền
        /// </summary>
        public OrdExcelColumnFluentBuilder<T> WithBackgroundColor(Color color)
        {
            return WithStyle(style => style.WithBackgroundColor(color));
        }

        /// <summary>
        /// Build column data
        /// </summary>
        internal OrdExcelColumnData<T> Build() => _column;
    }

    /// <summary>
    /// Builder cho header configuration
    /// </summary>
    public class OrdExcelTableHeaderBuilder
    {
        private readonly OrdExcelTableHeader _header;

        internal OrdExcelTableHeaderBuilder(string headerName)
        {
            _header = new OrdExcelTableHeader
            {
                HeaderName = headerName
            };
        }

        /// <summary>
        /// Thiết lập chiều rộng header
        /// </summary>
        public OrdExcelTableHeaderBuilder WithWidth(double width)
        {
            _header.Width = width;
            return this;
        }

        /// <summary>
        /// Thiết lập style cho header
        /// </summary>
        public OrdExcelTableHeaderBuilder WithStyle(Action<OrdExcelStyleBuilder> styleBuilder)
        {
            var builder = new OrdExcelStyleBuilder();
            styleBuilder(builder);
            _header.Style = builder.Build();
            return this;
        }

        /// <summary>
        /// Thiết lập custom style action cho header
        /// </summary>
        public OrdExcelTableHeaderBuilder WithCustomStyle(Action<ExcelStyle, string> customStyleAction)
        {
            _header.CustomStyleAction = customStyleAction;
            return this;
        }

        /// <summary>
        /// Build header
        /// </summary>
        internal OrdExcelTableHeader Build() => _header;
    }
}