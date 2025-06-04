using OfficeOpenXml;
using OfficeOpenXml.Style;
using Ord.Plugin.Contract.DataExporting;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Utils;
using System.Drawing;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Core.DataExporting
{
    public class EpplusExportingExcelService : IEpplusExportingExcelService
    {
        public async Task<byte[]> ExportDataTable<TData>(OrdPagedRequestDto pagedInput, Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged, params OrdExportColumnData<TData>[] cells)
            where TData : class
        {
            return await ExportDataTable(pagedInput, funcGetPaged, null, cells);
        }

        public async Task<byte[]> ExportDataTable<TData>(OrdPagedRequestDto pagedInput,
            Func<OrdPagedRequestDto, Task<PagedResultDto<TData>>> funcGetPaged, 
            Action<OrdExportExtend> funcExportInput,
            params OrdExportColumnData<TData>[] cells) where TData : class
        {
            pagedInput.MaxResultCount = Int32.MaxValue;
            pagedInput.SkipCount = 0;
            var pagedResult = await funcGetPaged.Invoke(pagedInput);
            var export = new OrdExportExtend(pagedInput);
            if (funcExportInput != null)
            {
                funcExportInput.Invoke(export);
            }
            return await ExportDataTable<TData>(pagedResult.Items, export, cells);
        }

        public async Task<byte[]> ExportDataTable<TData>(IEnumerable<TData> dataItems, OrdExportExtend exportExtend, params OrdExportColumnData<TData>[] cells)
        where TData : class
        {
            ExcelPackage excel = new ExcelPackage();
            var workSheet = excel.Workbook.Worksheets.Add(exportExtend.WorksheetName ?? "Data");
            workSheet.DefaultRowHeight = exportExtend.DefaultRowHeight ?? 15;
            AddTitleExcel(workSheet, exportExtend?.Title, cells.Length);
            var idxHeadr = 0;
            var dataHeaders = cells.Select(x =>
            {
                var headerItem = x.Header;
                if (exportExtend.ListColumnName?.Any() == true
                    && exportExtend.ListColumnName.Count > idxHeadr
                     && !string.IsNullOrEmpty(exportExtend.ListColumnName[idxHeadr]))
                {
                    if ((headerItem == null || string.IsNullOrEmpty(headerItem.HeaderName)))
                    {
                        headerItem = new OrdExportTableHeader()
                        {
                            HeaderName = exportExtend.ListColumnName[idxHeadr]
                        };
                    }
                }
                idxHeadr++;
                return headerItem;

            }).ToList();
            AddHeaderTable(workSheet, dataHeaders, exportExtend.HeaderRowIndex, exportExtend.FuncStyleHeaderData);

            #region Bind data table

            if (cells != null && cells?.Any() == true && dataItems?.Any() == true)
            {
                SetColumnDataTableWidth(workSheet, cells);

                int recordDataIndex = exportExtend.HeaderRowIndex + 1;
                int rid = 0;
                foreach (var record in dataItems)
                {
                    rid++;
                    var idxColData = 0;
                    foreach (var cellTableConfig in cells)
                    {
                        idxColData++;
                        var ep_CellData = workSheet.Cells[recordDataIndex, idxColData];
                        #region Set value
                        if (cellTableConfig.IsRowIndex)
                        {
                            ep_CellData.Value = rid;
                            ep_CellData.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        }
                        else
                        {
                            try
                            {
                                if (cellTableConfig.Value != null)
                                {
                                    ep_CellData.Value = cellTableConfig.Value.Invoke(record);
                                }
                            }
                            catch
                            {
                                //
                            }
                        }


                        #endregion
                        #region Style
                        ep_CellData.Style.WrapText = true;
                        ep_CellData.Style.Font.Size = 13;
                        EpplusUtil.BoderAll(ep_CellData.Style);
                        if (exportExtend.FuncStyleCellData != null)
                        {
                            exportExtend.FuncStyleCellData.Invoke(ep_CellData.Style);
                        }
                        if (cellTableConfig.FuncStyle != null)
                        {
                            cellTableConfig.FuncStyle.Invoke(record, ep_CellData.Style);
                        }


                        #endregion
                    }
                    recordDataIndex++;
                }
            }



            #endregion

            if (exportExtend?.FuncWorksheet != null)
            {
                exportExtend.FuncWorksheet.Invoke(workSheet);
            }
            if (exportExtend?.FuncWorksheetAsync != null)
            {
                await exportExtend.FuncWorksheetAsync.Invoke(workSheet);
            }
            #region Save
            await using var memoryStream = new MemoryStream();
            await excel.SaveAsAsync(memoryStream);
            var bytes = memoryStream.ToArray();
            memoryStream.Close();
            await memoryStream.DisposeAsync();
            return bytes;


            #endregion
        }

        private void SetColumnDataTableWidth<TData>(ExcelWorksheet ws, OrdExportColumnData<TData>[] cells)
        {
            for (var col = 1; col <= cells.Length; col++)
            {
                if (cells[col - 1].Width.HasValue)
                {
                    ws.Column(col).Width = cells[col - 1].Width.Value;
                }
            }
        }

        private void AddHeaderTable(ExcelWorksheet workSheet, IEnumerable<OrdExportTableHeader> listOfHeader, int startIndex, Action<ExcelStyle> funcStyleHeaderData)
        {
            var colIndexHeader = 0;
            foreach (var headerItem in listOfHeader)
            {
                colIndexHeader++;
                if (headerItem != null)
                {
                    var ep_HeaderCell = workSheet.Cells[startIndex, colIndexHeader];
                    ep_HeaderCell.Value = headerItem.HeaderName;
                    EpplusUtil.BoderAll(ep_HeaderCell.Style);
                    ep_HeaderCell.Style.Font.Bold = true;
                    ep_HeaderCell.Worksheet.Row(ep_HeaderCell.Start.Row).Height = 26;
                    // Căn giữa theo chiều ngang
                    ep_HeaderCell.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                    // Căn giữa theo chiều dọc
                    ep_HeaderCell.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                    ep_HeaderCell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                    ep_HeaderCell.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#FFFFCC"));
                    // ep_HeaderCell.Style.Font.Color.SetColor(Color.ForestGreen);
                    ep_HeaderCell.Style.Font.Size = 13;
                    ep_HeaderCell.Style.WrapText = true;
                    if (funcStyleHeaderData != null)
                    {
                        funcStyleHeaderData.Invoke(ep_HeaderCell.Style);
                    }
                    if (headerItem.FuncStyle != null)
                    {
                        headerItem.FuncStyle.Invoke(ep_HeaderCell.Style, headerItem.HeaderName);
                    }
                }
            }
        }

        private void AddTitleExcel(ExcelWorksheet workSheet, OrdExportTitle titleExcelDto, int countColumn)
        {
            if (titleExcelDto != null)
            {
                workSheet.Row(titleExcelDto.RowIndex).Height = titleExcelDto.RowHeight ?? 32;
                workSheet.Cells[titleExcelDto.RowIndex, 1].Value = titleExcelDto.TitleName;
                var endColIndex = Math.Max(5, countColumn);
                var titleCellRange = workSheet.Cells[titleExcelDto.RowIndex, 1, titleExcelDto.RowIndex, endColIndex];
                titleCellRange.Merge = true;
                titleCellRange.Style.Font.Bold = true;
                titleCellRange.Style.Font.Size = 15;
                titleCellRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                titleCellRange.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                titleCellRange.Style.Font.Color.SetColor(Color.Black);
                titleCellRange.Style.WrapText = true;
                if (titleExcelDto.FuncStyle != null)
                {
                    try
                    {
                        titleExcelDto.FuncStyle.Invoke(titleCellRange.Style);
                    }
                    catch
                    {
                        //
                    }

                }

            }
        }
    }
}
