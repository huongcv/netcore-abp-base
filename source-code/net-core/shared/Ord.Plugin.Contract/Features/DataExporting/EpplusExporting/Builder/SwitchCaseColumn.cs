using OfficeOpenXml.Style;
using Ord.Plugin.Contract.Factories;
using System.Drawing;
using System.Linq.Expressions;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;

/// <summary>
/// Switch case configuration cho column
/// </summary>
public class SwitchCaseColumnConfig<T, TValue>
{
    public Dictionary<TValue, SwitchCaseOption> Cases { get; } = new();
    public SwitchCaseOption? DefaultCase { get; set; }

    public class SwitchCaseOption
    {
        public object DisplayValue { get; set; } = string.Empty;
        public Action<ExcelStyle>? StyleAction { get; set; }
        public Color? FontColor { get; set; }
        public Color? BackgroundColor { get; set; }
        public bool? IsBold { get; set; }
        public bool? IsItalic { get; set; }
    }
}

/// <summary>
/// Builder cho switch case configuration
/// </summary>
public class SwitchCaseBuilder<T, TValue>
{
    private readonly SwitchCaseColumnConfig<T, TValue> _config = new();

    /// <summary>
    /// Thêm case với value và display text
    /// </summary>
    public SwitchCaseBuilder<T, TValue> Case(TValue value, object displayValue)
    {
        _config.Cases[value] = new SwitchCaseColumnConfig<T, TValue>.SwitchCaseOption
        {
            DisplayValue = displayValue
        };
        return this;
    }

    /// <summary>
    /// Thêm case với value, display text và style
    /// </summary>
    public SwitchCaseBuilder<T, TValue> Case(TValue value, object displayValue, Action<ExcelStyle> styleAction)
    {
        _config.Cases[value] = new SwitchCaseColumnConfig<T, TValue>.SwitchCaseOption
        {
            DisplayValue = displayValue,
            StyleAction = styleAction
        };
        return this;
    }

    /// <summary>
    /// Thêm case với value, display text và màu sắc
    /// </summary>
    public SwitchCaseBuilder<T, TValue> Case(TValue value, object displayValue, Color? fontColor = null, Color? backgroundColor = null, bool? isBold = null)
    {
        _config.Cases[value] = new SwitchCaseColumnConfig<T, TValue>.SwitchCaseOption
        {
            DisplayValue = displayValue,
            FontColor = fontColor,
            BackgroundColor = backgroundColor,
            IsBold = isBold
        };
        return this;
    }

    /// <summary>
    /// Thiết lập case mặc định
    /// </summary>
    public SwitchCaseBuilder<T, TValue> Default(object displayValue)
    {
        _config.DefaultCase = new SwitchCaseColumnConfig<T, TValue>.SwitchCaseOption
        {
            DisplayValue = displayValue
        };
        return this;
    }

    /// <summary>
    /// Thiết lập case mặc định với style
    /// </summary>
    public SwitchCaseBuilder<T, TValue> Default(object displayValue, Action<ExcelStyle> styleAction)
    {
        _config.DefaultCase = new SwitchCaseColumnConfig<T, TValue>.SwitchCaseOption
        {
            DisplayValue = displayValue,
            StyleAction = styleAction
        };
        return this;
    }

    /// <summary>
    /// Thiết lập case mặc định với màu sắc
    /// </summary>
    public SwitchCaseBuilder<T, TValue> Default(object displayValue, Color? fontColor = null, Color? backgroundColor = null, bool? isBold = null)
    {
        _config.DefaultCase = new SwitchCaseColumnConfig<T, TValue>.SwitchCaseOption
        {
            DisplayValue = displayValue,
            FontColor = fontColor,
            BackgroundColor = backgroundColor,
            IsBold = isBold
        };
        return this;
    }

    internal SwitchCaseColumnConfig<T, TValue> Build() => _config;
}

/// <summary>
/// Extension methods cho OrdExcelColumnFluentBuilder để hỗ trợ switch case
/// </summary>
public static class SwitchCaseColumnExtensions
{
    /// <summary>
    /// Thiết lập switch case cho column
    /// </summary>
    public static OrdExcelColumnFluentBuilder<T> WithSwitchCase<T, TValue>(
        this OrdExcelColumnFluentBuilder<T> builder,
        Expression<Func<T, TValue>> valueExpression,
        Action<SwitchCaseBuilder<T, TValue>> switchCaseBuilder,
        string? headerName = null,
        double? width = null)
    {
        var caseBuilder = new SwitchCaseBuilder<T, TValue>();
        switchCaseBuilder(caseBuilder);
        var switchConfig = caseBuilder.Build();

        // Set value selector với switch logic
        builder.WithValue(valueExpression);

        // Set header nếu có
        if (!string.IsNullOrEmpty(headerName))
        {
            builder.WithHeader(headerName);
        }

        // Set width nếu có
        if (width.HasValue)
        {
            builder.WithWidth(width.Value);
        }

        // Set value formatter để hiển thị giá trị theo switch case
        builder.WithFormatter(value =>
        {
            if (value is TValue typedValue && switchConfig.Cases.TryGetValue(typedValue, out var caseOption))
            {
                return caseOption.DisplayValue;
            }
            return switchConfig.DefaultCase?.DisplayValue ?? value?.ToString() ?? string.Empty;
        });

        // Set custom style action để apply style theo switch case
        builder.WithCustomStyle((data, style) =>
        {
            var value = valueExpression.Compile()(data);
            SwitchCaseColumnConfig<T, TValue>.SwitchCaseOption? option = null;

            if (value != null && switchConfig.Cases.TryGetValue(value, out var caseOption))
            {
                option = caseOption;
            }
            else
            {
                option = switchConfig.DefaultCase;
            }

            if (option != null)
            {
                // Apply custom style action first
                option.StyleAction?.Invoke(style);

                // Apply predefined styles
                if (option.FontColor.HasValue)
                {
                    style.Font.Color.SetColor(option.FontColor.Value);
                }

                if (option.BackgroundColor.HasValue)
                {
                    style.Fill.PatternType = ExcelFillStyle.Solid;
                    style.Fill.BackgroundColor.SetColor(option.BackgroundColor.Value);
                }

                if (option.IsBold.HasValue)
                {
                    style.Font.Bold = option.IsBold.Value;
                }

                if (option.IsItalic.HasValue)
                {
                    style.Font.Italic = option.IsItalic.Value;
                }
            }
        });

        return builder;
    }

