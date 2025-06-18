import {useEffect, useState} from "react";
import * as XLSX from "xlsx";
import XlsxUtil from "@ord-core/utils/xlsx.util";
import {ReadDataExcelImportPartner} from "./ReadDataExcelImportPartner";
import {useTranslation} from "react-i18next";
import {ImportPartnerInputDto, PARTNER_TYPE} from "@api/index.defs";
import {c} from "vite/dist/node/types.d-aGj9QkWt";

const CUS_FIELD_LENGTH: number = 12;
const SUP_FIELD_LENGTH: number = 9;
const DOC_FIELD_LENGTH: number = 8;


const useReadExcelToImportPartner = (binaryStrExcel: string, type: PARTNER_TYPE) => {
    const {t} = useTranslation("customer")
    const {t: tExcel} = useTranslation('excel');
    const [data, setData] = useState<ImportPartnerInputDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        try {
            if (!binaryStrExcel) {
                setData([]);
                return;
            }

            const workbook = XLSX.read(binaryStrExcel, {type: 'binary'});
            const jsonData = XlsxUtil.readTableData(workbook, 0) as any[][];
            const headerIdx = jsonData.findIndex(row => row.includes("STT"));
            const rowStart = headerIdx !== -1 ? headerIdx + 1 : 0;
            if (jsonData.length - rowStart > 2000) {
                setData([]);
                throw new Error(tExcel('error.maxRowExcelPlaceholder', {
                    maxRows: 2000,
                }));
            }

            const readData = new ReadDataExcelImportPartner(type);
            readData.setFieldLength(0);
            const items: ImportPartnerInputDto[] = readData.mapData(jsonData as any);
            const FIELD_LENGTH = type == 1 ? CUS_FIELD_LENGTH :
                (type == 2 ? SUP_FIELD_LENGTH : DOC_FIELD_LENGTH);
            if (readData.getFiledLength() != FIELD_LENGTH) {
                setData([]);
                throw new Error('notDataOrIncorrectFile');
            }
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
    return {data, error}
}
export default useReadExcelToImportPartner;
