import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import XlsxUtil from "@ord-core/utils/xlsx.util";
import { GolfBookingGroupImportDto } from "@api/index.defs";
import { useTranslation } from "react-i18next";
import { ReadDataExcelBookingGroup } from "./readDataExcel";

const MAX_ROWS = 2000;
const FIELD_LENGTHS = 4
const useReadExcelToData = (binaryStrExcel: string) => {
  const [data, setData] = useState<GolfBookingGroupImportDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { t: tExcel } = useTranslation("excel");

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

      const readData = new ReadDataExcelBookingGroup();
      readData.setFieldLength(0);
      const items = readData.mapData(jsonData as any);
      if (readData.getFiledLength() !== FIELD_LENGTHS) {
        throw new Error("notDataOrIncorrectFile");
      }

      if (!items.length) {
        throw new Error("notDataOrIncorrectFile");
      }

      setData(items.map(({ groupNo = "", groupName = "", note = "" }) => ({
        groupNo,
        groupName,
        note,
      })));
    } catch (ex: any) {
      setData([]);
      setError(ex?.message || "An error occurred");
    }
  }, [binaryStrExcel]);

  return { data, error };
};

export default useReadExcelToData;
