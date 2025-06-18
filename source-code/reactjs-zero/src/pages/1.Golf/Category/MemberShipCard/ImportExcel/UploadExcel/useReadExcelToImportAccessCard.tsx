import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import XlsxUtil from "@ord-core/utils/xlsx.util";
import { useTranslation } from "react-i18next";
import { ImportExcelAccessCardInputDto } from "@api/index.defs";
import { ReadDataExcelImportAccessCard } from "./ReadDataExcelImportAccessCard";

const useReadExcelToImportAccessCard = (binaryStrExcel: string) => {
    const { t: tExcel } = useTranslation('excel');
    const [data, setData] = useState<ImportExcelAccessCardInputDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        try {
            if (!binaryStrExcel) {
                setData([]);
                return;
            }

            const workbook = XLSX.read(binaryStrExcel, { type: 'binary' });
            const jsonData = XlsxUtil.readTableData(workbook, 0) as any[][];
            const headerIdx = jsonData.findIndex(row => row.includes("STT"));
            const rowStart = headerIdx !== -1 ? headerIdx + 1 : 0;
            if (jsonData.length - rowStart > 2000) {
                setData([]);
                throw new Error(tExcel('error.maxRowExcelPlaceholder', {
                    maxRows: 2000,
                }));
            }
            const readData = new ReadDataExcelImportAccessCard();
            readData.setFieldLength(0);
            const items: any[] = readData.mapData(jsonData as any);

            if (!items?.length) {
                setData([]);
                throw new Error('notDataOrIncorrectFile');
            }

            setData(items || []);
        } catch (ex: any) {
            // @ts-ignore
            setData([]);
            setError(ex?.message);
        }
    }, [binaryStrExcel]);
    return { data, error }
}
export default useReadExcelToImportAccessCard;
