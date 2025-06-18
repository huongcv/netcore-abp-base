import { observer } from "mobx-react-lite";
import { Badge, Button, Card, Col, Row, Space, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImportExcelButton } from "@ord-components/excel/ImportExcelButton";
import UiUtils from "@ord-core/utils/ui.utils";
import FileSaver from "file-saver";
import { IItemRoute, OrdBreadcrumb } from "@ord-components/common/page/PageBreadcrumb";
import { ImportPartnerInputDto, TplFileInfo } from "@api/index.defs";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { SupplierService } from "@api/SupplierService";
import { useParentPath } from "@ord-core/hooks/useParentPath";
import { AccessCardService } from "@api/AccessCardService";
import { AccessCardDataTableExcel } from "./tableData";
import useReadExcelToImportAccessCard from "./UploadExcel/useReadExcelToImportAccessCard";

const itemsRoute: IItemRoute[] = [
    {
        title: 'menu.golfAccessCard',
        route: '/app/golf/golf-access-card'
    }
]

const ImportExcelSupplier = () => {
    const { t } = useTranslation('golf_access_card');
    const { t: tExcel } = useTranslation('excel');
    const [binaryStrExcel, setBinaryStrExcel] = useState('');
    const [validList, setValidList] = useState<ImportPartnerInputDto[]>([]);
    const [invalidList, setInvalidList] = useState<ImportPartnerInputDto[]>([]);
    const [message, setMessage] = useState('');
    const [fileInfo, setFileInfo] = useState<TplFileInfo | undefined>();
    const dataExcel = useReadExcelToImportAccessCard(binaryStrExcel);
    const [tabBarExtra, setTabBarExtra] = useState<ReactNode | null>();
    const [isShowTabBarExtra, setIsShowTabBarExtra] = useState<boolean>(false);

    const validateData = async (items: any[]) => {
        try {
            UiUtils.setBusy();
            const validateData = await AccessCardService.validateImport({
                body: items
            });
            UiUtils.clearBusy();
            setMessage('');
            setValidList(validateData.successImportList ?? []);
            setInvalidList(validateData.errorImportList ?? []);
            setFileInfo(validateData?.errorFile);
        } catch {
            setMessage(t('uploadError'));
        } finally {
            UiUtils.clearBusy();
        }
    }

    const handlerDownloadTemplate = async () => {
        try {
            UiUtils.setBusy();
            const [blobResult] = await Promise.all([AccessCardService.exportTemplate({
                responseType: 'blob'
            })]);
            const fileName = t('fileExcel.templateFileName');
            FileSaver.saveAs(blobResult, fileName);
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }

    useEffect(() => {
        setValidList([]);
        setInvalidList([]);
        if (dataExcel.data.length > 0) {
            validateData(dataExcel.data).then();
        } else if (!!binaryStrExcel && !dataExcel.data?.length) {
            setMessage(tExcel(dataExcel?.error ?? 'notDataOrIncorrectFile'));
        }
    }, [dataExcel.data]);

    useEffect(() => {
        setMessage(tExcel(dataExcel?.error || ''));
    }, [dataExcel.error])

    const onChangeTab = (activeKey: string) => {
        if (activeKey == "2") {
            setIsShowTabBarExtra(false);
        } else {
            setIsShowTabBarExtra(true);
        }
    }

    const handleSetTabExtra = (content: ReactNode | null) => {
        setTabBarExtra(content);
        setIsShowTabBarExtra(true);
    }

    return (<>
        <div
            className="flex flex-wrap items-center justify-between mb-3">
            <OrdBreadcrumb mainTitle={t('importExcelTitle')} itemsRoute={itemsRoute}></OrdBreadcrumb>
            <div className="flex items-center">
                <Space wrap>
                    <Link to={useParentPath()}>
                        <Button><ArrowLeftOutlined></ArrowLeftOutlined>{t('returnList', {
                            ns: 'common'
                        })}</Button>
                    </Link>
                </Space>
            </div>
        </div>
        <Card title={t('importExcelTitle')}>
            <Row>
                <Col span={24}>
                    <ImportExcelButton onChangeBinaryStr={setBinaryStrExcel} messageError={message}
                        onClickDownloadTemplate={handlerDownloadTemplate}></ImportExcelButton>
                </Col>
                <Col span={24}>
                    {
                        !!binaryStrExcel && !message &&
                        <>
                            {
                                (dataExcel.data.length > 0) &&
                                <Tabs defaultActiveKey="1"
                                    tabBarExtraContent={isShowTabBarExtra ? tabBarExtra : null}
                                    onChange={onChangeTab}
                                    items={[
                                        {
                                            key: '1',
                                            label: <>
                                                {t('listValid', { ns: 'excel' })} <Badge color={'green'}
                                                    className={'ms-2'}
                                                    showZero
                                                    overflowCount={999999999}
                                                    count={validList.length}></Badge>
                                            </>,
                                            children: <AccessCardDataTableExcel datasource={validList} isValid={true}
                                                setTabBarExtra={handleSetTabExtra} />,
                                        },
                                        {
                                            key: '2',
                                            label: <>
                                                {t('listInvalid', { ns: 'excel' })}
                                                <Badge color={'red'} className={'ms-2'}
                                                    showZero
                                                    overflowCount={999999999}
                                                    count={invalidList.length}></Badge>
                                            </>,
                                            children: <AccessCardDataTableExcel datasource={invalidList}
                                                setMessage={setMessage}
                                                fileInfo={fileInfo}
                                                isValid={false} />,
                                        }
                                    ]} />
                            }
                        </>
                    }
                </Col>
            </Row>
        </Card>
    </>);
}
export default observer(ImportExcelSupplier);
