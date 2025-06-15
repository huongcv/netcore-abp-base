using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using Ord.Plugin.Core.Base;
using System.Reflection;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Features.DataExporting;

/// <summary>
/// EPPlus Excel Export Service with updated configuration system
/// </summary>
public class EpplusExportingExcelService : OrdManagerBase, IEpplusExportingExcelService, ITransientDependency
{
    private readonly ILogger<EpplusExportingExcelService> _logger;

    public EpplusExportingExcelService(ILogger<EpplusExportingExcelService> logger)
    {
        _logger = logger;
        // Set EPPlus license context
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
    }

    #region New Export API Methods

    /// <summary>
    /// Export from paged query with new configuration builder
    /// </summary>
    public async Task<byte[]> ExportFromPagedQuery<TData>(
        OrdPagedRequestDto pagedInput,
        Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
        Action<EpplusExportingConfigurationBuilder> configurationBuilder) where TData : class
    {
        // Build configuration
        var configBuilder = EpplusExportingConfiguration.Builder();
        configurationBuilder(configBuilder);
        var configuration = configBuilder.Build();

        return await ExportFromPagedQuery(pagedInput, funcGetPaged, configuration);
    }

    /// <summary>
    /// Export from paged query with pre-built configuration
    /// </summary>
    public async Task<byte[]> ExportFromPagedQuery<TData>(
        OrdPagedRequestDto pagedInput,
        Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
        EpplusExportingConfiguration configuration) where TData : class
    {
        try
        {
            _logger.LogInformation("Starting paged export for type {DataType}", typeof(TData).Name);

            // Validate parameters
            ValidateExportParameters(pagedInput, funcGetPaged, configuration);

            // Prepare paged input for full export
            var exportPagedInput = PreparePagedInputForExport(pagedInput);

            // Get all data
            var pagedResult = await funcGetPaged.Invoke(exportPagedInput);

            _logger.LogInformation("Retrieved {TotalCount} records for export", pagedResult.TotalCount);

            // Export the data
            return await ExportDataCollection(pagedResult.Items, configuration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during paged export");
            throw;
        }
    }

    /// <summary>
    /// Export data collection with new fluent builders
    /// </summary>
    public async Task<byte[]> ExportDataCollection<TData>(
        IEnumerable<TData> dataItems,
        Action<EpplusExportingConfigurationBuilder> configurationBuilder) where TData : class
    {
        // Build configuration
        var configBuilder = EpplusExportingConfiguration.Builder();
        configurationBuilder(configBuilder);
        var configuration = configBuilder.Build();

        return await ExportDataCollection(dataItems, configuration);
    }

    /// <summary>
    /// Export data collection with pre-built configuration
    /// </summary>
    public async Task<byte[]> ExportDataCollection<TData>(
        IEnumerable<TData> dataItems,
        EpplusExportingConfiguration configuration) where TData : class
    {
        try
        {
            _logger.LogInformation("Starting direct export with {RecordCount} records", dataItems.Count());

            // Validate parameters
            ValidateDirectExportParameters(dataItems, configuration);

            // Create Excel package
            using var excel = new ExcelPackage();
            var workSheet = excel.Workbook.Worksheets.Add(configuration.WorksheetName);

            // Configure worksheet defaults
            ConfigureWorksheetDefaults(workSheet, configuration);

            // Add titles
            var currentRowIndex = await AddTitlesToWorksheet(workSheet, configuration.Titles);

            // Add data table if configured
            if (configuration.DataTable != null)
            {
                currentRowIndex = await AddDataTableToWorksheet<TData>(workSheet, dataItems, configuration.DataTable, currentRowIndex);
            }

            // Apply custom configurations
            await ApplyCustomConfigurations(workSheet, configuration);

            // Apply worksheet protection
            ApplyWorksheetProtection(workSheet, configuration);

            // Save and return
            var result = await SaveExcelToBytes(excel);

            _logger.LogInformation("Successfully exported {RecordCount} records", dataItems.Count());

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during direct export");
            throw;
        }
    }

    /// <summary>
    /// Export multiple sheets
    /// </summary>
    public async Task<byte[]> ExportMultipleSheets(params EpplusExportSheetConfiguration[] exportSheets)
    {
        try
        {
            _logger.LogInformation("Starting multi-sheet export with {SheetCount} sheets", exportSheets.Length);

            using var excel = new ExcelPackage();

            foreach (var sheetConfig in exportSheets)
            {
                await CreateWorksheetFromConfiguration(excel, sheetConfig);
            }

            var result = await SaveExcelToBytes(excel);

            _logger.LogInformation("Successfully exported multi-sheet file with {SheetCount} sheets", exportSheets.Length);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during multi-sheet export");
            throw;
        }
    }

    /// <summary>
    /// Create export sheet configuration for multi-sheet export
    /// </summary>
    public EpplusExportSheetConfiguration CreateSheetConfiguration<TData>(
        string sheetName,
        IEnumerable<TData> dataItems,
        Action<EpplusExportingConfigurationBuilder> configurationBuilder) where TData : class
    {
        // Build configuration
        var configBuilder = EpplusExportingConfiguration.Builder();
        configurationBuilder(configBuilder);
        var configuration = configBuilder.Build();

        // Override worksheet name
        configuration.WorksheetName = sheetName;

        return EpplusExportSheetConfiguration.Create(sheetName, dataItems, configuration);
    }

    #endregion

    #region Private Helper Methods

    /// <summary>
    /// Validate paged export parameters
    /// </summary>
    private void ValidateExportParameters<TData>(
        OrdPagedRequestDto pagedInput,
        Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
        EpplusExportingConfiguration configuration) where TData : class
    {
        if (pagedInput == null)
            throw new ArgumentNullException(nameof(pagedInput));
        if (funcGetPaged == null)
            throw new ArgumentNullException(nameof(funcGetPaged));
        if (configuration == null)
            throw new ArgumentNullException(nameof(configuration));
    }

    /// <summary>
    /// Validate direct export parameters
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
    /// Prepare paged input for full export
    /// </summary>
    private OrdPagedRequestDto PreparePagedInputForExport(OrdPagedRequestDto pagedInput)
    {
        return new OrdPagedRequestDto
        {
            MaxResultCount = int.MaxValue,
            SkipCount = 0,
            Sorting = pagedInput.Sorting
        };
    }

    /// <summary>
    /// Configure worksheet default settings
    /// </summary>
    private void ConfigureWorksheetDefaults(ExcelWorksheet workSheet, EpplusExportingConfiguration configuration)
    {
        workSheet.DefaultRowHeight = configuration.DefaultRowHeight;
        workSheet.DefaultColWidth = configuration.DefaultColumnWidth;

        // Apply print settings
        configuration.PrintSettings.ApplyTo(workSheet);
    }

    /// <summary>
    /// Add titles to worksheet
    /// </summary>
    private async Task<int> AddTitlesToWorksheet(ExcelWorksheet workSheet, List<OrdExcelTitle> titles)
    {
        var currentRowIndex = 1;

        foreach (var title in titles)
        {
            if (title == null || string.IsNullOrEmpty(title.Text))
                continue;

            // Use the RowIndex from title configuration
            var titleRowIndex = title.RowIndex > 0 ? title.RowIndex : currentRowIndex;

            var actualColumnSpan = title.TitleColumnSpan > 0 ? title.TitleColumnSpan : GetWorksheetColumnCount(workSheet);
            var titleRange = workSheet.Cells[titleRowIndex, 1, titleRowIndex, actualColumnSpan];
            titleRange.Merge = true;
            titleRange.Value = title.Text;

            // Apply title styling
            title.Style.ApplyTo(titleRange.Style);
            title.CustomStyleAction?.Invoke(titleRange.Style);

            if (title.RowHeight.HasValue)
                workSheet.Row(titleRowIndex).Height = title.RowHeight.Value;

            // Update current row index for next title
            currentRowIndex = Math.Max(currentRowIndex, titleRowIndex + title.MarginBottomRow);
        }

        return currentRowIndex;
    }

    /// <summary>
    /// Get worksheet column count (for title spanning)
    /// </summary>
    private int GetWorksheetColumnCount(ExcelWorksheet workSheet)
    {
        // Default to reasonable column count if worksheet is empty
        return workSheet.Dimension?.End.Column ?? 10;
    }

    /// <summary>
    /// Add data table to worksheet
    /// </summary>
    private async Task<int> AddDataTableToWorksheet<TData>(
        ExcelWorksheet workSheet,
        IEnumerable<TData> dataItems,
        EpplusDataTableConfiguration dataTableConfig,
        int currentRowIndex) where TData : class
    {
        // Get columns from configuration
        var columns = GetColumnsFromConfiguration<TData>(dataTableConfig);
        if (columns == null || columns.Length == 0)
        {
            _logger.LogWarning("No columns configured for data table");
            return currentRowIndex;
        }

        // Use configured row index or current position
        var headerRowIndex = Math.Max(currentRowIndex, dataTableConfig.RowIndexStart);

        // Add headers
        currentRowIndex = await AddHeadersToWorksheet(workSheet, dataTableConfig, columns, headerRowIndex);

        // Add data rows
        currentRowIndex = await AddDataRowsToWorksheet(workSheet, dataItems, columns, dataTableConfig, currentRowIndex);

        // Configure columns (width, auto-fit)
        ConfigureColumns(workSheet, columns, dataTableConfig);

        return currentRowIndex;
    }

    /// <summary>
    /// Get columns from data table configuration
    /// </summary>
    private OrdExcelColumnData<TData>[] GetColumnsFromConfiguration<TData>(EpplusDataTableConfiguration dataTableConfig) where TData : class
    {
        if (dataTableConfig.ColumnsConfiguration is OrdExcelColumnBuilder<TData> columnBuilder)
        {
            // Inject AppFactory if needed
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
    /// Add headers to worksheet
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

            // Set header text
            var headerText = GetHeaderText(column, col);
            if (!string.IsNullOrEmpty(headerText) && !headerText.StartsWith("field"))
            {
                headerText = "field." + headerText;
            }
            headerCell.Value = AppFactory.GetLocalizedMessage(headerText);

            // Apply header styling
            dataTableConfig.HeaderStyle.ApplyTo(headerCell.Style);
            column.Header?.Style?.ApplyTo(headerCell.Style);
            column.Header?.CustomStyleAction?.Invoke(headerCell.Style, headerText);
        }

        var rowHeight = dataTableConfig.HeaderStyle?.RowHeight;
        if (rowHeight.HasValue)
        {
            workSheet.Row(headerRowIndex).Height = rowHeight.Value;
        }

        return headerRowIndex + 1;
    }

    /// <summary>
    /// Get header text for column
    /// </summary>
    private string GetHeaderText<TData>(OrdExcelColumnData<TData> column, int columnIndex) where TData : class
    {
        // Use column header name
        if (!string.IsNullOrEmpty(column.Header?.HeaderName))
        {
            return column.Header.HeaderName;
        }

        // Default name
        return $"Column {columnIndex + 1}";
    }

    /// <summary>
    /// Add data rows to worksheet
    /// </summary>
    private async Task<int> AddDataRowsToWorksheet<TData>(
        ExcelWorksheet workSheet,
        IEnumerable<TData> dataItems,
        OrdExcelColumnData<TData>[] columns,
        EpplusDataTableConfiguration dataTableConfig,
        int startRowIndex) where TData : class
    {
        if (!dataItems.Any())
            return startRowIndex;

        var currentRowIndex = startRowIndex;
        var recordIndex = 0;

        foreach (var dataItem in dataItems)
        {
            recordIndex++;

            for (int colIndex = 0; colIndex < columns.Length; colIndex++)
            {
                var column = columns[colIndex];
                var cell = workSheet.Cells[currentRowIndex, colIndex + 1];

                // Set cell value
                var cellValue = GetCellValue(column, dataItem, recordIndex);
                cell.Value = cellValue;

                // Apply cell styling
                dataTableConfig.DataStyle.ApplyTo(cell.Style);
                column.Style?.ApplyTo(cell.Style);
                column.CustomStyleAction?.Invoke(dataItem, cell.Style);
            }

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
    /// Get cell value from column configuration
    /// </summary>
    private object GetCellValue<TData>(
        OrdExcelColumnData<TData> column,
        TData dataItem,
        int recordIndex) where TData : class
    {
        if (column.IsRowIndex)
        {
            return recordIndex;
        }

        if (column.ValueSelector == null)
        {
            return string.Empty;
        }

        var rawValue = column.ValueSelector(dataItem);

        // Apply value formatter if available
        if (column.ValueFormatter != null)
        {
            return column.ValueFormatter(rawValue);
        }

        return FormatCellValue(rawValue);
    }

    /// <summary>
    /// Format cell value based on type
    /// </summary>
    private object FormatCellValue(object? value)
    {
        if (value == null)
            return string.Empty;

        return value switch
        {
            DateTime dateTime => dateTime,
            DateOnly dateOnly => dateOnly.ToDateTime(TimeOnly.MinValue),
            TimeOnly timeOnly => timeOnly.ToString("HH:mm:ss"),
            bool boolean => boolean,
            decimal or double or float or int or long => value,
            _ => value.ToString() ?? string.Empty
        };
    }

    /// <summary>
    /// Configure columns (width, auto-fit)
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

            // Set explicit width
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
                // Use default width
                excelColumn.Width = 12;
            }
        }
    }

