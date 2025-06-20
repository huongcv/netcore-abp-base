import {ProductGroupService} from "@api/ProductGroupService";
import {getProductGroupColumns} from "./columns";
import {IExcelImportConfig} from "@ord-components/import-excel/types";
import {CountryImportDto} from "@api/base/index.defs";
import {CountryExcelReader} from "@pages/Admin/MasterData/Country/import-excel/reader";
import {CountryImportService} from "@api/base/CountryImportService";

export const createCountryImportConfig = (): IExcelImportConfig<CountryImportDto> => {
    return {
        exportTemplate: () => ProductGroupService.exportTemplate({responseType: "blob"}),
        validateImport: (items) => CountryImportService.validateDataImport({body: items}),
        import: (items) => CountryImportService.import({body: items}),
        excelReader: new CountryExcelReader(),
        maxRows: 2000,
        fieldCount: 5,
        templateFileName: "ProductGroup_Import_Template.xlsx",
        getColumns: getProductGroupColumns,
        clearDataSource: () => {
            // Clear data source logic
        }
    };
};