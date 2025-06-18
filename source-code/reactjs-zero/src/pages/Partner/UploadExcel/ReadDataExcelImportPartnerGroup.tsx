import { ReadDataExcelBase } from "@ord-components/excel/readDataExcelBase";
import { ImportExcelPartnerGroupInputDto, PARTNER_TYPE } from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";

export class ReadDataExcelImportPartnerGroup extends ReadDataExcelBase<ImportExcelPartnerGroupInputDto> {
  private type: number;
  private fieldLength: number;

  constructor(type: number) {
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
    if (headerExcel.indexOf("stt") > -1) {
      this.fieldLength++;
      return "id";
    }
    if (headerExcel.indexOf("ma nhom") > -1) {
      this.fieldLength++;
      return "groupCode";
    }
    if (headerExcel.indexOf("ten nhom") > -1) {
      this.fieldLength++;
      return "groupName";
    }
    if (this.type == (1 as PARTNER_TYPE)) {
      if (headerExcel.indexOf("nhom") > -1) {
        this.fieldLength++;
        return "strType";
      }
    }
    if (headerExcel.indexOf("ghi chu") > -1) {
      this.fieldLength++;
      return "notes";
    }

    if (!!headerExcel) {
      throw new Error("notDataOrIncorrectFile");
    }
    return null;
  }

  parseCellValue2Data(header: string, cellValue: any, newItem: any): void {
    if (header == "dateOfBirth") {
      if (!!cellValue) {
        newItem.dateOfBirth = DateUtil.convertExcelValue(cellValue);
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
      const fts = row.map((it) => Utils.toLowerCaseNonAccentVietnamese(it));
      if (fts.some((it) => it === "stt")) {
        lstHeader = fts.filter((_) => _);
        break;
      }
    }

    if (lstHeader.length === 0) {
      throw new Error("notDataOrIncorrectFile");
    }

    const isValidHeader = lstHeader.every((it) => this.mapHeader(it));
    if (!isValidHeader) {
      throw new Error("notDataOrIncorrectFile");
    }
  }
}
