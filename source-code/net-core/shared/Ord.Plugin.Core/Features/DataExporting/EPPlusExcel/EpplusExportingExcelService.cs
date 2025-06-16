using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using Ord.Plugin.Core.Base;
using System.Reflection;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Features.DataExporting;

/// <summary>
/// Dịch vụ xuất Excel sử dụng EPPlus với hệ thống cấu hình được cập nhật
/// </summary>
public class EpplusExportingExcelService : OrdManagerBase, IEpplusExportingExcelService, ITransientDependency
{
    private readonly ILogger<EpplusExportingExcelService> _logger;
    private EpplusExportingConfiguration _exportConfig;

    public EpplusExportingExcelService(ILogger<EpplusExportingExcelService> logger)
    {
        _logger = logger;
        // Thiết lập license context cho EPPlus
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
    }

    #region Export method
    /// <summary>
    /// Xuất collection dữ liệu với fluent builders mới
    /// </summary>
    public async Task<byte[]> ExportDataCollection<TData>(
        IEnumerable<TData> dataItems,
        Action<EpplusExportingConfigurationBuilder> configurationBuilder) where TData : class
    {
        // Xây dựng cấu hình
        var configBuilder = EpplusExportingConfiguration.Builder();
        configurationBuilder(configBuilder);
        var configuration = configBuilder.Build();

        return await ExportDataCollection(dataItems, configuration);
    }

    /// <summary>
    /// Xuất collection dữ liệu với cấu hình đã được xây dựng sẵn
    /// </summary>
    public async Task<byte[]> ExportDataCollection<TData>(
        IEnumerable<TData> dataItems,
        EpplusExportingConfiguration configuration) where TData : class
    {
        try
        {
            SetExportingConfigurationGlobal(configuration);
            _logger.LogInformation("Bắt đầu xuất trực tiếp với {RecordCount} bản ghi", dataItems.Count());

            // Kiểm tra tham số
            ValidateDirectExportParameters(dataItems, configuration);

            // Tạo Excel package
            using var excel = new ExcelPackage();
            var workSheet = excel.Workbook.Worksheets.Add(configuration.WorksheetName);

            // Cấu hình mặc định cho worksheet
            ConfigureWorksheetDefaults(workSheet, configuration);

            // Thêm tiêu đề
            var currentRowIndex = await AddTitlesToWorksheet(workSheet, configuration.Titles);

            // Thêm bảng dữ liệu nếu được cấu hình
            if (configuration.DataTable != null)
            {
                currentRowIndex = await AddDataTableToWorksheet<TData>(workSheet, dataItems, configuration.DataTable, currentRowIndex);
            }

            // Áp dụng cấu hình tùy chỉnh
            await ApplyCustomConfigurations(workSheet, configuration);

            // Áp dụng bảo vệ worksheet
            ApplyWorksheetProtection(workSheet, configuration);

            // Lưu và trả về
            var result = await SaveExcelToBytes(excel);

            _logger.LogInformation("Xuất thành công {RecordCount} bản ghi", dataItems.Count());

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi xảy ra trong quá trình xuất trực tiếp");
            throw;
        }
    }

    /// <summary>
    /// Xuất nhiều sheet
    /// </summary>
    public async Task<byte[]> ExportMultipleSheets(params EpplusExportSheetConfiguration[] exportSheets)
    {
        try
        {
            _logger.LogInformation("Bắt đầu xuất nhiều sheet với {SheetCount} sheet", exportSheets.Length);

            using var excel = new ExcelPackage();

            foreach (var sheetConfig in exportSheets)
            {
                await CreateWorksheetFromConfiguration(excel, sheetConfig);
            }

            var result = await SaveExcelToBytes(excel);

            _logger.LogInformation("Xuất thành công file nhiều sheet với {SheetCount} sheet", exportSheets.Length);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi xảy ra trong quá trình xuất nhiều sheet");
            throw;
        }
    }

