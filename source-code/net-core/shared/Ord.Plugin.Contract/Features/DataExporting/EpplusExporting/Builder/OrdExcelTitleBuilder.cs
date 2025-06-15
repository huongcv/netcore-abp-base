using OfficeOpenXml.Style;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;

/// <summary>
/// Builder cho Title (Extended version)
/// </summary>
public class OrdExcelTitleBuilder
{
    private readonly OrdExcelTitle _title = new();

    public OrdExcelTitleBuilder WithText(string text)
    {
        _title.Text = text;
        return this;
    }

    /// <summary>
    /// Thiết lập vị trí hàng bắt đầu của title
    /// </summary>
    public OrdExcelTitleBuilder WithRowIndexStart(int rowIndex)
    {
        _title.RowIndex = rowIndex;
        return this;
    }

    /// <summary>
    /// Thiết lập margin cho title
    /// </summary>
    public OrdExcelTitleBuilder WithMargin(int marginTopRow = 3, int marginBottomRow = 2)
    {
        // Nếu chưa set RowIndex thì set dựa trên margin
        if (_title.RowIndex <= 1)
        {
            _title.RowIndex = marginTopRow + 1;
        }
        _title.MarginBottomRow = marginBottomRow;
        return this;
    }

    public OrdExcelTitleBuilder WithTitleColumnSpan(int titleColumnSpan)
    {
        _title.TitleColumnSpan = titleColumnSpan;
        return this;
    }

    public OrdExcelTitleBuilder WithRowHeight(double height)
    {
        _title.RowHeight = height;
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