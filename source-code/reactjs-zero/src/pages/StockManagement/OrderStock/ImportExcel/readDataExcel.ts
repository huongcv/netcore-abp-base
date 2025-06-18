import {ReadDataExcelBase} from "@ord-components/excel/readDataExcelBase";
import {ExcelProductStockMoveDto} from "@api/index.defs";

type KeyOfTransStockExtendDto = keyof ExcelProductStockMoveDto;

export class ReadDataExcelOrderStock extends ReadDataExcelBase<ExcelProductStockMoveDto> {

    mapHeader(headerExcel: string): KeyOfTransStockExtendDto | null {
        if (headerExcel.indexOf('ma san pham') > -1) {
            return 'productCode';
        }
        if (headerExcel.indexOf('so lo') > -1) {
            return 'lotNumber';
        }
        if (headerExcel.indexOf('so luong chuyen') > -1) {
            return 'qty';
        }
        if (headerExcel.indexOf('don vi tinh') > -1) {
            return 'unitName';
        }
        if (headerExcel.indexOf('gia chuyen') > -1) {
            return 'price';
        }
        return null;
    }

    parseCellValue2Data(header: KeyOfTransStockExtendDto, cellValue: any, newProduct: ExcelProductStockMoveDto) {
        if(header =='lotNumber'|| header =='productCode'){
            this.setProperty(newProduct, header, cellValue?.toString());
        }else{
            this.setProperty(newProduct, header, cellValue);
        }

    }

}
