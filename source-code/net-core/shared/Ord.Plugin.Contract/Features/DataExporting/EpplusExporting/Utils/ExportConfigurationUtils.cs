using OfficeOpenXml.Style;
using System.Drawing;
using System.Linq.Expressions;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;

namespace Ord.Plugin;

/// <summary>
/// Utility class để tạo các cấu hình export thường dùng
/// </summary>
public static class EpplusExportingConfigurationUtils
{
    #region Title Templates

    /// <summary>
    /// Tạo title chính với style mặc định
    /// </summary>
    public static Action<OrdExcelTitleBuilder> MainTitle(string text, int rowIndex = 2, string fontName = "Arial", float fontSize = 18)
    {
        return title => title
            .WithText(text)
            .WithRowIndexStart(rowIndex)
            .WithRowHeight(35)
            .WithStyle(style => style
                .WithFont(fontName, fontSize)
                .WithBoldFont()
                .WithCenterAlignment()
                .WithWrapText(true)
                .WithFontColor(Color.DarkBlue));
    }

    /// <summary>
    /// Tạo subtitle với style mặc định
    /// </summary>
    public static Action<OrdExcelTitleBuilder> SubTitle(string text, int rowIndex = 3, string fontName = "Arial", float fontSize = 13)
    {
        return title => title
            .WithText(text)
            .WithRowIndexStart(rowIndex)
            .WithRowHeight(35)
            .WithStyle(style => style
                .WithFont(fontName, fontSize)
                .WithBoldFont()
                .WithItalicFont()
                .WithCenterAlignment()
                .WithWrapText(true));
    }


    #endregion

    #region Header/Data Style Templates

    /// <summary>
    /// Style header mặc định
    /// </summary>
    public static Action<OrdExcelStyleBuilder> DefaultHeaderStyle(Color? backgroundColor = null)
    {
        return style => style
            .WithBoldFont()
            .WithRowHeight(25)
            .WithFontSize(15)
            .WithBackgroundColor(backgroundColor ?? Color.LightBlue)
            .WithCenterAlignment()
            .WithAllBorders();
    }

    /// <summary>
    /// Style data mặc định
    /// </summary>
    public static Action<OrdExcelStyleBuilder> DefaultDataStyle()
    {
        return style => style
            .WithAllBorders(ExcelBorderStyle.Thin)
            .WithFontSize(13)
            .WithRowHeight(25)
            .WithWrapText();
    }

    #endregion

    #region Column Templates
    /// <summary>
    /// Template cho cột Status với conditional formatting
    /// </summary>
    public static Action<OrdExcelColumnFluentBuilder<T>> StatusColumn<T>(
        Expression<Func<T, object>> expression,
        Func<T, bool> isActiveFunc,
        string activeText = "Active",
        string inactiveText = "Inactive",
        string? headerName = null)
    {
        return c => c.WithProperty(expression, 20, headerName ?? "Status")
            .WithCenterAlignment()
            .WithConditionalFormat(isActiveFunc, Color.Green, Color.Red)
            .WithFormatter(value => isActiveFunc((T)value) ? activeText : inactiveText);
    }

    #endregion
}