    /// <summary>
    /// Tạo switch case cho Status column
    /// </summary>
    public static OrdExcelColumnFluentBuilder<T> WithStatusSwitchCase<T>(
        this OrdExcelColumnFluentBuilder<T> builder,
        Expression<Func<T, bool?>> statusExpression,
        string? headerName = "Status",
        double? width = 20,
        bool isBold = false)
    {
        return builder.WithSwitchCase(statusExpression, cases => cases
            .Case(true, builder.AppFactory.GetLocalizedMessage("status.active"), Color.Green, null, isBold)
            .Case(false, builder.AppFactory.GetLocalizedMessage("status.inactive"), Color.Red, null, isBold)
            .Default(builder.AppFactory.GetLocalizedMessage("status.unknown"), Color.Black), headerName, width);
    }

    /// <summary>
    /// Tạo switch case cho Order Status
    /// </summary>
    public static OrdExcelColumnFluentBuilder<T> WithOrderStatusSwitchCase<T>(
        this OrdExcelColumnFluentBuilder<T> builder,
        Expression<Func<T, string>> statusExpression,
        string? headerName = "OrderStatus",
        double? width = 25)
    {
        return builder.WithSwitchCase(statusExpression, cases => cases
            .Case("New", "Mới", Color.Blue, Color.LightBlue, true)
            .Case("Processing", "Đang xử lý", Color.Orange, Color.LightYellow, true)
            .Case("Shipped", "Đã giao", Color.Purple, Color.Lavender, true)
            .Case("Delivered", "Hoàn thành", Color.Green, Color.LightGreen, true)
            .Case("Cancelled", "Đã hủy", Color.Red, Color.LightPink, true)
            .Case("Returned", "Trả hàng", Color.Gray, Color.LightGray, true)
            .Default("Không xác định", Color.Black), headerName, width);
    }

    /// <summary>
    /// Tạo switch case cho Boolean values
    /// </summary>
    public static OrdExcelColumnFluentBuilder<T> WithBooleanSwitchCase<T>(
        this OrdExcelColumnFluentBuilder<T> builder,
        Expression<Func<T, bool?>> boolExpression,
        string trueText = "Có",
        string falseText = "Không",
        string nullText = "N/A",
        string? headerName = null,
        double? width = 15,
        bool isBold = false)
    {
        return builder.WithSwitchCase(boolExpression, cases => cases
            .Case(true, trueText, Color.Green, null, isBold)
            .Case(false, falseText, Color.Red, null, isBold)
            .Default(nullText, Color.Gray, null, isBold),
            headerName,
            width);
    }

    /// <summary>
    /// Tạo switch case cho Rating (1-5 stars)
    /// </summary>
    public static OrdExcelColumnFluentBuilder<T> WithRatingSwitchCase<T>(
        this OrdExcelColumnFluentBuilder<T> builder,
        Expression<Func<T, int?>> ratingExpression,
        string? headerName = "Rating",
        double? width = 15)
    {
        return builder.WithSwitchCase(ratingExpression, cases => cases
            .Case(1, "⭐", Color.Red)
            .Case(2, "⭐⭐", Color.Orange)
            .Case(3, "⭐⭐⭐", Color.Yellow)
            .Case(4, "⭐⭐⭐⭐", Color.LightGreen)
            .Case(5, "⭐⭐⭐⭐⭐", Color.Green, null, true)
            .Default("N/A", Color.Gray), headerName, width);
    }

    /// <summary>
    /// Tạo switch case với custom styling phức tạp
    /// </summary>
    public static OrdExcelColumnFluentBuilder<T> WithAdvancedSwitchCase<T, TValue>(
        this OrdExcelColumnFluentBuilder<T> builder,
        Expression<Func<T, TValue>> valueExpression,
        Dictionary<TValue, (object DisplayValue, Action<ExcelStyle> StyleAction)> cases,
        (object DisplayValue, Action<ExcelStyle>? StyleAction)? defaultCase = null,
        string? headerName = null,
        double? width = null)
    {
        return builder.WithSwitchCase(valueExpression, switchBuilder =>
        {
            foreach (var kvp in cases)
            {
                switchBuilder.Case(kvp.Key, kvp.Value.DisplayValue, kvp.Value.StyleAction);
            }

            if (defaultCase.HasValue)
            {
                if (defaultCase.Value.StyleAction != null)
                {
                    switchBuilder.Default(defaultCase.Value.DisplayValue, defaultCase.Value.StyleAction);
                }
                else
                {
                    switchBuilder.Default(defaultCase.Value.DisplayValue);
                }
            }
        }, headerName, width);
    }
}