using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using Ord.Plugin.Contract.Features.DataImporting;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Base;

namespace Ord.Plugin.Core.Features.DataImporting
{
    /// <summary>
    /// Abstract service for reading Excel files and converting to DTOs
    /// Pure data reading without business logic
    /// </summary>
    /// <typeparam name="TDto">Type of DTO to convert to</typeparam>
    public abstract class ExcelReaderService<TDto> : OrdManagerBase
        where TDto : class, IImportDto, new()
    {
        protected readonly ILogger Logger;

        protected ExcelReaderService(ILogger logger)
        {
            Logger = logger;
            // Set EPPlus license context
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }

        #region Public Methods

        /// <summary>
        /// Read Excel file and convert to DTO list
        /// </summary>
        /// <param name="fileBytes">Excel file content as byte array</param>
        /// <param name="fileName">Original file name for validation</param>
        /// <returns>List of DTOs read from Excel</returns>
        public async Task<List<TDto>> ReadFromExcelAsync(byte[] fileBytes, string fileName)
        {
            try
            {
                Logger.LogInformation("Starting Excel reading process for file: {FileName}", fileName);

                // Validate file format
                ValidateFileFormat(fileName);

                // Read Excel file
                var dtoList = await ReadExcelFileAsync(fileBytes);

                Logger.LogInformation("Successfully read {Count} records from Excel file", dtoList.Count);
                return dtoList;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error occurred during Excel reading process");
                throw;
            }
        }

        /// <summary>
        /// Validate Excel file structure only (without reading data)
        /// </summary>
        /// <param name="fileBytes">Excel file content</param>
        /// <param name="fileName">File name</param>
        /// <returns>True if file structure is valid</returns>
        public async Task<bool> ValidateExcelStructureAsync(byte[] fileBytes, string fileName)
        {
            try
            {
                ValidateFileFormat(fileName);

                using var package = new ExcelPackage(new MemoryStream(fileBytes));
                var worksheet = package.Workbook.Worksheets.FirstOrDefault();

                if (worksheet?.Dimension == null)
                    return false;

                var headerRowIndex = FindHeaderRow(worksheet);
                var headers = ExtractHeaders(worksheet, headerRowIndex);

                return ValidateFileStructure(headers);
            }
            catch
            {
                return false;
            }
        }

        #endregion

        #region Abstract Methods - Must be implemented by derived classes

        /// <summary>
        /// Map Excel header to DTO property name
        /// </summary>
        /// <param name="headerExcel">Excel header text (normalized)</param>
        /// <returns>Property name in DTO, or null if header should be ignored</returns>
        protected abstract string? MapHeader(string headerExcel);

        /// <summary>
        /// Parse cell value and set it to DTO property
        /// </summary>
        /// <param name="propertyName">Property name from MapHeader</param>
        /// <param name="cellValue">Cell value from Excel</param>
        /// <param name="dto">DTO instance to set value</param>
        protected abstract void ParseCellValueToDto(string propertyName, object? cellValue, TDto dto);

        /// <summary>
        /// Validate if file structure is correct (check required headers exist)
        /// </summary>
        /// <param name="headers">List of normalized headers from Excel</param>
        /// <returns>True if file structure is valid</returns>
        protected abstract bool ValidateFileStructure(List<string> headers);

        #endregion

        #region Virtual Methods - Can be overridden by derived classes

        /// <summary>
        /// Validate file format (extension, size, etc.)
        /// </summary>
        /// <param name="fileName">File name to validate</param>
        protected virtual void ValidateFileFormat(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                throw new ArgumentException("File name cannot be empty");

            var extension = Path.GetExtension(fileName).ToLower();
            if (extension != ".xlsx" && extension != ".xls")
                throw new ArgumentException("Only Excel files (.xlsx, .xls) are supported");
        }

        /// <summary>
        /// Normalize header text for comparison (remove accents, lowercase, etc.)
        /// </summary>
        /// <param name="headerText">Original header text</param>
        /// <returns>Normalized header text</returns>
        protected virtual string NormalizeHeaderText(string? headerText)
        {
            if (string.IsNullOrWhiteSpace(headerText))
                return string.Empty;

            return StringUtil.ConvertToUnsign(headerText.Trim().ToLower());
        }

        /// <summary>
        /// Check if a row is empty
        /// </summary>
        /// <param name="worksheet">Excel worksheet</param>
        /// <param name="row">Row index to check</param>
        /// <returns>True if row is empty</returns>
        protected virtual bool IsRowEmpty(ExcelWorksheet worksheet, int row)
        {
            if (worksheet.Dimension == null) return true;

            for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
            {
                var cellValue = worksheet.Cells[row, col].Value;
                if (cellValue != null && !string.IsNullOrWhiteSpace(cellValue.ToString()))
                    return false;
            }
            return true;
        }

        /// <summary>
        /// Get maximum number of rows to process (prevent memory issues)
        /// </summary>
        /// <returns>Maximum number of rows</returns>
        protected virtual int GetMaxRowsToProcess()
        {
            return 2000; // Higher limit for pure reading
        }

        /// <summary>
        /// Find header row in Excel file (row containing required headers)
        /// </summary>
        /// <param name="worksheet">Excel worksheet</param>
        /// <returns>1-based row index of header row</returns>
        protected virtual int FindHeaderRow(ExcelWorksheet worksheet)
        {
            if (worksheet.Dimension == null)
                throw new InvalidOperationException("Excel file is empty");

            // Look for header row (usually contains "stt" or similar identifier)
            for (int row = 1; row <= Math.Min(10, worksheet.Dimension.End.Row); row++)
            {
                var headers = new List<string>();
                for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
                {
                    var cellValue = worksheet.Cells[row, col].Value?.ToString();
                    if (!string.IsNullOrWhiteSpace(cellValue))
                    {
                        headers.Add(NormalizeHeaderText(cellValue));
                    }
                }

                if (headers.Any(h => h.Contains("stt")) || ValidateFileStructure(headers))
                {
                    return row;
                }
            }

            throw new InvalidOperationException("Cannot find header row in Excel file");
        }


        /// <summary>
        /// Handle parsing errors for a specific row
        /// </summary>
        /// <param name="row">Row number</param>
        /// <param name="ex">Exception that occurred</param>
        /// <param name="dto">DTO instance (may be partially populated)</param>
        /// <returns>DTO with error information or null to skip the row</returns>
        protected virtual TDto? HandleRowParsingError(int row, Exception ex, TDto dto)
        {
            Logger.LogWarning(ex, "Error parsing row {Row}: {Message}", row, ex.Message);

            // Try to set row number and error info if DTO supports it
            SetRowNumber(dto, row);
            SetParsingError(dto, $"Error parsing row {row}: {ex.Message}");

            return dto; // Return DTO with error info, or return null to skip
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Read Excel file using EPPlus with column mapping
        /// </summary>
        private async Task<List<TDto>> ReadExcelFileAsync(byte[] fileBytes)
        {
            using var package = new ExcelPackage(new MemoryStream(fileBytes));
            var worksheet = package.Workbook.Worksheets.FirstOrDefault();

            if (worksheet == null)
                throw new InvalidOperationException("No worksheet found in Excel file");

            if (worksheet.Dimension == null)
                throw new InvalidOperationException("Excel file is empty");

            // Find header row
            var headerRowIndex = FindHeaderRow(worksheet);

            // Extract and validate headers
            var headers = ExtractHeaders(worksheet, headerRowIndex);
            if (!ValidateFileStructure(headers))
            {
                throw new InvalidOperationException("File structure is invalid or missing required headers");
            }

            // Create column mapping
            var columnMapping = CreateColumnMapping(worksheet, headerRowIndex);

            var dtoList = new List<TDto>();
            var dataStartRow = headerRowIndex + 1;
            var maxRows = GetMaxRowsToProcess();
            var endRow = Math.Min(worksheet.Dimension.End.Row, dataStartRow + maxRows - 1);

            // Process data rows
            for (int row = dataStartRow; row <= endRow; row++)
            {
                // Skip empty rows
                if (IsRowEmpty(worksheet, row))
                    continue;

                try
                {
                    var dto = new TDto();

                    // Set row number if DTO supports it
                    SetRowNumber(dto, row);

                    // Map cell values to DTO properties
                    foreach (var (columnIndex, propertyName) in columnMapping)
                    {
                        var cellValue = worksheet.Cells[row, columnIndex].Value;
                        ParseCellValueToDto(propertyName, cellValue, dto);
                    }

                    dtoList.Add(dto);
                }
                catch (Exception ex)
                {
                    var errorDto = HandleRowParsingError(row, ex, new TDto());
                    if (errorDto != null)
                    {
                        dtoList.Add(errorDto);
                    }
                }
            }

            return dtoList;
        }

        /// <summary>
        /// Extract headers from worksheet
        /// </summary>
        private List<string> ExtractHeaders(ExcelWorksheet worksheet, int headerRowIndex)
        {
            var headers = new List<string>();

            if (worksheet.Dimension == null) return headers;

            for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
            {
                var headerValue = worksheet.Cells[headerRowIndex, col].Value?.ToString();
                if (!string.IsNullOrWhiteSpace(headerValue))
                {
                    headers.Add(NormalizeHeaderText(headerValue));
                }
                else
                {
                    headers.Add(string.Empty);
                }
            }

            return headers;
        }

        /// <summary>
        /// Create column mapping from Excel columns to DTO properties
        /// </summary>
        private Dictionary<int, string> CreateColumnMapping(ExcelWorksheet worksheet, int headerRowIndex)
        {
            var columnMapping = new Dictionary<int, string>();

            if (worksheet.Dimension == null) return columnMapping;

            for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
            {
                var headerValue = worksheet.Cells[headerRowIndex, col].Value?.ToString();
                if (!string.IsNullOrWhiteSpace(headerValue))
                {
                    var normalizedHeader = NormalizeHeaderText(headerValue);
                    var propertyName = MapHeader(normalizedHeader);

                    if (!string.IsNullOrEmpty(propertyName))
                    {
                        columnMapping[col] = propertyName;
                    }
                }
            }

            return columnMapping;
        }

        /// <summary>
        /// Set row number in DTO if it has a RowNumber property
        /// </summary>
        private void SetRowNumber(TDto dto, int rowNumber)
        {
            dto.RowNumber = rowNumber;
        }

        /// <summary>
        /// Set parsing error in DTO if it has an ErrorMessage property
        /// </summary>
        private void SetParsingError(TDto dto, string errorMessage)
        {
            var errorProperty = typeof(TDto).GetProperty("ErrorMessage");
            if (errorProperty != null && errorProperty.CanWrite)
            {
                errorProperty.SetValue(dto, errorMessage);
            }
        }

        #endregion
    }
}