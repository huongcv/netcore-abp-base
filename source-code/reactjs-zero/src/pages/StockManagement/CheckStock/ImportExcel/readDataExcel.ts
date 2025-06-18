import {ReadDataExcelBase} from "@ord-components/excel/readDataExcelBase";
import {ExcelProductStockMoveDto} from "@api/index.defs";

type KeyOfTransStockExtendDto = keyof ExcelProductStockMoveDto;

export class ReadDataExcelCheckStock extends ReadDataExcelBase<ExcelProductStockMoveDto> {

    mapHeader(headerExcel: string): KeyOfTransStockExtendDto | null {
        if (headerExcel.indexOf('ma san pham') > -1) {
            return 'productCode';
        }
        if (headerExcel.indexOf('so lo') > -1) {
            return 'lotNumber';
        }
        if (headerExcel.indexOf('ton sau kiem') > -1) {
            return 'qty';
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