    /// <summary>
    /// Apply custom configurations
    /// </summary>
    private async Task ApplyCustomConfigurations(ExcelWorksheet workSheet, EpplusExportingConfiguration configuration)
    {
        configuration.CustomWorksheetAction?.Invoke(workSheet);

        if (configuration.CustomWorksheetAsyncAction != null)
        {
            await configuration.CustomWorksheetAsyncAction(workSheet);
        }
    }

    /// <summary>
    /// Apply worksheet protection
    /// </summary>
    private void ApplyWorksheetProtection(ExcelWorksheet workSheet, EpplusExportingConfiguration configuration)
    {
        if (configuration.ProtectWorksheet)
        {
            if (!string.IsNullOrEmpty(configuration.WorksheetPassword))
            {
                workSheet.Protection.SetPassword(configuration.WorksheetPassword);
            }
            workSheet.Protection.IsProtected = true;
        }
    }

    /// <summary>
    /// Save Excel package to byte array
    /// </summary>
    private async Task<byte[]> SaveExcelToBytes(ExcelPackage excel)
    {
        await using var memoryStream = new MemoryStream();
        await excel.SaveAsAsync(memoryStream);
        return memoryStream.ToArray();
    }

    /// <summary>
    /// Create worksheet from sheet configuration (for multi-sheet export)
    /// </summary>
    private async Task CreateWorksheetFromConfiguration(ExcelPackage excel, EpplusExportSheetConfiguration sheetConfig)
    {
        var worksheet = excel.Workbook.Worksheets.Add(sheetConfig.SheetName);

        // Use reflection to call the generic method
        var method = typeof(EpplusExportingExcelService).GetMethod(nameof(ApplyConfigurationToWorksheet),
            BindingFlags.NonPublic | BindingFlags.Instance);
        var genericMethod = method!.MakeGenericMethod(sheetConfig.DataType);

        await (Task)genericMethod.Invoke(this, new object[] { worksheet, sheetConfig.Data, sheetConfig.Configuration })!;
    }

    /// <summary>
    /// Apply configuration to existing worksheet (for multi-sheet support)
    /// </summary>
    private async Task ApplyConfigurationToWorksheet<T>(
        ExcelWorksheet worksheet,
        IEnumerable<T> data,
        EpplusExportingConfiguration configuration) where T : class
    {
        // Configure worksheet defaults
        ConfigureWorksheetDefaults(worksheet, configuration);

        // Add titles
        var currentRowIndex = await AddTitlesToWorksheet(worksheet, configuration.Titles);

        // Add data table if configured
        if (configuration.DataTable != null)
        {
            currentRowIndex = await AddDataTableToWorksheet<T>(worksheet, data, configuration.DataTable, currentRowIndex);
        }

        // Apply custom configurations
        await ApplyCustomConfigurations(worksheet, configuration);

        // Apply protection
        ApplyWorksheetProtection(worksheet, configuration);
    }

    #endregion
}