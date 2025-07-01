import {ExcelReaderBase} from "@ord-components/excel/import-excel/ExcelReaderBase";
import {CountryImportDto} from "@api/base/index.defs";

export class CountryExcelReader extends ExcelReaderBase<CountryImportDto> {
    constructor() {
        super({
            "stt": "id",
            "dien thoai": "phoneCode",
            "tien te": "currencyCode",
            "ten": "name",
            "ma": "code"
        });
    }

    protected createEntity(data: any): CountryImportDto {
        return {
            ...data
        };
    }

// chuyển đôổi kiểu dữ liệu cell data
    protected transformCellValue(header: string, cellValue: any): any {
        return cellValue;
    }
    // kiểm tra xem có phải dòng header không
    protected isHeaderRow(normalized: string[]): boolean {
        return normalized.includes("stt");
    }
}