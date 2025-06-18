import {useEffect, useState} from "react";
import * as XLSX from "xlsx";
import XlsxUtil from "@ord-core/utils/xlsx.util";
import {ExcelProductStockMoveDto} from "@api/index.defs";
import {ReadDataExcelCheckStock} from "@pages/StockManagement/CheckStock/ImportExcel/readDataExcel";

const useReadExcelToDataCheckStock = (binaryStrExcel: string) => {
    const [data, setData] = useState<ExcelProductStockMoveDto[]>([]);

    useEffect(() => {
        if (!binaryStrExcel) {
            setData([]);
            return;
        }
        const workbook = XLSX.read(binaryStrExcel, {type: 'binary'});
        const jsonData: any = [];
        const jsonObjData = XlsxUtil.readTableDataIncludeRowIndex(workbook, 0);
        jsonObjData.forEach(it => {
            jsonData.push([it.rowIndex, ...it.data]);
        });
        const readData = new ReadDataExcelCheckStock();
        readData.isIncludeRowIndex = true;
        const items: ExcelProductStockMoveDto[] = readData.mapData(jsonData);
        setData(items || []);
    }, [binaryStrExcel]);
    return {data}
}
export default useReadExcelToDataCheckStock;
