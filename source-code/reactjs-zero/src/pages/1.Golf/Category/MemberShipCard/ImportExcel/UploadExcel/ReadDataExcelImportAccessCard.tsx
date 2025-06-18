import { ReadDataExcelBase } from "@ord-components/excel/readDataExcelBase";
import { ImportExcelAccessCardInputDto } from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";

export class ReadDataExcelImportAccessCard extends ReadDataExcelBase<ImportExcelAccessCardInputDto> {
    private fieldLength: number;

    getFiledLength() {
        return this.fieldLength;
    }

    setFieldLength(fieldLength: number) {
        this.fieldLength = fieldLength;
    }

    mapHeader(headerExcel: string) {
        return this.mapHeaderAccessCard(headerExcel);
    }

    mapHeaderAccessCard(headerExcel: string): string | null {
        if (headerExcel.indexOf('stt') > -1) {
            this.fieldLength++;
            return 'rowId';
        }
        if (headerExcel.indexOf('uid chip vat ly') > -1) {
            this.fieldLength++;
            return 'uid';

        }
        if (headerExcel.indexOf('ma in tren mat the') > -1) {
            this.fieldLength++;
            return 'printedNumber';

        }
        if (headerExcel.indexOf('mau the') > -1) {
            this.fieldLength++;
            return 'strAccessCardColor';
        }
        if (headerExcel.indexOf('mo ta') > -1) {
            this.fieldLength++;
            return 'description';
        }

        if (!!headerExcel) {
            throw new Error("notDataOrIncorrectFile");
        }

        return null;
    }

    parseCellValue2Data(header: string, cellValue: any, newItem: any): void {
        if (header == 'dateOfBirth') {
            if (!!cellValue) {
                newItem.dateOfBirth = DateUtil.convertExcelValue(cellValue);
            }
            return;
        }
        if (header == 'debtAmountStr') {
            if (!!cellValue) {
                newItem.debtAmountStr = cellValue.toString()
            }
            return;
        }
        if (header) {
            // @ts-ignore
            newItem[header] = cellValue;
        }
    }

    validFile(jsonData: any[][]) {
        let lstHeader: string[] = [];
        for (const row of jsonData) {
            const fts = row.map(it => Utils.toLowerCaseNonAccentVietnamese(it));
            if (fts.some(it => it === "stt")) {
                lstHeader = fts.filter(_ => _);
                break;
            }
        }

        if (lstHeader.length === 0) {
            throw new Error("notDataOrIncorrectFile");
        }

        const isValidHeader = lstHeader.every(it => this.mapHeader(it));
        if (!isValidHeader) {
            throw new Error("notDataOrIncorrectFile");
        }
    }


}
