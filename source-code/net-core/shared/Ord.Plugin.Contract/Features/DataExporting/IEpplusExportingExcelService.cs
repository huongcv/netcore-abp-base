using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.DataExporting
{
    public interface IEpplusExportingExcelService : ITransientDependency
    {

        Task<byte[]> ExportDataTable<TData>(OrdPagedRequestDto pagedInput,
            Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
            params OrdExportColumnData<TData>[] cells) where TData : class;
        Task<byte[]> ExportDataTable<TData>(OrdPagedRequestDto pagedInput,
            Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged,
            Action<OrdExportExtend> funcExportInput,
            params OrdExportColumnData<TData>[] cells) where TData : class;
        Task<byte[]> ExportDataTable<TData>(IEnumerable<TData> dataItems, OrdExportExtend exportExtend, params OrdExportColumnData<TData>[] cells)
            where TData : class;
    }
}
