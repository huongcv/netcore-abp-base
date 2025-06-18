import {ReadDataExcelBase} from "@ord-components/excel/readDataExcelBase";
import {ImportPartnerInputDto, PARTNER_TYPE} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";

export class ReadDataExcelImportPartner extends ReadDataExcelBase<ImportPartnerInputDto> {
    private type: PARTNER_TYPE;
    private fieldLength: number;

    constructor(type: PARTNER_TYPE) {
        super();
        this.type = type;
    }

    getFiledLength() {
        return this.fieldLength;
    }

    setFieldLength(fieldLength: number) {
        this.fieldLength = fieldLength;
    }

    mapHeader(headerExcel: string) {
        if (this.type == 1) {
            return this.mapHeaderCustomer(headerExcel);
        } else if (this.type == 6) {
            return this.mapHeaderDoctor(headerExcel);
        } else {
            return this.mapHeaderSupplier(headerExcel);
        }
    }
    mapHeaderDoctor(headerExcel: string): string | null {
        if (headerExcel.indexOf('stt') > -1) {
            this.fieldLength++;
            return 'rowId';
        }
        if (headerExcel.indexOf('ma bac si') > -1) {
            this.fieldLength++;
            return 'code';

        }
        if (headerExcel.indexOf('ten bac si') > -1) {
            this.fieldLength++;
            return 'name';

        }
        if (headerExcel.indexOf('nhom bac si') > -1) {
            this.fieldLength++;
            return 'groupName';
        }
        if (headerExcel.indexOf('so dien thoai') > -1) {
            this.fieldLength++;
            return 'phone';
        }
        if (headerExcel.indexOf('dia chi') > -1) {
            this.fieldLength++;
            return 'address';
        }
        if (headerExcel.indexOf('noi cong tac') > -1) {
            this.fieldLength++;
            return 'companyName';
        }
        if (headerExcel.indexOf('ghi chu') > -1) {
            this.fieldLength++;
            return 'notes';
        }
        if (!!headerExcel) {
            throw new Error("notDataOrIncorrectFile");
        }

        return null;
    }
    mapHeaderSupplier(headerExcel: string): string | null {
        if (headerExcel.indexOf('stt') > -1) {
            this.fieldLength++;
            return 'rowId';
        }
        if (headerExcel.indexOf('ma nha cung cap') > -1) {
            this.fieldLength++;
            return 'code';

        }
        if (headerExcel.indexOf('ten nha cung cap') > -1) {
            this.fieldLength++;
            return 'name';

        }
        if (headerExcel.indexOf('nhom nha cung cap') > -1) {
            this.fieldLength++;
            return 'groupName';
        }
        if (headerExcel.indexOf('so dien thoai') > -1) {
            this.fieldLength++;
            return 'phone';
        }
        if (headerExcel.indexOf('dia chi') > -1) {
            this.fieldLength++;
            return 'address';
        }
        if (headerExcel.indexOf('ma so thue') > -1) {
            this.fieldLength++;
            return 'taxCode';
        }
        if (headerExcel.indexOf('email') > -1) {
            this.fieldLength++;
            return 'email';

        }
        if (headerExcel.indexOf('tinh/thanh pho') > -1) {
            this.fieldLength++;
            return 'cityName';

        }
        if (headerExcel.indexOf('quan/huyen') > -1) {
            this.fieldLength++;
            return 'districtName';

        }
        if (headerExcel.indexOf('xa/phuong') > -1) {
            this.fieldLength++;
            return 'wardName';
        }
        if (headerExcel.indexOf('ghi chu') > -1) {
            this.fieldLength++;
            return 'notes';
        }
        if (headerExcel.indexOf('cong no') > -1) {
            this.fieldLength++;
            return 'debtAmountStr';
        }
        if (!!headerExcel) {
            throw new Error("notDataOrIncorrectFile");
        }

        return null;
    }

    mapHeaderCustomer(headerExcel: string): string | null {
        if (headerExcel.indexOf('stt') > -1) {
            this.fieldLength++;
            return 'rowId';
        }
        if (headerExcel.indexOf('ma khach hang') > -1) {
            this.fieldLength++;
            return 'code';

        }
        if (headerExcel.indexOf('ten khach hang') > -1) {
            this.fieldLength++;
            return 'name';

        }
        if (headerExcel.indexOf('phan loai') > -1) {
            this.fieldLength++;
            return 'categoryStr';

        }
        if (headerExcel.indexOf('nhom khach hang') > -1) {
            this.fieldLength++;
            return 'groupName';

        }
        if (headerExcel.indexOf('so dien thoai') > -1) {
            this.fieldLength++;
            return 'phone';

        }
        if (headerExcel.indexOf('ngay sinh') > -1) {
            this.fieldLength++;
            return 'dateOfBirthStr';

        }
        if (headerExcel.indexOf('dia chi') > -1) {
            this.fieldLength++;
            return 'address';

        }
        if (headerExcel.indexOf('ma so thue') > -1) {
            this.fieldLength++;
            return 'taxCode';

        }
        if (headerExcel.indexOf('email') > -1) {
            this.fieldLength++;
            return 'email';

        }
        if (headerExcel.indexOf('gioi tinh') > -1) {
            this.fieldLength++;
            return 'genderStr';
        }

        if (headerExcel.indexOf('ghi chu') > -1) {
            this.fieldLength++;
            return 'notes';
        }

        if (headerExcel.indexOf('cong no') > -1) {
            this.fieldLength++;
            return 'debtAmountStr';
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