    /// <summary>
    /// Tạo cấu hình sheet xuất cho xuất nhiều sheet
    /// </summary>
    public EpplusExportSheetConfiguration CreateSheetConfiguration<TData>(
        string sheetName,
        IEnumerable<TData> dataItems,
        Action<EpplusExportingConfigurationBuilder> configurationBuilder) where TData : class
    {
        // Xây dựng cấu hình
        var configBuilder = EpplusExportingConfiguration.Builder();
        configurationBuilder(configBuilder);
        var configuration = configBuilder.Build();

        // Ghi đè tên worksheet
        configuration.WorksheetName = sheetName;

        return EpplusExportSheetConfiguration.Create(sheetName, dataItems, configuration);
    }

    #endregion

    #region Helper private

    private void SetExportingConfigurationGlobal(EpplusExportingConfiguration config)
    {
        _exportConfig = config;
    }

    /// <summary>
    /// Kiểm tra tham số xuất trực tiếp
    /// </summary>
    private void ValidateDirectExportParameters<TData>(
        IEnumerable<TData> dataItems,
        EpplusExportingConfiguration configuration) where TData : class
    {
        if (dataItems == null)
            throw new ArgumentNullException(nameof(dataItems));
        if (configuration == null)
            throw new ArgumentNullException(nameof(configuration));
    }

    /// <summary>
    /// Cấu hình các thiết lập mặc định cho worksheet
    /// </summary>
    private void ConfigureWorksheetDefaults(ExcelWorksheet workSheet, EpplusExportingConfiguration configuration)
    {
        workSheet.DefaultRowHeight = configuration.DefaultRowHeight; // Chiều cao hàng mặc định
        workSheet.DefaultColWidth = configuration.DefaultColumnWidth; // Chiều rộng cột mặc định

        // Áp dụng thiết lập in
        configuration.PrintSettings.ApplyTo(workSheet);
    }

    /// <summary>
    /// Thêm tiêu đề vào worksheet
    /// </summary>
    private async Task<int> AddTitlesToWorksheet(ExcelWorksheet workSheet, List<OrdExcelTitle> titles)
    {
        var currentRowIndex = 1;

        foreach (var title in titles)
        {
            if (title == null || string.IsNullOrEmpty(title.Text))
                continue;

            // Sử dụng RowIndex từ cấu hình tiêu đề
            var titleRowIndex = title.RowIndex > 0 ? title.RowIndex : currentRowIndex;

            var actualColumnSpan = title.TitleColumnSpan > 0 ? title.TitleColumnSpan : GetWorksheetColumnCount(workSheet);
            var titleRange = workSheet.Cells[titleRowIndex, 1, titleRowIndex, actualColumnSpan];
            titleRange.Merge = true; // Merge các ô để tạo tiêu đề dài
            titleRange.Value = title.Text;

            // Áp dụng style cho tiêu đề
            title.Style.ApplyTo(titleRange.Style);
            title.CustomStyleAction?.Invoke(titleRange.Style);

            // Thiết lập chiều cao hàng nếu có
            if (title.RowHeight.HasValue)
                workSheet.Row(titleRowIndex).Height = title.RowHeight.Value;

            // Cập nhật chỉ số hàng hiện tại cho tiêu đề tiếp theo
            currentRowIndex = Math.Max(currentRowIndex, titleRowIndex + title.MarginBottomRow);
        }

        return currentRowIndex;
    }

    /// <summary>
    /// Lấy số cột của worksheet (để span tiêu đề)
    /// </summary>
    private int GetWorksheetColumnCount(ExcelWorksheet workSheet)
    {
        // Ưu tiên lấy số cột từ cấu hình DataTable nếu có
        if (_exportConfig.DataTable?.ColumnsConfiguration is OrdExcelColumnBuilder<object> columnBuilder)
        {
            var columns = GetColumnsFromConfiguration<object>(_exportConfig.DataTable);
            if (columns?.Length > 0)
            {
                return columns.Length;
            }
        }

        // Nếu không có cấu hình DataTable, lấy từ dimension hiện tại của worksheet
        return workSheet.Dimension?.End.Column ?? 10;
    }

