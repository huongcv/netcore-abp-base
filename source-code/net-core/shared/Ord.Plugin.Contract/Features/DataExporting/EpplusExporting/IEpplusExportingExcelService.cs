using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin
{
    /// <summary>
    /// Modern EPPlus Excel Export Service with optimized fluent API
    /// </summary>
    public interface IEpplusExportingExcelService : ITransientDependency
    {
        /// <summary>
        /// Export data from paged query with configuration builder (Recommended)
        /// </summary>
        /// <typeparam name="TData">Type of data to export</typeparam>
        /// <param name="pagedInput">Paged request input</param>
        /// <param name="funcGetPaged">Function to get paged data</param>
        /// <param name="configurationBuilder">Configuration builder action</param>
        /// <param name="columnBuilder">Column builder action</param>
        /// <returns>Excel file as byte array</returns>
        Task<byte[]> ExportFromPagedQuery<TData>(
            OrdPagedRequestDto pagedInput,
            Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
            Action<OrdExcelConfigurationBuilder> configurationBuilder,
            Action<OrdExcelColumnBuilder<TData>> columnBuilder)
            where TData : class;

        /// <summary>
        /// Export data from paged query with pre-built configuration
        /// </summary>
        /// <typeparam name="TData">Type of data to export</typeparam>
        /// <param name="pagedInput">Paged request input</param>
        /// <param name="funcGetPaged">Function to get paged data</param>
        /// <param name="configuration">Export configuration</param>
        /// <param name="columns">Column configurations</param>
        /// <returns>Excel file as byte array</returns>
        Task<byte[]> ExportFromPagedQuery<TData>(
            OrdPagedRequestDto pagedInput,
            Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
            OrdExcelConfiguration configuration,
            params OrdExcelColumnData<TData>[] columns)
            where TData : class;

        /// <summary>
        /// Export data collection with fluent builders (Recommended)
        /// </summary>
        /// <typeparam name="TData">Type of data to export</typeparam>
        /// <param name="dataItems">Data collection to export</param>
        /// <param name="columnBuilder">Column builder action</param>
        /// <param name="configurationBuilder">Configuration builder action (optional)</param>
        /// <returns>Excel file as byte array</returns>
        Task<byte[]> ExportDataCollection<TData>(
            IEnumerable<TData> dataItems,
            Action<OrdExcelColumnBuilder<TData>> columnBuilder,
            Action<OrdExcelConfigurationBuilder>? configurationBuilder = null)
            where TData : class;

        /// <summary>
        /// Export data collection with pre-built configuration
        /// </summary>
        /// <typeparam name="TData">Type of data to export</typeparam>
        /// <param name="dataItems">Data collection to export</param>
        /// <param name="configuration">Export configuration</param>
        /// <param name="columns">Column configurations</param>
        /// <returns>Excel file as byte array</returns>
        Task<byte[]> ExportDataCollection<TData>(
            IEnumerable<TData> dataItems,
            OrdExcelConfiguration configuration,
            params OrdExcelColumnData<TData>[] columns)
            where TData : class;

        /// <summary>
        /// Export multiple data collections to different worksheets in the same Excel file
        /// </summary>
        /// <param name="exportSheets">Collection of export sheet configurations</param>
        /// <returns>Excel file as byte array</returns>
        Task<byte[]> ExportMultipleSheets(params OrdExportSheetConfiguration[] exportSheets);

        /// <summary>
        /// Create export sheet configuration for multi-sheet export
        /// </summary>
        /// <typeparam name="TData">Type of data to export</typeparam>
        /// <param name="sheetName">Name of the worksheet</param>
        /// <param name="dataItems">Data collection to export</param>
        /// <param name="columnBuilder">Column builder action</param>
        /// <param name="configurationBuilder">Configuration builder action (optional)</param>
        /// <returns>Export sheet configuration</returns>
        OrdExportSheetConfiguration CreateSheetConfiguration<TData>(
            string sheetName,
            IEnumerable<TData> dataItems,
            Action<OrdExcelColumnBuilder<TData>> columnBuilder,
            Action<OrdExcelConfigurationBuilder>? configurationBuilder = null)
            where TData : class;
    }

    /// <summary>
    /// Configuration for individual export sheet in multi-sheet export
    /// </summary>
    public class OrdExportSheetConfiguration
    {
        public string SheetName { get; set; } = "Sheet1";
        public object Data { get; set; } = null!;
        public Type DataType { get; set; } = null!;
        public OrdExcelConfiguration Configuration { get; set; } = new();
        public Array Columns { get; set; } = null!;

        public static OrdExportSheetConfiguration Create<T>(
            string sheetName,
            IEnumerable<T> data,
            OrdExcelColumnData<T>[] columns,
            OrdExcelConfiguration? configuration = null) where T : class
        {
            return new OrdExportSheetConfiguration
            {
                SheetName = sheetName,
                Data = data,
                DataType = typeof(T),
                Configuration = configuration ?? OrdExcelConfiguration.Default(),
                Columns = columns
            };
        }
    }
}