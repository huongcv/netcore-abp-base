using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.Linq.Expressions;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Cấu hình xuất Excel được tối ưu hóa với Builder pattern và Fluent API
    /// </summary>
    public class OrdExportConfiguration
    {
        #region Worksheet Settings

        /// <summary>
        /// Tên worksheet
        /// </summary>
        public string WorksheetName { get; set; } = "Data";

        /// <summary>
        /// Chiều cao mặc định của hàng
        /// </summary>
        public double DefaultRowHeight { get; set; } = 15;

        /// <summary>
        /// Chiều rộng mặc định của cột
        /// </summary>
        public double DefaultColumnWidth { get; set; } = 12;

        /// <summary>
        /// Có tự động fit cột hay không
        /// </summary>
        public bool AutoFitColumns { get; set; } = true;

        /// <summary>
        /// Chiều rộng tối thiểu khi auto fit
        /// </summary>
        public double MinColumnWidth { get; set; } = 8;

        /// <summary>
        /// Chiều rộng tối đa khi auto fit
        /// </summary>
        public double MaxColumnWidth { get; set; } = 50;

        #endregion

        #region Title Settings

        /// <summary>
        /// Cấu hình tiêu đề
        /// </summary>
        public OrdExportTitle? Title { get; set; }

        #endregion

        #region Header Settings

        /// <summary>
        /// Chỉ số hàng bắt đầu của header (1-based)
        /// </summary>
        public int HeaderRowIndex { get; set; } = 5;

        /// <summary>
        /// Danh sách tên cột tùy chỉnh
        /// </summary>
        public List<string>? CustomColumnNames { get; set; }

        /// <summary>
        /// Cấu hình style cho header
        /// </summary>
        public OrdExportStyleConfiguration HeaderStyle { get; set; } = new();

        #endregion

        #region Data Settings

        /// <summary>
        /// Cấu hình style cho data cells
        /// </summary>
        public OrdExportStyleConfiguration DataStyle { get; set; } = new();

        /// <summary>
        /// Có hiển thị số thứ tự hay không
        /// </summary>
        public bool ShowRowNumber { get; set; } = true;

        /// <summary>
        /// Tên cột số thứ tự
        /// </summary>
        public string RowNumberColumnName { get; set; } = "STT";

        /// <summary>
        /// Chiều rộng cột số thứ tự
        /// </summary>
        public double RowNumberColumnWidth { get; set; } = 5;

        #endregion

        #region Print Settings

        /// <summary>
        /// Cấu hình in ấn
        /// </summary>
        public OrdExportPrintConfiguration PrintSettings { get; set; } = new();

        #endregion

        #region Advanced Settings

        /// <summary>
        /// Function tùy chỉnh worksheet (sync)
        /// </summary>
        public Action<ExcelWorksheet>? CustomWorksheetAction { get; set; }

        /// <summary>
        /// Function tùy chỉnh worksheet (async)
        /// </summary>
        public Func<ExcelWorksheet, Task>? CustomWorksheetAsyncAction { get; set; }

        /// <summary>
        /// Có bảo vệ worksheet hay không
        /// </summary>
        public bool ProtectWorksheet { get; set; } = false;

        /// <summary>
        /// Mật khẩu bảo vệ worksheet
        /// </summary>
        public string? WorksheetPassword { get; set; }

        #endregion

        #region Factory Methods

        /// <summary>
        /// Tạo cấu hình mặc định
        /// </summary>
        public static OrdExportConfiguration Default() => new();

        /// <summary>
        /// Tạo cấu hình với tiêu đề đơn giản
        /// </summary>
        public static OrdExportConfiguration WithTitle(string title)
        {
            return new OrdExportConfiguration
            {
                WorksheetName = title,
                Title = OrdExportTitle.Create(title)
            };
        }

        /// <summary>
        /// Tạo builder để cấu hình
        /// </summary>
        public static OrdExportConfigurationBuilder Builder() => new();

        #endregion
    }

    /// <summary>
    /// Cấu hình tiêu đề được tối ưu hóa
    /// </summary>
    public class OrdExportTitle
    {
        /// <summary>
        /// Nội dung tiêu đề
        /// </summary>
        public string? Text { get; set; }

        /// <summary>
        /// Vị trí hàng của tiêu đề (1-based)
        /// </summary>
        public int RowIndex { get; set; } = 2;

        /// <summary>
        /// Chiều cao hàng tiêu đề
        /// </summary>
        public double? RowHeight { get; set; } = 32;

        /// <summary>
        /// Cấu hình style cho tiêu đề
        /// </summary>
        public OrdExportStyleConfiguration Style { get; set; } = new()
        {
            FontSize = 16,
            IsBold = true,
            HorizontalAlignment = ExcelHorizontalAlignment.Center,
            VerticalAlignment = ExcelVerticalAlignment.Center
        };

        /// <summary>
        /// Function tùy chỉnh style
        /// </summary>
        public Action<ExcelStyle>? CustomStyleAction { get; set; }

        /// <summary>
        /// Tạo tiêu đề đơn giản
        /// </summary>
        public static OrdExportTitle Create(string text, int rowIndex = 2) => new()
        {
            Text = text,
            RowIndex = rowIndex
        };
    }

    /// <summary>
    /// Cấu hình style được tối ưu hóa
    /// </summary>
    public class OrdExportStyleConfiguration
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

        public OrdExportBorderConfiguration? Border { get; set; }

        #endregion

        #region Number Format Settings

        public string? NumberFormat { get; set; }

        #endregion

        #region Factory Methods

        public static OrdExportStyleConfiguration Default() => new();

        public static OrdExportStyleConfiguration Header() => new()
        {
            IsBold = true,
            HorizontalAlignment = ExcelHorizontalAlignment.Center,
            VerticalAlignment = ExcelVerticalAlignment.Center,
            BackgroundColor = Color.LightGray,
            Border = OrdExportBorderConfiguration.All()
        };

        public static OrdExportStyleConfiguration Currency() => new()
        {
            NumberFormat = "#,##0.00 ₫",
            HorizontalAlignment = ExcelHorizontalAlignment.Right
        };

        public static OrdExportStyleConfiguration Date() => new()
        {
            NumberFormat = "dd/mm/yyyy",
            HorizontalAlignment = ExcelHorizontalAlignment.Center
        };

        public static OrdExportStyleConfiguration DateTime() => new()
        {
            NumberFormat = "dd/mm/yyyy hh:mm:ss",
            HorizontalAlignment = ExcelHorizontalAlignment.Center
        };

        public static OrdExportStyleConfiguration Percentage() => new()
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

    /// <summary>
    /// Cấu hình border
    /// </summary>
    public class OrdExportBorderConfiguration
    {
        public ExcelBorderStyle? Top { get; set; }
        public ExcelBorderStyle? Bottom { get; set; }
        public ExcelBorderStyle? Left { get; set; }
        public ExcelBorderStyle? Right { get; set; }
        public Color? Color { get; set; }

        public static OrdExportBorderConfiguration All(ExcelBorderStyle style = ExcelBorderStyle.Thin) => new()
        {
            Top = style,
            Bottom = style,
            Left = style,
            Right = style
        };

        public static OrdExportBorderConfiguration Around(ExcelBorderStyle style = ExcelBorderStyle.Medium) => new()
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

    /// <summary>
    /// Cấu hình in ấn
    /// </summary>
    public class OrdExportPrintConfiguration
    {
        public eOrientation Orientation { get; set; } = eOrientation.Landscape;
        public bool FitToPage { get; set; } = true;
        public int FitToWidth { get; set; } = 1;
        public int FitToHeight { get; set; } = 0;
        public decimal LeftMargin { get; set; } = 0.7M;
        public decimal RightMargin { get; set; } = 0.7M;
        public decimal TopMargin { get; set; } = 0.75M;
        public decimal BottomMargin { get; set; } = 0.75M;
        public string? Header { get; set; }
        public string? Footer { get; set; }

        public void ApplyTo(ExcelWorksheet worksheet)
        {
            worksheet.PrinterSettings.Orientation = Orientation;
            worksheet.PrinterSettings.FitToPage = FitToPage;
            worksheet.PrinterSettings.FitToWidth = FitToWidth;
            worksheet.PrinterSettings.FitToHeight = FitToHeight;
            worksheet.PrinterSettings.LeftMargin = LeftMargin;
            worksheet.PrinterSettings.RightMargin = RightMargin;
            worksheet.PrinterSettings.TopMargin = TopMargin;
            worksheet.PrinterSettings.BottomMargin = BottomMargin;

            if (!string.IsNullOrEmpty(Header))
                worksheet.HeaderFooter.OddHeader.CenteredText = Header;
            if (!string.IsNullOrEmpty(Footer))
                worksheet.HeaderFooter.OddFooter.CenteredText = Footer;
        }
    }

    /// <summary>
    /// Cấu hình header table được tối ưu hóa
    /// </summary>
    public class OrdExportTableHeader
    {
        /// <summary>
        /// Tên header
        /// </summary>
        public string HeaderName { get; set; } = string.Empty;

        /// <summary>
        /// Cấu hình style cho header
        /// </summary>
        public OrdExportStyleConfiguration? Style { get; set; }

        /// <summary>
        /// Function tùy chỉnh style
        /// </summary>
        public Action<ExcelStyle, string>? CustomStyleAction { get; set; }

        /// <summary>
        /// Chiều rộng cột
        /// </summary>
        public double? Width { get; set; }

        public static OrdExportTableHeader Create(string name, double? width = null) => new()
        {
            HeaderName = name,
            Width = width
        };
    }

    /// <summary>
    /// Cấu hình cột dữ liệu được tối ưu hóa
    /// </summary>
    public class OrdExportColumnData<TData>
    {
        #region Properties

        /// <summary>
        /// Cấu hình header
        /// </summary>
        public OrdExportTableHeader? Header { get; set; }

        /// <summary>
        /// Có phải cột số thứ tự không
        /// </summary>
        public bool IsRowIndex { get; set; }

        /// <summary>
        /// Chiều rộng cột
        /// </summary>
        public double? Width { get; set; }

        /// <summary>
        /// Function lấy giá trị từ data
        /// </summary>
        public Func<TData, object>? ValueSelector { get; set; }

        /// <summary>
        /// Cấu hình style cho data cell
        /// </summary>
        public OrdExportStyleConfiguration? Style { get; set; }

        /// <summary>
        /// Function tùy chỉnh style cho từng cell
        /// </summary>
        public Action<TData, ExcelStyle>? CustomStyleAction { get; set; }

        /// <summary>
        /// Function format giá trị
        /// </summary>
        public Func<object, object>? ValueFormatter { get; set; }

        #endregion

        #region Constructors

        /// <summary>
        /// Constructor cho cột số thứ tự
        /// </summary>
        public OrdExportColumnData(bool isRowIndex)
        {
            IsRowIndex = isRowIndex;
            if (isRowIndex)
            {
                Header = OrdExportTableHeader.Create("STT", 5);
                Width = 5;
            }
        }

        /// <summary>
        /// Constructor với value selector
        /// </summary>
        public OrdExportColumnData(Func<TData, object> valueSelector)
        {
            ValueSelector = valueSelector;
        }

        /// <summary>
        /// Constructor với value selector và style
        /// </summary>
        public OrdExportColumnData(
            Func<TData, object> valueSelector,
            Action<TData, ExcelStyle>? customStyleAction)
        {
            ValueSelector = valueSelector;
            CustomStyleAction = customStyleAction;
        }

        /// <summary>
        /// Constructor đầy đủ
        /// </summary>
        public OrdExportColumnData(
            Func<TData, object> valueSelector,
            Action<TData, ExcelStyle>? customStyleAction,
            double? width)
        {
            ValueSelector = valueSelector;
            CustomStyleAction = customStyleAction;
            Width = width;
        }

        #endregion

        #region Factory Methods

        /// <summary>
        /// Tạo cột số thứ tự
        /// </summary>
        public static OrdExportColumnData<TData> RowIndex(string headerName = "STT", double? width = 5)
        {
            return new OrdExportColumnData<TData>(true)
            {
                Header = OrdExportTableHeader.Create(headerName, width),
                Width = width
            };
        }

        /// <summary>
        /// Tạo cột với expression
        /// </summary>
        public static OrdExportColumnData<TData> Create<TProperty>(
            Expression<Func<TData, TProperty>> expression,
            string? headerName = null,
            double? width = null)
        {
            var compiled = expression.Compile();
            var propertyName = headerName ?? GetPropertyName(expression);

            return new OrdExportColumnData<TData>(data => compiled(data))
            {
                Header = OrdExportTableHeader.Create(propertyName, width),
                Width = width
            };
        }

        /// <summary>
        /// Tạo cột với expression và style configuration
        /// </summary>
        public static OrdExportColumnData<TData> Create<TProperty>(
            Expression<Func<TData, TProperty>> expression,
            string? headerName,
            OrdExportStyleConfiguration? style,
            double? width = null)
        {
            var compiled = expression.Compile();
            var propertyName = headerName ?? GetPropertyName(expression);

            return new OrdExportColumnData<TData>(data => compiled(data))
            {
                Header = OrdExportTableHeader.Create(propertyName, width),
                Style = style,
                Width = width
            };
        }

        private static string GetPropertyName<TProperty>(Expression<Func<TData, TProperty>> expression)
        {
            return expression.Body switch
            {
                MemberExpression member => member.Member.Name,
                UnaryExpression unary when unary.Operand is MemberExpression memberUnary => memberUnary.Member.Name,
                _ => "Unknown"
            };
        }

        #endregion
    }
}