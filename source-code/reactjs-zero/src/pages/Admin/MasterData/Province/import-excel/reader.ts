import {ExcelReaderBase} from "@ord-components/excel/import-excel/ExcelReaderBase";
import {ProvinceImportDto} from "@api/base/index.defs";

export class ProvinceExcelReader extends ExcelReaderBase<ProvinceImportDto> {
    constructor() {
        super({
            "stt": "id",
            "ma quoc gia": "countryCode",
            "cap": "level",
            "ten": "name",
            "ma": "code"
        });
    }

    protected createEntity(data: any): ProvinceImportDto {
        return {
            ...data
        };
    }

// chuyển đôổi kiểu dữ liệu cell data
    protected transformCellValue(header: string, cellValue: any): any {
        return cellValue;
    }
}