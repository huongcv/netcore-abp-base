using OfficeOpenXml.Style;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Cấu hình header table được tối ưu hóa
    /// </summary>
    public class OrdExcelTableHeader
    {
        /// <summary>
        /// Tên header
        /// </summary>
        public string HeaderName { get; set; } = string.Empty;

        /// <summary>
        /// Cấu hình style cho header
        /// </summary>
        public OrdExcelStyleConfiguration? Style { get; set; }

        /// <summary>
        /// Function tùy chỉnh style
        /// </summary>
        public Action<ExcelStyle, string>? CustomStyleAction { get; set; }

        /// <summary>
        /// Chiều rộng cột
        /// </summary>
        public double? Width { get; set; }

        public static OrdExcelTableHeader Create(string name, double? width = null) => new()
        {
            HeaderName = name,
            Width = width
        };
    }
}
