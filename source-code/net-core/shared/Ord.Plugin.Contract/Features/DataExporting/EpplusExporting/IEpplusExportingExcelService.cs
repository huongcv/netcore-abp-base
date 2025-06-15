using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin;

/// <summary>
/// Modern EPPlus Excel Export Service with optimized fluent API
/// </summary>
public interface IEpplusExportingExcelService : ITransientDependency
{
    /// <summary>
    /// Export data from paged query with new configuration builder (Recommended)
    /// </summary>
    /// <typeparam name="TData">Type of data to export</typeparam>
    /// <param name="pagedInput">Paged request input</param>
    /// <param name="funcGetPaged">Function to get paged data</param>
    /// <param name="configurationBuilder">Configuration builder action</param>
    /// <returns>Excel file as byte array</returns>
    Task<byte[]> ExportFromPagedQuery<TData>(
        OrdPagedRequestDto pagedInput,
        Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
        Action<EpplusExportingConfigurationBuilder> configurationBuilder)
        where TData : class;

    /// <summary>
    /// Export data from paged query with pre-built configuration
    /// </summary>
    /// <typeparam name="TData">Type of data to export</typeparam>
    /// <param name="pagedInput">Paged request input</param>
    /// <param name="funcGetPaged">Function to get paged data</param>
    /// <param name="configuration">Export configuration</param>
    /// <returns>Excel file as byte array</returns>
    Task<byte[]> ExportFromPagedQuery<TData>(
        OrdPagedRequestDto pagedInput,
        Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
        EpplusExportingConfiguration configuration)
        where TData : class;

    /// <summary>
    /// Export data collection with new fluent builders (Recommended)
    /// </summary>
    /// <typeparam name="TData">Type of data to export</typeparam>
    /// <param name="dataItems">Data collection to export</param>
    /// <param name="configurationBuilder">Configuration builder action</param>
    /// <returns>Excel file as byte array</returns>
    Task<byte[]> ExportDataCollection<TData>(
        IEnumerable<TData> dataItems,
        Action<EpplusExportingConfigurationBuilder> configurationBuilder)
        where TData : class;

    /// <summary>
    /// Export data collection with pre-built configuration
    /// </summary>
    /// <typeparam name="TData">Type of data to export</typeparam>
    /// <param name="dataItems">Data collection to export</param>
    /// <param name="configuration">Export configuration</param>
    /// <returns>Excel file as byte array</returns>
    Task<byte[]> ExportDataCollection<TData>(
        IEnumerable<TData> dataItems,
        EpplusExportingConfiguration configuration)
        where TData : class;

    /// <summary>
    /// Export multiple data collections to different worksheets in the same Excel file
    /// </summary>
    /// <param name="exportSheets">Collection of export sheet configurations</param>
    /// <returns>Excel file as byte array</returns>
    Task<byte[]> ExportMultipleSheets(params EpplusExportSheetConfiguration[] exportSheets);

    /// <summary>
    /// Create export sheet configuration for multi-sheet export
    /// </summary>
    /// <typeparam name="TData">Type of data to export</typeparam>
    /// <param name="sheetName">Name of the worksheet</param>
    /// <param name="dataItems">Data collection to export</param>
    /// <param name="configurationBuilder">Configuration builder action</param>
    /// <returns>Export sheet configuration</returns>
    EpplusExportSheetConfiguration CreateSheetConfiguration<TData>(
        string sheetName,
        IEnumerable<TData> dataItems,
        Action<EpplusExportingConfigurationBuilder> configurationBuilder)
        where TData : class;
}

/// <summary>
/// Configuration for individual export sheet in multi-sheet export (Updated)
/// </summary>
public class EpplusExportSheetConfiguration
{
    public string SheetName { get; set; } = "DataSheet";
    public object Data { get; set; } = null!;
    public Type DataType { get; set; } = null!;
    public EpplusExportingConfiguration Configuration { get; set; } = new();

    public static EpplusExportSheetConfiguration Create<T>(
        string sheetName,
        IEnumerable<T> data,
        EpplusExportingConfiguration configuration) where T : class
    {
        return new EpplusExportSheetConfiguration
        {
            SheetName = sheetName,
            Data = data,
            DataType = typeof(T),
            Configuration = configuration
        };
    }
}