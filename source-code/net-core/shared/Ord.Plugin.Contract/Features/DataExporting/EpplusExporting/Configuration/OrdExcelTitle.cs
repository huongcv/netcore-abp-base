using OfficeOpenXml.Style;

namespace Ord.Plugin.Contract.Features.DataExporting.EpplusExporting
{
    /// <summary>
    /// Cấu hình tiêu đề được tối ưu hóa
    /// </summary>
    public class OrdExcelTitle
    {
        /// <summary>
        /// Nội dung tiêu đề
        /// </summary>
        public string? Text { get; set; }

        /// <summary>
        /// Vị trí hàng của tiêu đề (1-based)
        /// </summary>
        public int RowIndex { get; set; } = 2;

        /// <summary>
        /// Chiều cao hàng tiêu đề
        /// </summary>
        public double? RowHeight { get; set; } = 32;
        /// <summary>
        /// Khoảng cách giữa title và datatable
        /// </summary>
        public int MarginBottomRow { get; set; } = 4;

        /// <summary>
        /// Số cột mà title sẽ span (merge). Nếu null thì sẽ dùng số cột của bảng data
        /// </summary>
        public int TitleColumnSpan { get; set; } = 0;

        /// <summary>
        /// Cấu hình style cho tiêu đề
        /// </summary>
        public OrdExcelStyleConfiguration Style { get; set; } = new()
        {
            FontSize = 16,
            IsBold = true,
            HorizontalAlignment = ExcelHorizontalAlignment.Center,
            VerticalAlignment = ExcelVerticalAlignment.Center
        };

        /// <summary>
        /// Function tùy chỉnh style
        /// </summary>
        public Action<ExcelStyle>? CustomStyleAction { get; set; }

        /// <summary>
        /// Tạo tiêu đề đơn giản
        /// </summary>
        public static OrdExcelTitle Create(string text, int rowIndex = 2) => new()
        {
            Text = text,
            RowIndex = rowIndex
        };
    }
}
