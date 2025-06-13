using OfficeOpenXml.Style;
using System.Linq.Expressions;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Cấu hình cột dữ liệu được tối ưu hóa
    /// </summary>
    public class OrdExcelColumnData<TData>
    {
        #region Properties

        /// <summary>
        /// Cấu hình header
        /// </summary>
        public OrdExcelTableHeader? Header { get; set; }

        /// <summary>
        /// Có phải cột số thứ tự không
        /// </summary>
        public bool IsRowIndex { get; set; }

        /// <summary>
        /// Chiều rộng cột
        /// </summary>
        public double? Width { get; set; }

        /// <summary>
        /// Function lấy giá trị từ data
        /// </summary>
        public Func<TData, object>? ValueSelector { get; set; }

        /// <summary>
        /// Cấu hình style cho data cell
        /// </summary>
        public OrdExcelStyleConfiguration? Style { get; set; }

        /// <summary>
        /// Function tùy chỉnh style cho từng cell
        /// </summary>
        public Action<TData, ExcelStyle>? CustomStyleAction { get; set; }

        /// <summary>
        /// Function format giá trị
        /// </summary>
        public Func<object, object>? ValueFormatter { get; set; }

        #endregion

        #region Constructors

        /// <summary>
        /// Constructor cho cột số thứ tự
        /// </summary>
        public OrdExcelColumnData(bool isRowIndex)
        {
            IsRowIndex = isRowIndex;
            if (isRowIndex)
            {
                Header = OrdExcelTableHeader.Create("STT", 5);
                Width = 5;
            }
        }

        /// <summary>
        /// Constructor với value selector
        /// </summary>
        public OrdExcelColumnData(Func<TData, object> valueSelector)
        {
            ValueSelector = valueSelector;
        }

        /// <summary>
        /// Constructor với value selector và style
        /// </summary>
        public OrdExcelColumnData(
            Func<TData, object> valueSelector,
            Action<TData, ExcelStyle>? customStyleAction)
        {
            ValueSelector = valueSelector;
            CustomStyleAction = customStyleAction;
        }

        /// <summary>
        /// Constructor đầy đủ
        /// </summary>
        public OrdExcelColumnData(
            Func<TData, object> valueSelector,
            Action<TData, ExcelStyle>? customStyleAction,
            double? width)
        {
            ValueSelector = valueSelector;
            CustomStyleAction = customStyleAction;
            Width = width;
        }

        #endregion

        #region Factory Methods

        /// <summary>
        /// Tạo cột số thứ tự
        /// </summary>
        public static OrdExcelColumnData<TData> RowIndex(string headerName = "STT", double? width = 5)
        {
            return new OrdExcelColumnData<TData>(true)
            {
                Header = OrdExcelTableHeader.Create(headerName, width),
                Width = width
            };
        }

        /// <summary>
        /// Tạo cột với expression
        /// </summary>
        public static OrdExcelColumnData<TData> Create<TProperty>(
            Expression<Func<TData, TProperty>> expression,
            string? headerName = null,
            double? width = null)
        {
            var compiled = expression.Compile();
            var propertyName = headerName ?? GetPropertyName(expression);

            return new OrdExcelColumnData<TData>(data => compiled(data))
            {
                Header = OrdExcelTableHeader.Create(propertyName, width),
                Width = width
            };
        }

        /// <summary>
        /// Tạo cột với expression và style configuration
        /// </summary>
        public static OrdExcelColumnData<TData> Create<TProperty>(
            Expression<Func<TData, TProperty>> expression,
            string? headerName,
            OrdExcelStyleConfiguration? style,
            double? width = null)
        {
            var compiled = expression.Compile();
            var propertyName = headerName ?? GetPropertyName(expression);

            return new OrdExcelColumnData<TData>(data => compiled(data))
            {
                Header = OrdExcelTableHeader.Create(propertyName, width),
                Style = style,
                Width = width
            };
        }

        private static string GetPropertyName<TProperty>(Expression<Func<TData, TProperty>> expression)
        {
            return expression.Body switch
            {
                MemberExpression member => member.Member.Name,
                UnaryExpression unary when unary.Operand is MemberExpression memberUnary => memberUnary.Member.Name,
                _ => "Unknown"
            };
        }

        #endregion
    }
}