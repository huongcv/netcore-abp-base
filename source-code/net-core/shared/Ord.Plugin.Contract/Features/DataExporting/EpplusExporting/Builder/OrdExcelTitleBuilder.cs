using OfficeOpenXml.Style;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
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
}
