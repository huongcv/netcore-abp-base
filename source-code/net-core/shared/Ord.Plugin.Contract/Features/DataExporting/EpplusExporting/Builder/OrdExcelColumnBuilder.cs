using OfficeOpenXml.Style;
using Ord.Plugin.Contract.Factories;
using System.Drawing;
using System.Linq.Expressions;

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
        public OrdExcelColumnBuilder<T> AddRowIndex(string headerName = "RowIndex", double? width = 5)
        {
            _columns.Add(OrdExcelColumnData<T>.RowIndex(headerName, width));
            return this;
        }

        /// <summary>
        /// Thêm cột với fluent builder
        /// </summary>
        public OrdExcelColumnBuilder<T> AddColumn(Action<OrdExcelColumnFluentBuilder<T>> columnBuilder)
        {
            var builder = new OrdExcelColumnFluentBuilder<T>();
            columnBuilder(builder);
            _columns.Add(builder.Build());
            return this;
        }

        /// <summary>
        /// Thêm cột IsActive với format chuẩn
        /// </summary>
        public OrdExcelColumnBuilder<T> AddIsActiveColumn(
            Expression<Func<T, bool?>> expression,
            double? width = null,
            string? headerName = null)
        {
            return AddColumn(c => c
                .WithValue(x => expression.Compile().Invoke(x) == true
                    ? _appFactory.GetLocalizedMessage("status.active")
                    : _appFactory.GetLocalizedMessage("status.inactive"))
                .WithHeader(headerName ?? "Status")
                .WithWidth(width ?? 12)
                .WithConditionalFormat(
                    u => expression.Compile().Invoke(u) == true,
                    Color.Green,
                    Color.Red)
                .WithCenterAlignment());
        }

        public OrdExcelColumnData<T>[] Build() => _columns.ToArray();
    }
}