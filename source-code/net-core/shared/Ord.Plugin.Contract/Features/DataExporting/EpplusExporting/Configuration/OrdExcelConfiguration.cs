using OfficeOpenXml;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;


/// <summary>
/// Cấu hình xuất Excel được tối ưu hóa với Builder pattern và Fluent API
/// </summary>
public class OrdExcelConfiguration
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
    public OrdExcelTitle? Title { get; set; }

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
    public OrdExcelStyleConfiguration HeaderStyle { get; set; } = new();

    #endregion

    #region Data Settings

    /// <summary>
    /// Cấu hình style cho data cells
    /// </summary>
    public OrdExcelStyleConfiguration DataStyle { get; set; } = new();
    #endregion

    #region Print Settings

    /// <summary>
    /// Cấu hình in ấn
    /// </summary>
    public OrdExcelPrintConfiguration PrintSettings { get; set; } = new();

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
    public static OrdExcelConfiguration Default() => new();

    /// <summary>
    /// Tạo cấu hình với tiêu đề đơn giản
    /// </summary>
    public static OrdExcelConfiguration WithTitle(string title)
    {
        return new OrdExcelConfiguration
        {
            WorksheetName = title,
            Title = OrdExcelTitle.Create(title)
        };
    }

    /// <summary>
    /// Tạo builder để cấu hình
    /// </summary>
    public static OrdExcelConfigurationBuilder Builder() => new();

    #endregion
}