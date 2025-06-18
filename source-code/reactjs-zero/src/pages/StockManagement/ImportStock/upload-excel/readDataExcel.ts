import {ReadDataExcelBase} from "@ord-components/excel/readDataExcelBase";
import {ExcelProductStockMoveDto} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";

export class ReadDataExcelImportStock extends ReadDataExcelBase<ExcelProductStockMoveDto> {
    mapHeader(headerExcel: string) {
        if (headerExcel.indexOf('ma san pham') > -1) {
            return 'productCode';
        }
        if (headerExcel.indexOf('ten san pham') > -1) {
            return 'productName';
        }
        if (headerExcel.indexOf('so lo') > -1) {
            return 'lotNumber';
        }
        if (headerExcel.indexOf('han su dung') > -1) {
            return 'expiryDateStr';
        }
        if (headerExcel.indexOf('so luong') > -1) {
            return 'qty';
        }
        if (headerExcel.indexOf('don vi') > -1) {
            return 'unitName';
        }
        if (headerExcel.indexOf('don gia') > -1) {
            return 'price';
        }
        if (headerExcel.indexOf('tong chiet khau') > -1) {
            return 'discountAmount';
        }
        if (headerExcel.indexOf('%') > -1) {
            return 'discountPercent';
        }
        return null;
    }

    parseCellValue2Data(header: string, cellValue: any, newItem: ExcelProductStockMoveDto): void {
        if (header == 'expiryDateStr') {
            if (!!cellValue) {
                // @ts-ignore
                newItem.expiryDate = DateUtil.convertExcelValue(cellValue);
            }
            return;
        }
        if (header) {
            // @ts-ignore
            newItem[header] = cellValue;
        }
    }

}
