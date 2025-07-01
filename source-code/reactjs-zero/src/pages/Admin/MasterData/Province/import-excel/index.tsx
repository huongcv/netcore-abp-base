import React from "react";
import {GenericExcelImport} from "@ord-components/excel/import-excel/ImportExcel";
import {createExcelImportStore} from "@ord-components/excel/import-excel/useExcelImportStore";
import {IExcelImportConfig} from "@ord-components/excel/import-excel/types";
import {ProvinceImportDto} from "@api/base/index.defs";
import {ImportPageTitle} from "@ord-components/excel/import-excel/ImportPageTitle";
import {ProvinceImportService} from "@api/base/ProvinceImportService";
import {ProvinceExcelReader} from "@pages/Admin/MasterData/Province/import-excel/reader";
import {getProvinceImportColumns} from "@pages/Admin/MasterData/Province/import-excel/columns";

// Create store instance
const useExcelImportStore = createExcelImportStore<ProvinceImportDto>(ProvinceImportService);
const ProvinceImportPage = () => {
    const config: IExcelImportConfig<ProvinceImportDto> = {
        excelReader: new ProvinceExcelReader(),
        maxRows: 2000,
        getColumns: getProvinceImportColumns,
        clearDataSource: () => {
            // Clear data source logic
        },
        onImportSuccess: () => {

        }
    };

    return (
        <>
            <ImportPageTitle/>
            <GenericExcelImport title={'title.province'}
                                config={config}
                                useStore={useExcelImportStore}
            />
        </>

    )
        ;
};
export default ProvinceImportPage;