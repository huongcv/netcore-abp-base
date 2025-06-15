using OfficeOpenXml;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;

/// <summary>
/// Builder pattern để cấu hình export dễ dàng
/// </summary>
public class EpplusExportingConfigurationBuilder
{
    private readonly EpplusExportingConfiguration _configuration = new();

    #region Worksheet Configuration

    /// <summary>
    /// Thiết lập tên worksheet
    /// </summary>
    public EpplusExportingConfigurationBuilder WithWorksheetName(string name)
    {
        _configuration.WorksheetName = name;
        return this;
    }

    /// <summary>
    /// Thiết lập chiều cao mặc định của hàng
    /// </summary>
    public EpplusExportingConfigurationBuilder WithDefaultRowHeight(double height)
    {
        _configuration.DefaultRowHeight = height;
        return this;
    }

    /// <summary>
    /// Thiết lập chiều rộng mặc định của cột
    /// </summary>
    public EpplusExportingConfigurationBuilder WithDefaultColumnWidth(double width)
    {
        _configuration.DefaultColumnWidth = width;
        return this;
    }

    /// <summary>
    /// Thiết lập auto fit columns
    /// </summary>
    public EpplusExportingConfigurationBuilder WithAutoFitColumns(bool autoFit = true, double minWidth = 8, double maxWidth = 50)
    {
        _configuration.AutoFitColumns = autoFit;
        _configuration.MinColumnWidth = minWidth;
        _configuration.MaxColumnWidth = maxWidth;
        return this;
    }

    #endregion

    #region Title Configuration

    /// <summary>
    /// Thiết lập tiêu đề với cấu hình chi tiết
    /// </summary>
    public EpplusExportingConfigurationBuilder WithTitle(Action<OrdExcelTitleBuilder> titleBuilder)
    {
        var builder = new OrdExcelTitleBuilder();
        titleBuilder(builder);
        _configuration.Titles.Add(builder.Build());
        return this;
    }

    #endregion

    #region Data Table Configuration

    /// <summary>
    /// Thiết lập data table configuration
    /// </summary>
    public EpplusExportingConfigurationBuilder WithDataTable<T>(Action<EpplusDataTableBuilder<T>> dataTableBuilder) where T : class
    {
        var builder = new EpplusDataTableBuilder<T>();
        dataTableBuilder(builder);
        _configuration.DataTable = builder.Build();
        return this;
    }

    #endregion

    #region Print Configuration

    /// <summary>
    /// Thiết lập cấu hình in ấn
    /// </summary>
    public EpplusExportingConfigurationBuilder WithPrintSettings(Action<OrdExcelPrintBuilder> printBuilder)
    {
        var builder = new OrdExcelPrintBuilder();
        printBuilder(builder);
        _configuration.PrintSettings = builder.Build();
        return this;
    }

    /// <summary>
    /// Thiết lập hướng in landscape
    /// </summary>
    public EpplusExportingConfigurationBuilder WithLandscapeOrientation()
    {
        _configuration.PrintSettings.Orientation = eOrientation.Landscape;
        return this;
    }

    /// <summary>
    /// Thiết lập hướng in portrait
    /// </summary>
    public EpplusExportingConfigurationBuilder WithPortraitOrientation()
    {
        _configuration.PrintSettings.Orientation = eOrientation.Portrait;
        return this;
    }

    #endregion

    #region Advanced Configuration

    /// <summary>
    /// Thiết lập function tùy chỉnh worksheet
    /// </summary>
    public EpplusExportingConfigurationBuilder WithCustomWorksheet(Action<ExcelWorksheet> customAction)
    {
        _configuration.CustomWorksheetAction = customAction;
        return this;
    }

    /// <summary>
    /// Thiết lập function tùy chỉnh worksheet async
    /// </summary>
    public EpplusExportingConfigurationBuilder WithCustomWorksheetAsync(Func<ExcelWorksheet, Task> customAction)
    {
        _configuration.CustomWorksheetAsyncAction = customAction;
        return this;
    }

    /// <summary>
    /// Thiết lập bảo vệ worksheet
    /// </summary>
    public EpplusExportingConfigurationBuilder WithProtection(string? password = null)
    {
        _configuration.ProtectWorksheet = true;
        _configuration.WorksheetPassword = password;
        return this;
    }

    #endregion

    /// <summary>
    /// Build configuration
    /// </summary>
    public EpplusExportingConfiguration Build() => _configuration;
}

/// <summary>
/// Builder cho Data Table Configuration
/// </summary>
public class EpplusDataTableBuilder<T> where T : class
{
    private readonly EpplusDataTableConfiguration _dataTable = new();
    private OrdExcelColumnBuilder<T>? _columnBuilder;

    /// <summary>
    /// Thiết lập vị trí bắt đầu của data table
    /// </summary>
    public EpplusDataTableBuilder<T> WithRowIndexStart(int rowIndex)
    {
        _dataTable.RowIndexStart = rowIndex;
        return this;
    }

    /// <summary>
    /// Thiết lập columns
    /// </summary>
    public EpplusDataTableBuilder<T> WithColumns(Action<OrdExcelColumnBuilder<T>> columnBuilder)
    {
        _columnBuilder = new OrdExcelColumnBuilder<T>(null!); // Will be injected later
        columnBuilder(_columnBuilder);
        _dataTable.ColumnsConfiguration = _columnBuilder;
        return this;
    }

    /// <summary>
    /// Thiết lập style cho header
    /// </summary>
    public EpplusDataTableBuilder<T> WithHeaderStyle(Action<OrdExcelStyleBuilder> styleBuilder)
    {
        var builder = new OrdExcelStyleBuilder();
        styleBuilder(builder);
        _dataTable.HeaderStyle = builder.Build();
        return this;
    }

    /// <summary>
    /// Thiết lập style cho data cells
    /// </summary>
    public EpplusDataTableBuilder<T> WithDataStyle(Action<OrdExcelStyleBuilder> styleBuilder)
    {
        var builder = new OrdExcelStyleBuilder();
        styleBuilder(builder);
        _dataTable.DataStyle = builder.Build();
        return this;
    }

    /// <summary>
    /// Build data table configuration
    /// </summary>
    internal EpplusDataTableConfiguration Build() => _dataTable;
}