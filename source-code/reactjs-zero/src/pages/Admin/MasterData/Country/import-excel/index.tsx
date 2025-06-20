import React, {useRef} from "react";
import Utils from "@ord-core/utils/utils";
import {IItemRoute, OrdBreadcrumb, PageBreadcrumbFormPathName} from "@ord-components/common/page/PageBreadcrumb";
import {ProductGroupImportDto} from "@api/index.defs";
import {GenericExcelImport} from "@ord-components/import-excel/ImportExcel";
import {createExcelImportStore} from "@ord-components/import-excel/useExcelImportStore";
import {CountryImportService} from "@api/base/CountryImportService";
import {CountryExcelReader} from "@pages/Admin/MasterData/Country/import-excel/reader";
import {getProductGroupColumns} from "@pages/Admin/MasterData/Country/import-excel/columns";
import {IExcelImportConfig} from "@ord-components/import-excel/types";
import {CountryImportDto} from "@api/base/index.defs";
import {Button, Space} from "antd";
import {Link} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {ImportPageTitle} from "@ord-components/import-excel/ImportPageTitle";

// Create store instance
const useProductGroupImportStore = createExcelImportStore<ProductGroupImportDto>(CountryImportService);
const CountryImportPage = () => {
    const {t} = useTranslation();
    const pathNameRef = useRef(Utils.getPathUpTo('product'));
    const itemsRoute: IItemRoute[] = [
        {
            title: 'menu.product',
            route: '/product'
        }
    ];

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
            {/*<div className="flex flex-wrap items-center justify-between mb-3">*/}
            {/*    <PageBreadcrumbFormPathName*/}
            {/*        mainTitle={t('')}*/}
            {/*        pathname={location.pathname.replace('/import', '')}></PageBreadcrumbFormPathName>*/}
            {/*    {pathNameRef.current && (*/}
            {/*        <div className="flex items-center">*/}
            {/*            <Space wrap>*/}
            {/*                <Link to={pathNameRef.current}>*/}
            {/*                    <Button>*/}
            {/*                        <ArrowLeftOutlined/>*/}
            {/*                        {t('returnList', {ns: 'common'})}*/}
            {/*                    </Button>*/}
            {/*                </Link>*/}
            {/*            </Space>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}
            <GenericExcelImport title={'title.country'}
                                config={config}
                                useStore={useProductGroupImportStore}
            />
        </>

    )
        ;
};
export default CountryImportPage;