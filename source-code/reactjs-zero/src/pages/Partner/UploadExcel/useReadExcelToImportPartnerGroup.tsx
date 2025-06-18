import { ImportExcelPartnerGroupInputDto } from "@api/index.defs";
import XlsxUtil from "@ord-core/utils/xlsx.util";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { ReadDataExcelImportPartnerGroup } from "./ReadDataExcelImportPartnerGroup";
import { number } from "yup";
import { KEY_TRANSLATE } from "../Shared/PartnerGroup/TableDataPartnerGroup";

const MAX_ROWS = 2000;
const FIELD_LENGTHS: Record<number, number> = {
  1: 4,
  2: 4,
  6: 4,
};


const useReadExcelToImportPartnerGroup = (binaryStrExcel: string, type: number) => {
  const { t } = useTranslation(KEY_TRANSLATE[type]);
  const { t: tExcel } = useTranslation("excel");
  const [data, setData] = useState<ImportExcelPartnerGroupInputDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!binaryStrExcel) {
      setData([]);
      return;
    }

    try {
      const workbook = XLSX.read(binaryStrExcel, { type: "binary" });
      const jsonData = XlsxUtil.readTableData(workbook, 0).map((row: any) => row.slice(0, 5)) as any[][];
      const headerIdx = jsonData.findIndex((row) => row.includes("STT"));
      const rowStart = headerIdx !== -1 ? headerIdx + 1 : 0;

      if (jsonData.length - rowStart > MAX_ROWS) {
        throw new Error(tExcel("error.maxRowExcelPlaceholder", { maxRows: MAX_ROWS }));
      }

      const readData = new ReadDataExcelImportPartnerGroup(type);
      readData.setFieldLength(0);
      const items = readData.mapData(jsonData as any);

      if (readData.getFiledLength() !== FIELD_LENGTHS[type]) {
        throw new Error("notDataOrIncorrectFile");
      }

      if (!items.length) {
        throw new Error("notDataOrIncorrectFile");
      }

      setData(items.map(({ groupCode = "", groupName = "", strType, notes = "" }) => ({
        groupCode,
        groupName,
        strType,
        notes,
      })));
    } catch (ex: any) {
      setData([]);
      setError(ex?.message || "An error occurred");
    }
  }, [binaryStrExcel, type]);

  return { data, error };
};

export default useReadExcelToImportPartnerGroup;