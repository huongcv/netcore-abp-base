import { ReadDataExcelBase } from "@ord-components/excel/readDataExcelBase";
import { ProductGroupDto, ProductGroupImportDto } from "@api/index.defs";
import Utils from "@ord-core/utils/utils";

export class ReadDataExcelProductGroup extends ReadDataExcelBase<ProductGroupImportDto> {
  private fieldLength: number;

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
    if (headerExcel.indexOf("ghi chu") > -1) {
      this.fieldLength++;
      return "notes";
    }

    if (headerExcel.indexOf("ap dung toan chuoi") > -1) {
      this.fieldLength++;
      return "isProductGroupChainStr";
    }

    if (!!headerExcel) {
      throw new Error("notDataOrIncorrectFile");
    }
    return null;
  }

  parseCellValue2Data(header: string, cellValue: any, newItem: any): void {
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
