using FlexCel.Report;
using Ord.Plugin.Contract.Features.DataExporting.FlexCelExporting;

namespace Ord.Plugin
{
    public static class FlexCelUtil
    {
        public static void AddDynamicTable<TItemDto>(this FlexCelReport fr,
            FlexCelTableDynamicDto<TItemDto> tableDynamic,
            string headerPrefix = "header",
            string valuePrefix = "Value",
            string dataTableName = "tableData")
        {
            // 1. Tạo headers cho bảng
            var headers = tableDynamic.Columns.Keys.ToArray();
            var dataList = tableDynamic.DataItems;

            // 2. Set headers vào FlexCel template
            for (int i = 0; i < headers.Length; i++)
            {
                var headerKey = $"{headerPrefix}{i + 1}";
                fr.SetValue(headerKey, headers[i]);
            }

            // 3. Tạo DataTable cho FlexCel
            var dataTable = new System.Data.DataTable();

            // Thêm các columns vào DataTable
            for (int i = 0; i < headers.Length; i++)
            {
                dataTable.Columns.Add($"{valuePrefix}{i + 1}", typeof(string));
            }

            // Thêm dữ liệu vào DataTable
            for (int rowIndex = 0; rowIndex < dataList.Count; rowIndex++)
            {
                var item = dataList[rowIndex];
                var row = dataTable.NewRow();

                for (int colIndex = 0; colIndex < headers.Length; colIndex++)
                {
                    var columnName = headers[colIndex];
                    var columnFunction = tableDynamic.Columns[columnName];

                    // Xử lý đặc biệt cho cột RowIndex
                    if (columnName == "RowIndex")
                    {
                        row[$"{valuePrefix}{colIndex + 1}"] = (rowIndex + 1).ToString();
                    }
                    else
                    {
                        var cellValue = columnFunction.Invoke(item) ?? "";
                        row[$"{valuePrefix}{colIndex + 1}"] = cellValue;
                    }
                }

                dataTable.Rows.Add(row);
            }

            // 4. Thêm bảng dữ liệu vào FlexCel
            fr.AddTable(dataTableName, dataTable);
        }
    }
}
