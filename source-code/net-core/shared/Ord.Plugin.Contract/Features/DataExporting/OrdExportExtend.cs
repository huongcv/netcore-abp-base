using OfficeOpenXml;
using OfficeOpenXml.Style;
using Ord.Plugin.Contract.Dtos;

namespace Ord.Plugin.Contract.DataExporting
{
    public class OrdExportExtend
    {
        public string WorksheetName { get; set; } = "Data";
        public double? DefaultRowHeight { get; set; } = 15;
        public OrdExportTitle? Title { get; set; }
        public int HeaderRowIndex { get; set; } = 5;
        public List<string> ListColumnName { get; set; }
        public Action<ExcelWorksheet>? FuncWorksheet { get; set; }
        public Func<ExcelWorksheet, Task>? FuncWorksheetAsync { get; set; }
        public Action<ExcelStyle>? FuncStyleHeaderData { get; set; }
        public Action<ExcelStyle>? FuncStyleCellData { get; set; }

        public OrdExportExtend()
        {

        }

        //public OrdExportExtend(OrdPagedRequestDto pagedInput) : this(pagedInput?.Export?.Title)
        //{
        //    // ListColumnName = pagedInput?.Export?.ColumnNames;
        //}
        public OrdExportExtend(string? title)
        {
            WorksheetName = title;
            Title = new OrdExportTitle()
            {
                TitleName = title
            };
        }
    }

    public class OrdExportTitle
    {
        public string? TitleName { get; set; }
        public int RowIndex { get; set; } = 2;
        public double? RowHeight { get; set; } = 32;
        public Action<ExcelStyle>? FuncStyle { get; set; }
    }

    public class OrdExportTableHeader
    {
        public string HeaderName { get; set; }
        public Action<ExcelStyle, string>? FuncStyle { get; set; }
    }

    public class OrdExportColumnData<TData>
    {
        public OrdExportTableHeader? Header { get; set; }
        public bool IsRowIndex { get; set; }
        public double? Width { get; set; }
        public Func<TData, object> Value { get; set; }
        public Action<TData, ExcelStyle>? FuncStyle { get; set; }

        public OrdExportColumnData(bool isRowIndex)
        {
            IsRowIndex = isRowIndex;
        }
        public OrdExportColumnData(Func<TData, object> value)
        {
            Value = value;
        }
        public OrdExportColumnData(Func<TData, object> value, Action<TData, ExcelStyle>? funcStyle)
        {
            Value = value;
            FuncStyle = funcStyle;
        }
        public OrdExportColumnData(Func<TData, object> value, Action<TData, ExcelStyle>? funcStyle, double? width = null)
        {
            Value = value;
            FuncStyle = funcStyle;
            Width = width;
        }
        public OrdExportColumnData(Func<TData, object> value, double? width)
        {
            Value = value;
            Width = width;
        }
    }
}
