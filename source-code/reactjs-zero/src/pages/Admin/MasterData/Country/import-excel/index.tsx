import React from "react";
import {ProductGroupImportDto} from "@api/index.defs";
import {GenericExcelImport} from "@ord-components/import-excel/ImportExcel";
import {createExcelImportStore} from "@ord-components/import-excel/useExcelImportStore";
import {CountryImportService} from "@api/base/CountryImportService";
import {CountryExcelReader} from "@pages/Admin/MasterData/Country/import-excel/reader";
import {getProductGroupColumns} from "@pages/Admin/MasterData/Country/import-excel/columns";
import {IExcelImportConfig} from "@ord-components/import-excel/types";
import {CountryImportDto} from "@api/base/index.defs";
import {ImportPageTitle} from "@ord-components/import-excel/ImportPageTitle";

// Create store instance
const useProductGroupImportStore = createExcelImportStore<ProductGroupImportDto>(CountryImportService);
const CountryImportPage = () => {
    const config: IExcelImportConfig<CountryImportDto> = {
        excelReader: new CountryExcelReader(),
        maxRows: 2000,
        getColumns: getProductGroupColumns,
        clearDataSource: () => {
            // Clear data source logic
        },
        onImportSuccess: () => {

        }
    };

    return (
        <>
            <ImportPageTitle/>
            <GenericExcelImport title={'title.country'}
                                config={config}
                                useStore={useProductGroupImportStore}
            />
        </>

    )
        ;
};
export default CountryImportPage;