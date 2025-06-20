import Utils from "@ord-core/utils/utils";
import {IExcelReader} from "@ord-components/import-excel/types";
import {l} from "@ord-core/language/lang.utils";
import * as XLSX from "xlsx";
import XlsxUtil from "@ord-core/utils/xlsx.util";

export abstract class ExcelReaderBase<T> implements IExcelReader<T> {
    protected fieldLength = 0;
    protected headerMapping: Record<string, string> = {};

    constructor(headerMapping: Record<string, string>) {
        this.headerMapping = headerMapping;
    }

    getFieldLength(): number {
        return this.fieldLength;
    }

    setFieldLength(fieldLength: number): void {
        this.fieldLength = fieldLength;
    }

    private normalize(value: string): string {
        return Utils.toLowerCaseNonAccentVietnamese(value || "").trim();
    }

    /**
     * Ánh xạ header Excel sang field của object domain
     */
    mapHeader(headerExcel: string): string | null {
        if (!headerExcel) return null;

        const normalized = this.normalize(headerExcel);

        for (const [pattern, field] of Object.entries(this.headerMapping)) {
            if (normalized.includes(pattern)) {
                return field;
            }
        }

        return null;
    }

    /**
     * Chuyển giá trị cell về dạng phù hợp field (nếu cần override)
     */
    protected transformCellValue(header: string, cellValue: any): any {
        return cellValue;
    }

    parseCellValue2Data(header: string, cellValue: any, newItem: any): void {
        if (header) {
            newItem[header] = this.transformCellValue(header, cellValue);
        }
    }

    mapDataFromBinaryStrExcel(binaryStrExcel: string) {
        const workbook = XLSX.read(binaryStrExcel, {type: "binary"});
        const jsonData = XlsxUtil.readTableData(workbook, 0) as any[][];
        try {
            return this.mapData(jsonData);
        } catch {
            throw new Error("Không có dữ liệu hợp lệ");
        }

    }

    /**
     * Ánh xạ dữ liệu từ mảng 2 chiều sang danh sách object
     */
    mapData(jsonData: any[][]): T[] {
        this.fieldLength = 0;

        const result: T[] = [];
        let headerRowIndex = -1;
        let fieldHeaders: string[] = [];

        // Tìm dòng chứa header
        for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            const normalized = row.map(cell => this.normalize(cell));
            if (normalized.includes("stt")) {
                fieldHeaders = row.map(cell => this.mapHeader(this.normalize(cell)) || "");
                headerRowIndex = i;
                this.fieldLength = fieldHeaders.filter(h => h).length;
                break;
            }
        }

        if (headerRowIndex === -1) {
            throw new Error(l.transCommon('file_excel_invalid_format_or_not_data'));
        }

        // Xử lý các dòng data
        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.every(cell => !cell || cell.toString().trim() === "")) continue;

            const newItem: any = {};
            for (let j = 0; j < fieldHeaders.length && j < row.length; j++) {
                const header = fieldHeaders[j];
                if (!header) continue;

                this.parseCellValue2Data(header, row[j], newItem);
            }

            if (Object.keys(newItem).length > 0) {
                result.push(this.createEntity(newItem));
            }
        }

        return result;
    }

    /**
     * Tạo entity từ object data (bắt buộc override)
     */
    protected abstract createEntity(data: any): T;
}
