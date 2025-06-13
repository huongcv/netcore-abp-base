using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using System.Reflection;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Factories;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Core.Features.DataExporting
{
    /// <summary>
    /// EPPlus Excel Export Service with optimized configuration system
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

        #region Modern Export API Methods

        /// <summary>
        /// Export from paged query with fluent builders (Recommended)
        /// </summary>
        public async Task<byte[]> ExportFromPagedQuery<TData>(
            OrdPagedRequestDto pagedInput,
            Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
            Action<OrdExcelConfigurationBuilder> configurationBuilder,
            Action<OrdExcelColumnBuilder<TData>> columnBuilder) where TData : class
        {
            // Build configuration
            var configBuilder = OrdExcelConfiguration.Builder();
            configurationBuilder(configBuilder);
            var configuration = configBuilder.Build();

            // Build columns
            var colBuilder = new OrdExcelColumnBuilder<TData>(AppFactory);
            columnBuilder(colBuilder);
            var columns = colBuilder.Build();

            return await ExportFromPagedQuery(pagedInput, funcGetPaged, configuration, columns);
        }

        /// <summary>
        /// Export from paged query with pre-built configuration
        /// </summary>
        public async Task<byte[]> ExportFromPagedQuery<TData>(
            OrdPagedRequestDto pagedInput,
            Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
            OrdExcelConfiguration configuration,
            params OrdExcelColumnData<TData>[] columns) where TData : class
        {
            try
            {
                _logger.LogInformation("Starting paged export for type {DataType}", typeof(TData).Name);

                // Validate parameters
                ValidateExportParameters(pagedInput, funcGetPaged, columns);

                // Prepare paged input for full export
                var exportPagedInput = PreparePagedInputForExport(pagedInput);

                // Get all data
                var pagedResult = await funcGetPaged.Invoke(exportPagedInput);

                _logger.LogInformation("Retrieved {TotalCount} records for export", pagedResult.TotalCount);

                // Export the data
                return await ExportDataCollection(pagedResult.Items, configuration, columns);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during paged export");
                throw;
            }
        }

        /// <summary>
        /// Export data collection with fluent builders (Recommended)
        /// </summary>
        public async Task<byte[]> ExportDataCollection<TData>(
            IEnumerable<TData> dataItems,
            Action<OrdExcelColumnBuilder<TData>> columnBuilder,
            Action<OrdExcelConfigurationBuilder>? configurationBuilder = null) where TData : class
        {
            // Build columns
            var colBuilder = new OrdExcelColumnBuilder<TData>(AppFactory);
            columnBuilder(colBuilder);
            var columns = colBuilder.Build();

            // Build configuration
            var configuration = OrdExcelConfiguration.Default();
            if (configurationBuilder != null)
            {
                var configBuilder = OrdExcelConfiguration.Builder();
                configurationBuilder(configBuilder);
                configuration = configBuilder.Build();
            }

            return await ExportDataCollection(dataItems, configuration, columns);
        }

        /// <summary>
        /// Export data collection with pre-built configuration
        /// </summary>
        public async Task<byte[]> ExportDataCollection<TData>(
            IEnumerable<TData> dataItems,
            OrdExcelConfiguration configuration,
            params OrdExcelColumnData<TData>[] columns) where TData : class
        {
            try
            {
                _logger.LogInformation("Starting direct export with {RecordCount} records", dataItems.Count());

                // Validate parameters
                ValidateDirectExportParameters(dataItems, configuration, columns);

                // Create Excel package
                using var excel = new ExcelPackage();
                var workSheet = excel.Workbook.Worksheets.Add(configuration.WorksheetName);

                // Configure worksheet defaults
                ConfigureWorksheetDefaults(workSheet, configuration);

                // Process columns (add row index if needed)
                var processedColumns = columns;

                // Add title
                var currentRowIndex = await AddTitleToWorksheet(workSheet, configuration.Title, processedColumns.Length);

                // Add headers
                currentRowIndex = await AddHeadersToWorksheet(workSheet, configuration, processedColumns, currentRowIndex);

                // Add data rows
                currentRowIndex = await AddDataRowsToWorksheet(workSheet, dataItems, processedColumns, configuration, currentRowIndex);

                // Configure columns (width, auto-fit)
                ConfigureColumns(workSheet, processedColumns, configuration);

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
        public async Task<byte[]> ExportMultipleSheets(params OrdExportSheetConfiguration[] exportSheets)
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
        public OrdExportSheetConfiguration CreateSheetConfiguration<TData>(
            string sheetName,
            IEnumerable<TData> dataItems,
            Action<OrdExcelColumnBuilder<TData>> columnBuilder,
            Action<OrdExcelConfigurationBuilder>? configurationBuilder = null) where TData : class
        {
            // Build columns
            var colBuilder = new OrdExcelColumnBuilder<TData>(AppFactory);
            columnBuilder(colBuilder);
            var columns = colBuilder.Build();

            // Build configuration
            var configuration = OrdExcelConfiguration.Default();
            if (configurationBuilder != null)
            {
                var configBuilder = OrdExcelConfiguration.Builder();
                configurationBuilder(configBuilder);
                configuration = configBuilder.Build();
            }

            // Override worksheet name
            configuration.WorksheetName = sheetName;

            return OrdExportSheetConfiguration.Create(sheetName, dataItems, columns, configuration);
        }

        #endregion

        #region Private Helper Methods

        /// <summary>
        /// Validate paged export parameters
        /// </summary>
        private void ValidateExportParameters<TData>(
            OrdPagedRequestDto pagedInput,
            Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
            OrdExcelColumnData<TData>[] columns) where TData : class
        {
            if (pagedInput == null)
                throw new ArgumentNullException(nameof(pagedInput));
            if (funcGetPaged == null)
                throw new ArgumentNullException(nameof(funcGetPaged));
            if (columns == null || columns.Length == 0)
                throw new ArgumentException("Columns cannot be null or empty", nameof(columns));
        }

        /// <summary>
        /// Validate direct export parameters
        /// </summary>
        private void ValidateDirectExportParameters<TData>(
            IEnumerable<TData> dataItems,
            OrdExcelConfiguration configuration,
            OrdExcelColumnData<TData>[] columns) where TData : class
        {
            if (dataItems == null)
                throw new ArgumentNullException(nameof(dataItems));
            if (configuration == null)
                throw new ArgumentNullException(nameof(configuration));
            if (columns == null || columns.Length == 0)
                throw new ArgumentException("Columns cannot be null or empty", nameof(columns));
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
                // Copy other properties as needed
            };
        }

        /// <summary>
        /// Configure worksheet default settings
        /// </summary>
        private void ConfigureWorksheetDefaults(ExcelWorksheet workSheet, OrdExcelConfiguration configuration)
        {
            workSheet.DefaultRowHeight = configuration.DefaultRowHeight;
            workSheet.DefaultColWidth = configuration.DefaultColumnWidth;

            // Apply print settings
            configuration.PrintSettings.ApplyTo(workSheet);
        }


        /// <summary>
        /// Add title to worksheet
        /// </summary>
        private async Task<int> AddTitleToWorksheet(
            ExcelWorksheet workSheet,
            OrdExcelTitle? title,
            int columnCount)
        {
            if (title == null || string.IsNullOrEmpty(title.Text))
                return 1;

            var titleRange = workSheet.Cells[title.RowIndex, 1, title.RowIndex, columnCount];
            titleRange.Merge = true;
            titleRange.Value = title.Text;

            // Apply title styling
            title.Style.ApplyTo(titleRange.Style);
            title.CustomStyleAction?.Invoke(titleRange.Style);

            if (title.RowHeight.HasValue)
                workSheet.Row(title.RowIndex).Height = title.RowHeight.Value;

            return title.RowIndex + title.MarginBottomRow;
        }

        /// <summary>
        /// Add headers to worksheet
        /// </summary>
        private async Task<int> AddHeadersToWorksheet<TData>(
            ExcelWorksheet workSheet,
            OrdExcelConfiguration configuration,
            OrdExcelColumnData<TData>[] columns,
            int currentRowIndex) where TData : class
        {
            var headerRowIndex = Math.Max(currentRowIndex, configuration.HeaderRowIndex);

            for (int col = 0; col < columns.Length; col++)
            {
                var column = columns[col];
                var headerCell = workSheet.Cells[headerRowIndex, col + 1];

                // Set header text
                var headerText = GetHeaderText(column, col, configuration.CustomColumnNames);
                if (!string.IsNullOrEmpty(headerText) && !headerText.StartsWith("field"))
                {
                    headerText = "field." + headerText;
                }
                headerCell.Value = AppFactory.GetLocalizedMessage(headerText);

                // Apply header styling
                configuration.HeaderStyle.ApplyTo(headerCell.Style);
                column.Header?.Style?.ApplyTo(headerCell.Style);
                column.Header?.CustomStyleAction?.Invoke(headerCell.Style, headerText);
            }

            return headerRowIndex + 1;
        }

        /// <summary>
        /// Get header text for column
        /// </summary>
        private string GetHeaderText<TData>(
            OrdExcelColumnData<TData> column,
            int columnIndex,
            List<string>? customColumnNames) where TData : class
        {
            // Use custom column name if provided
            if (customColumnNames?.Count > columnIndex &&
                !string.IsNullOrEmpty(customColumnNames[columnIndex]))
            {
                return customColumnNames[columnIndex];
            }

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
            OrdExcelConfiguration configuration,
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
                    configuration.DataStyle.ApplyTo(cell.Style);
                    column.Style?.ApplyTo(cell.Style);
                    column.CustomStyleAction?.Invoke(dataItem, cell.Style);
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
            OrdExcelConfiguration configuration) where TData : class
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
                // Auto-fit if enabled and no explicit width
                else if (configuration.AutoFitColumns)
                {
                    excelColumn.AutoFit(configuration.MinColumnWidth, configuration.MaxColumnWidth);
                }
                else
                {
                    excelColumn.Width = configuration.DefaultColumnWidth;
                }
            }
        }

        /// <summary>
        /// Apply custom configurations
        /// </summary>
        private async Task ApplyCustomConfigurations(ExcelWorksheet workSheet, OrdExcelConfiguration configuration)
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
        private void ApplyWorksheetProtection(ExcelWorksheet workSheet, OrdExcelConfiguration configuration)
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
        private async Task CreateWorksheetFromConfiguration(ExcelPackage excel, OrdExportSheetConfiguration sheetConfig)
        {
            var worksheet = excel.Workbook.Worksheets.Add(sheetConfig.SheetName);

            // Use reflection to call the generic method
            var method = typeof(EpplusExportingExcelService).GetMethod(nameof(ApplyConfigurationToWorksheet),
                BindingFlags.NonPublic | BindingFlags.Instance);
            var genericMethod = method!.MakeGenericMethod(sheetConfig.DataType);

            await (Task)genericMethod.Invoke(this, new object[] { worksheet, sheetConfig.Data, sheetConfig.Configuration, sheetConfig.Columns })!;
        }

        /// <summary>
        /// Apply configuration to existing worksheet (for multi-sheet support)
        /// </summary>
        private async Task ApplyConfigurationToWorksheet<T>(
            ExcelWorksheet worksheet,
            IEnumerable<T> data,
            OrdExcelConfiguration configuration,
            OrdExcelColumnData<T>[] columns) where T : class
        {
            // Configure worksheet defaults
            ConfigureWorksheetDefaults(worksheet, configuration);

            // Process columns
            var processedColumns = columns;

            // Add title
            var currentRowIndex = await AddTitleToWorksheet(worksheet, configuration.Title, processedColumns.Length);

            // Add headers
            currentRowIndex = await AddHeadersToWorksheet(worksheet, configuration, processedColumns, currentRowIndex);

            // Add data
            currentRowIndex = await AddDataRowsToWorksheet(worksheet, data, processedColumns, configuration, currentRowIndex);

            // Configure columns
            ConfigureColumns(worksheet, processedColumns, configuration);

            // Apply custom configurations
            await ApplyCustomConfigurations(worksheet, configuration);

            // Apply protection
            ApplyWorksheetProtection(worksheet, configuration);
        }

        #endregion
    }
}