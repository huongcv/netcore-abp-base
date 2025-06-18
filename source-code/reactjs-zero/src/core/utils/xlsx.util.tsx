import * as XLSX from "xlsx";
import {WorkBook} from "xlsx";

interface IRowExcelData {
    rowIndex: number,
    data: any[]
}

class XlsxUtil {
    readTableData(workbook: WorkBook, sheetIndex: number) {
        const worksheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
        let jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1, defval: ""});
        // Lọc bỏ các dòng trống
        // @ts-ignore
        jsonData = jsonData.filter((row: any[]) =>
            row.some(cell => cell !== null && cell !== undefined && cell !== '')
        );
        return jsonData;
    }

    readTableDataIncludeRowIndex(workbook: WorkBook, sheetIndex: number): IRowExcelData[] {
        const worksheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
        let jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1, defval: ""});

        // Lọc bỏ các dòng trống và thêm rowIndex
        return jsonData
            // @ts-ignore
            .map((row: any[], index: number) => ({rowIndex: index + 1, data: row}))
            .filter(rowObj =>
                rowObj.data.some(cell => cell !== null && cell !== undefined && cell !== '')
            );
    }
}

export default new XlsxUtil();
