import { ArrowLeftOutlined } from "@ant-design/icons";
import { CustomerGroupService } from "@api/CustomerGroupService";
import {
    ImportExcelPartnerGroupInputDto,
    TplFileInfo
} from "@api/index.defs";
import {
    OrdBreadcrumb
} from "@ord-components/common/page/PageBreadcrumb";
import { ImportExcelButton } from "@ord-components/excel/ImportExcelButton";
import UiUtils from "@ord-core/utils/ui.utils";
import { TableDataPartnerGroup } from "@pages/Partner/Shared/PartnerGroup/TableDataPartnerGroup";
import useReadExcelToImportPartnerGroup from "@pages/Partner/UploadExcel/useReadExcelToImportPartnerGroup";
import { Badge, Button, Card, Col, Row, Space, Tabs } from "antd";
import FileSaver from "file-saver";
import React, { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ActionExcelBtnProductGroup: React.FC = () => {
    const { t } = useTranslation('customer-group');
    const navigate = useNavigate();

    const [binaryStrExcel, setBinaryStrExcel] = useState("");
    const [message, setMessage] = useState("");
    const [fileInfo, setFileInfo] = useState<TplFileInfo | undefined>();
    const [tabBarExtra, setTabBarExtra] = useState<ReactNode | null>(null);
    const [isShowTabBarExtra, setIsShowTabBarExtra] = useState<boolean>(false);
    const [validList, setValidList] = useState<ImportExcelPartnerGroupInputDto[]>([]);
    const [invalidList, setInvalidList] = useState<ImportExcelPartnerGroupInputDto[]>([]);
    const { t: tExcel } = useTranslation('excel');
    const dataExcel = useReadExcelToImportPartnerGroup(binaryStrExcel, 1);

    const handleDownloadTemplate = async () => {
        try {
            const response = await CustomerGroupService.exportTemplate({ responseType: "blob" });
            if (!response) throw new Error(t("excelAlert.errorDownload"));
            FileSaver.saveAs(response, t("fileExcel.FileImportName"));
        } catch {
            setMessage(t("excelAlert.errorDownload"));
        }
    };

    const handleValidateData = async (items: any[]) => {
        try {
            UiUtils.setBusy();
            const { successImportList, errorImportList, errorFile } = await CustomerGroupService.validateImport({
                body: items,
            });
            setValidList(successImportList ?? []);
            setInvalidList(errorImportList ?? []);
            setFileInfo(errorFile);
            setMessage("");
        } catch {
            setMessage(t("uploadError"));
        } finally {
            UiUtils.clearBusy();
        }
    };

    useEffect(() => {
        setValidList([]);
        setInvalidList([]);
        if (dataExcel.data.length) handleValidateData(dataExcel.data);
        else if (!!binaryStrExcel && !dataExcel.data?.length) {
            setMessage(tExcel(dataExcel?.error ?? 'notDataOrIncorrectFile'));
        }
    }, [dataExcel.data]);

    const handleSetTabExtra = (content: ReactNode | null) => {
        setTabBarExtra(content);
        setIsShowTabBarExtra(!!content);
    };

    const handleChangeTab = (activeKey: string) => {
        setIsShowTabBarExtra(activeKey !== "2");
    };

    return (
        <>
            <div className="flex flex-wrap items-center justify-between mb-3">
                <OrdBreadcrumb mainTitle={`menu.actionExcelBtnProductGroup.1`} itemsRoute={[{ title: "menu.customer", route: "/partner/customer" }]} />
                <Space wrap>
                    <Button onClick={() => navigate(-1)}>
                        <ArrowLeftOutlined />
                        {t("returnList", { ns: "common" })}
                    </Button>
                </Space>
            </div>

            <Card title={`${t("TextTitleImportBy")} ${t(`partnerGroupLowerCase.1`)}`}>
                <Row>
                    <Col span={24}>
                        <ImportExcelButton
                            onChangeBinaryStr={setBinaryStrExcel}
                            messageError={message}
                            onClickDownloadTemplate={handleDownloadTemplate}
                        />
                    </Col>

                    <Col span={24}>
                        {binaryStrExcel && !message && dataExcel.data.length > 0 && (
                            <Tabs
                                defaultActiveKey="1"
                                tabBarExtraContent={isShowTabBarExtra ? tabBarExtra : null}
                                onChange={handleChangeTab}
                                items={[
                                    {
                                        key: "1",
                                        label: (
                                            <>
                                                {t("listValid", { ns: "excel" })}{" "}
                                                <Badge color="green" className="ms-2" showZero count={validList.length} overflowCount={999999999} />
                                            </>
                                        ),
                                        children: (
                                            <TableDataPartnerGroup
                                                datasource={validList}
                                                isValid
                                                setTabBarExtra={handleSetTabExtra}
                                                type={1}
                                            />
                                        ),
                                    },
                                    {
                                        key: "2",
                                        label: (
                                            <>
                                                {t("listInvalid", { ns: "excel" })}{" "}
                                                <Badge color="red" className="ms-2" showZero count={invalidList.length} overflowCount={999999999} />
                                            </>
                                        ),
                                        children: (
                                            <TableDataPartnerGroup
                                                datasource={invalidList}
                                                setMessage={setMessage}
                                                fileInfo={fileInfo}
                                                isValid={false}
                                                type={1}
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

export default ActionExcelBtnProductGroup;
