import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import Utils from "@ord-core/utils/utils";
import {IItemRoute} from "@ord-components/common/page/PageBreadcrumb";
import {ProductGroupImportDto} from "@api/index.defs";
import {createCountryImportConfig} from "@pages/Admin/MasterData/Country/import-excel/config";
import {GenericExcelImport} from "@ord-components/import-excel/ImportExcel";
import {createExcelImportStore} from "@ord-components/import-excel/useExcelImportStore";

// Create store instance
const useProductGroupImportStore = createExcelImportStore<ProductGroupImportDto>();
const CountryImportPage = () => {
    const {t} = useTranslation("product-group-list");
    const pathNameRef = useRef(Utils.getPathUpTo('product'));

    const itemsRoute: IItemRoute[] = [
        {
            title: 'menu.product',
            route: '/product'
        }
    ];

    const config = createCountryImportConfig();

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