    /// <summary>
    /// Thêm bảng dữ liệu vào worksheet
    /// </summary>
    private async Task<int> AddDataTableToWorksheet<TData>(
        ExcelWorksheet workSheet,
        IEnumerable<TData> dataItems,
        EpplusDataTableConfiguration dataTableConfig,
        int currentRowIndex) where TData : class
    {
        // Lấy cột từ cấu hình
        var columns = GetColumnsFromConfiguration<TData>(dataTableConfig);
        if (columns == null || columns.Length == 0)
        {
            _logger.LogWarning("Không có cột nào được cấu hình cho bảng dữ liệu");
            return currentRowIndex;
        }

        // Sử dụng vị trí hàng được cấu hình hoặc vị trí hiện tại
        var headerRowIndex = Math.Max(currentRowIndex, dataTableConfig.RowIndexStart);

        // Thêm header
        currentRowIndex = await AddHeadersToWorksheet(workSheet, dataTableConfig, columns, headerRowIndex);

        // Thêm các hàng dữ liệu
        currentRowIndex = await AddDataRowsToWorksheet(workSheet, dataItems, columns, dataTableConfig, currentRowIndex);

        // Cấu hình cột (chiều rộng, auto-fit)
        ConfigureColumns(workSheet, columns, dataTableConfig);

        return currentRowIndex;
    }

    /// <summary>
    /// Lấy cột từ cấu hình bảng dữ liệu
    /// </summary>
    private OrdExcelColumnData<TData>[] GetColumnsFromConfiguration<TData>(EpplusDataTableConfiguration dataTableConfig) where TData : class
    {
        if (dataTableConfig.ColumnsConfiguration is OrdExcelColumnBuilder<TData> columnBuilder)
        {
            // Inject AppFactory nếu cần
            var builderType = columnBuilder.GetType();
            var appFactoryField = builderType.GetField("_appFactory", BindingFlags.NonPublic | BindingFlags.Instance);
            if (appFactoryField?.GetValue(columnBuilder) == null)
            {
                appFactoryField?.SetValue(columnBuilder, AppFactory);
            }

            return columnBuilder.Build();
        }

        return Array.Empty<OrdExcelColumnData<TData>>();
    }

    /// <summary>
    /// Thêm header vào worksheet
    /// </summary>
    private async Task<int> AddHeadersToWorksheet<TData>(
        ExcelWorksheet workSheet,
        EpplusDataTableConfiguration dataTableConfig,
        OrdExcelColumnData<TData>[] columns,
        int headerRowIndex) where TData : class
    {
        for (int col = 0; col < columns.Length; col++)
        {
            var column = columns[col];
            var headerCell = workSheet.Cells[headerRowIndex, col + 1];

            // Thiết lập text header
            var headerText = GetHeaderText(column, col);
            if (!string.IsNullOrEmpty(headerText) && !headerText.StartsWith("field"))
            {
                headerText = "field." + headerText; // Thêm prefix cho localization
            }
            headerCell.Value = AppFactory.GetLocalizedMessage(headerText); // Áp dụng đa ngôn ngữ

            // Áp dụng style cho header
            dataTableConfig.HeaderStyle.ApplyTo(headerCell.Style);
            column.Header?.Style?.ApplyTo(headerCell.Style);
            column.Header?.CustomStyleAction?.Invoke(headerCell.Style, headerText);
        }

        // Thiết lập chiều cao hàng header
        var rowHeight = dataTableConfig.HeaderStyle?.RowHeight;
        if (rowHeight.HasValue)
        {
            workSheet.Row(headerRowIndex).Height = rowHeight.Value;
        }

        return headerRowIndex + 1;
    }

