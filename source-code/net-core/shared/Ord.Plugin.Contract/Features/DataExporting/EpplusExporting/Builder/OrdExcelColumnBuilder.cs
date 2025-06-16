using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Fluent column builder được tối ưu hóa - chỉ sử dụng fluent API
    /// </summary>
    public class OrdExcelColumnBuilder<T>
    {
        private readonly List<OrdExcelColumnData<T>> _columns = new();
        private readonly IAppFactory _appFactory;

        public OrdExcelColumnBuilder(IAppFactory appFactory)
        {
            _appFactory = appFactory;
        }

        /// <summary>
        /// Thêm cột số thứ tự
        /// </summary>
        public OrdExcelColumnBuilder<T> AddRowIndex(string headerName = "RowIndex", double? width = 8)
        {
            _columns.Add(OrdExcelColumnData<T>.RowIndex(headerName, width));
            return this;
        }

        /// <summary>
        /// Thêm cột với fluent builder
        /// </summary>
        public OrdExcelColumnBuilder<T> AddColumn(Action<OrdExcelColumnFluentBuilder<T>> columnBuilder)
        {
            var builder = new OrdExcelColumnFluentBuilder<T>(_appFactory);
            columnBuilder(builder);
            _columns.Add(builder.Build());
            return this;
        }

        public OrdExcelColumnData<T>[] Build() => _columns.ToArray();
    }
}