import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import Utils from "@ord-core/utils/utils";
import {IItemRoute} from "@ord-components/common/page/PageBreadcrumb";
import {ProductGroupImportDto} from "@api/index.defs";
import {createCountryImportConfig} from "@pages/Admin/MasterData/Country/import-excel/config";
import {GenericExcelImport} from "@ord-components/import-excel/ImportExcel";
import {createExcelImportStore} from "@ord-components/import-excel/useExcelImportStore";
import {ProductGroupService} from "@api/ProductGroupService";
import {CountryImportService} from "@api/base/CountryImportService";
import {CountryExcelReader} from "@pages/Admin/MasterData/Country/import-excel/reader";
import {getProductGroupColumns} from "@pages/Admin/MasterData/Country/import-excel/columns";
import {IExcelImportConfig} from "@ord-components/import-excel/types";
import {CountryImportDto} from "@api/base/index.defs";

// Create store instance
const useProductGroupImportStore = createExcelImportStore<ProductGroupImportDto>(CountryImportService);
const CountryImportPage = () => {
    const {t} = useTranslation("product-group-list");
    const pathNameRef = useRef(Utils.getPathUpTo('product'));

    const itemsRoute: IItemRoute[] = [
        {
            title: 'menu.product',
            route: '/product'
        }
    ];

    const config: IExcelImportConfig<CountryImportDto> = {
        exportTemplate: () => ProductGroupService.exportTemplate({responseType: "blob"}),
        validateImport: (items) => CountryImportService.validateDataImport({body: items}),
        import: (items) => CountryImportService.import({body: items}),
        excelReader: new CountryExcelReader(),
        maxRows: 2000,
        templateFileName: "ProductGroup_Import_Template.xlsx",
        getColumns: getProductGroupColumns,
        clearDataSource: () => {
            // Clear data source logic
        }
    };

    return (
        <GenericExcelImport
            config={config}
            title={'menu.importProductGroup'}
            breadcrumbItems={itemsRoute}
            returnPath={pathNameRef.current}
            useStore={useProductGroupImportStore}
        />
    );
};
export default CountryImportPage;