    /// <summary>
    /// Lấy text header cho cột
    /// </summary>
    private string GetHeaderText<TData>(OrdExcelColumnData<TData> column, int columnIndex) where TData : class
    {
        // Sử dụng tên header của cột
        if (!string.IsNullOrEmpty(column.Header?.HeaderName))
        {
            return column.Header.HeaderName;
        }

        // Tên mặc định
        return $"Column {columnIndex + 1}";
    }

    /// <summary>
    /// Thêm các hàng dữ liệu vào worksheet
    /// </summary>
    private async Task<int> AddDataRowsToWorksheet<TData>(
        ExcelWorksheet workSheet,
        IEnumerable<TData> dataItems,
        OrdExcelColumnData<TData>[] columns,
        EpplusDataTableConfiguration dataTableConfig,
        int startRowIndex) where TData : class
    {
        if (!dataItems.Any())
            return startRowIndex; // Không có dữ liệu để thêm

        var currentRowIndex = startRowIndex;
        var recordIndex = 0;

        foreach (var dataItem in dataItems)
        {
            recordIndex++;

            // Lặp qua từng cột để thiết lập giá trị
            for (int colIndex = 0; colIndex < columns.Length; colIndex++)
            {
                var column = columns[colIndex];
                var cell = workSheet.Cells[currentRowIndex, colIndex + 1];

                // Thiết lập giá trị ô
                var cellValue = GetCellValue(column, dataItem, recordIndex);
                cell.Value = cellValue;

                // Áp dụng style cho ô
                dataTableConfig.DataStyle.ApplyTo(cell.Style);
                column.Style?.ApplyTo(cell.Style);
                column.CustomStyleAction?.Invoke(dataItem, cell.Style);
            }

            // Thiết lập chiều cao hàng dữ liệu
            var dataCellRowHeight = dataTableConfig.DataStyle?.RowHeight;
            if (dataCellRowHeight.HasValue)
            {
                workSheet.Row(currentRowIndex).Height = dataCellRowHeight.Value;
            }
            currentRowIndex++;
        }

        return currentRowIndex;
    }

    /// <summary>
    /// Lấy giá trị ô từ cấu hình cột
    /// </summary>
    private object GetCellValue<TData>(
        OrdExcelColumnData<TData> column,
        TData dataItem,
        int recordIndex) where TData : class
    {
        // Nếu là cột số thứ tự
        if (column.IsRowIndex)
        {
            return recordIndex;
        }

        // Nếu không có value selector
        if (column.ValueSelector == null)
        {
            return string.Empty;
        }

        var rawValue = column.ValueSelector(dataItem);

        // Áp dụng formatter nếu có
        if (column.ValueFormatter != null)
        {
            return column.ValueFormatter(rawValue);
        }

        return FormatCellValue(rawValue);
    }

    /// <summary>
    /// Format giá trị ô dựa trên kiểu dữ liệu
    /// </summary>
    private object FormatCellValue(object? value)
    {
        if (value == null)
            return string.Empty;

        return value switch
        {
            DateTime dateTime => dateTime, // Giữ nguyên DateTime
            DateOnly dateOnly => dateOnly.ToDateTime(TimeOnly.MinValue), // Chuyển DateOnly thành DateTime
            TimeOnly timeOnly => timeOnly.ToString("HH:mm:ss"), // Format TimeOnly
            bool boolean => boolean, // Giữ nguyên boolean
            decimal or double or float or int or long => value, // Giữ nguyên số
            _ => value.ToString() ?? string.Empty // Chuyển thành string cho các kiểu khác
        };
    }

