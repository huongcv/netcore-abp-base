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

// kiểm tra xem có phải dòng header không
    protected isHeaderRow(normalized: string[]): boolean {
        const requiredHeaders = ["stt", "ma_quoc_gia", "cap", "ten", "ma"];
        const normalizeHeader = (header: string) =>
            header.trim().toLowerCase().replace(/\s+/g, "_");

        const normalizedSet = new Set(normalized.map(normalizeHeader));

        return requiredHeaders.every(header =>
            normalizedSet.has(normalizeHeader(header))
        );
    }
}