import React, {ReactNode, useEffect, useState} from "react";
import {Badge, Card, Col, Row, Tabs} from "antd";
import {useTranslation} from "react-i18next";
import {IItemRoute} from "@ord-components/common/page/PageBreadcrumb";
import {ImportExcelButton} from "@ord-components/excel/ImportExcelButton";
import {ExcelImportState, IExcelImportConfig} from "@ord-components/import-excel/types";
import {GenericExcelDataTable} from "@ord-components/import-excel/GenericExcelDataTable";

interface IGenericExcelImportProps<T> {
    config: IExcelImportConfig<T>;
    useStore: () => ExcelImportState<T>;
    title: string
}

export const GenericExcelImport = <T extends Record<string, any>>(
    props: IGenericExcelImportProps<T>
) => {
    const {config, useStore, title} = props;
    const {t} = useTranslation(['import']);
    const [tabBarExtra, setTabBarExtra] = useState<ReactNode | null>();
    const [isShowTabBarExtra, setIsShowTabBarExtra] = useState<boolean>(false);

    const store = useStore();

    const handleSetTabExtra = (content: ReactNode | null) => {
        setTabBarExtra(content);
        setIsShowTabBarExtra(!!content);
    };

    const handleChangeTab = (activeKey: string) => {
        setIsShowTabBarExtra(activeKey !== "2");
    };

    // Set current config to store
    useEffect(() => {
        (store as any).currentConfig = config;
    }, [config, store]);

    return (
        <>

            <Card title={t(title)}>
                <Row>
                    <Col span={24}>
                        <ImportExcelButton
                            onChangeBinaryStr={store.setBinaryStrExcel}
                            messageError={store.message}
                            onClickDownloadTemplate={() => store.downloadTemplate()}
                        />
                    </Col>

                    <Col span={24}>
                        {store.binaryStrExcel && !store.message && (store.validList.length > 0 || store.invalidList.length > 0) && (
                            <Tabs
                                defaultActiveKey="1"
                                tabBarExtraContent={isShowTabBarExtra ? tabBarExtra : null}
                                onChange={handleChangeTab}
                                items={[
                                    {
                                        key: "1",
                                        label: (
                                            <>
                                                {t("listValid", {ns: "excel"})}{" "}
                                                <Badge color="green" className="ms-2" showZero
                                                       count={store.validList.length} overflowCount={999999999}/>
                                            </>
                                        ),
                                        children: (
                                            <GenericExcelDataTable
                                                datasource={store.validList}
                                                isValid={true}
                                                columns={config.getColumns(true)}
                                                setTabBarExtra={handleSetTabExtra}
                                                onImport={() => store.importData(config)}
                                                isImporting={store.isImporting}
                                            />
                                        ),
                                    },
                                    {
                                        key: "2",
                                        label: (
                                            <>
                                                {t("listInvalid", {ns: "excel"})}{" "}
                                                <Badge color="red" className="ms-2" showZero
                                                       count={store.invalidList.length} overflowCount={999999999}/>
                                            </>
                                        ),
                                        children: (
                                            <GenericExcelDataTable
                                                datasource={store.invalidList}
                                                isValid={false}
                                                columns={config.getColumns(false)}
                                                setMessage={store.setMessage}
                                                fileInfo={store.fileInfo}
                                            />
                                        ),
                                    },
                                ]}
                            />
                        )}
                    </Col>
                </Row>
            </Card>
        </>
    );
};