    /// <summary>
    /// Cấu hình cột (chiều rộng, auto-fit)
    /// </summary>
    private void ConfigureColumns<TData>(
        ExcelWorksheet workSheet,
        OrdExcelColumnData<TData>[] columns,
        EpplusDataTableConfiguration dataTableConfig) where TData : class
    {
        for (int col = 0; col < columns.Length; col++)
        {
            var column = columns[col];
            var excelColumn = workSheet.Column(col + 1);

            // Thiết lập chiều rộng cụ thể
            if (column.Width.HasValue)
            {
                excelColumn.Width = column.Width.Value;
            }
            else if (column.Header?.Width.HasValue == true)
            {
                excelColumn.Width = column.Header.Width.Value;
            }
            else
            {
                // Sử dụng chiều rộng mặc định
                excelColumn.Width = 12;
            }
        }
    }

    /// <summary>
    /// Áp dụng cấu hình tùy chỉnh
    /// </summary>
    private async Task ApplyCustomConfigurations(ExcelWorksheet workSheet, EpplusExportingConfiguration configuration)
    {
        // Thực thi action tùy chỉnh đồng bộ
        configuration.CustomWorksheetAction?.Invoke(workSheet);

        // Thực thi action tùy chỉnh bất đồng bộ
        if (configuration.CustomWorksheetAsyncAction != null)
        {
            await configuration.CustomWorksheetAsyncAction(workSheet);
        }
    }

    /// <summary>
    /// Áp dụng bảo vệ worksheet
    /// </summary>
    private void ApplyWorksheetProtection(ExcelWorksheet workSheet, EpplusExportingConfiguration configuration)
    {
        if (configuration.ProtectWorksheet)
        {
            // Thiết lập mật khẩu nếu có
            if (!string.IsNullOrEmpty(configuration.WorksheetPassword))
            {
                workSheet.Protection.SetPassword(configuration.WorksheetPassword);
            }
            workSheet.Protection.IsProtected = true; // Bật bảo vệ
        }
    }

    /// <summary>
    /// Lưu Excel package thành mảng byte
    /// </summary>
    private async Task<byte[]> SaveExcelToBytes(ExcelPackage excel)
    {
        await using var memoryStream = new MemoryStream();
        await excel.SaveAsAsync(memoryStream);
        return memoryStream.ToArray();
    }

    /// <summary>
    /// Tạo worksheet từ cấu hình sheet (cho xuất nhiều sheet)
    /// </summary>
    private async Task CreateWorksheetFromConfiguration(ExcelPackage excel, EpplusExportSheetConfiguration sheetConfig)
    {
        var worksheet = excel.Workbook.Worksheets.Add(sheetConfig.SheetName);

        // Sử dụng reflection để gọi phương thức generic
        var method = typeof(EpplusExportingExcelService).GetMethod(nameof(ApplyConfigurationToWorksheet),
            BindingFlags.NonPublic | BindingFlags.Instance);
        var genericMethod = method!.MakeGenericMethod(sheetConfig.DataType);

        await (Task)genericMethod.Invoke(this, new object[] { worksheet, sheetConfig.Data, sheetConfig.Configuration })!;
    }

    /// <summary>
    /// Áp dụng cấu hình vào worksheet có sẵn (cho hỗ trợ nhiều sheet)
    /// </summary>
    private async Task ApplyConfigurationToWorksheet<T>(
        ExcelWorksheet worksheet,
        IEnumerable<T> data,
        EpplusExportingConfiguration configuration) where T : class
    {
        SetExportingConfigurationGlobal(configuration);
        // Cấu hình mặc định cho worksheet
        ConfigureWorksheetDefaults(worksheet, configuration);

        // Thêm tiêu đề
        var currentRowIndex = await AddTitlesToWorksheet(worksheet, configuration.Titles);

        // Thêm bảng dữ liệu nếu được cấu hình
        if (configuration.DataTable != null)
        {
            currentRowIndex = await AddDataTableToWorksheet<T>(worksheet, data, configuration.DataTable, currentRowIndex);
        }

        // Áp dụng cấu hình tùy chỉnh
        await ApplyCustomConfigurations(worksheet, configuration);

        // Áp dụng bảo vệ
        ApplyWorksheetProtection(worksheet, configuration);
    }

    #endregion
}