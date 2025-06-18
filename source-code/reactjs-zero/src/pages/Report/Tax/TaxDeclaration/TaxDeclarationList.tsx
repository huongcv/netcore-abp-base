import {
    ArrowLeftOutlined,
    ExportOutlined
} from "@ant-design/icons";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import DateUtil from "@ord-core/utils/date.util";
import TableUtil from "@ord-core/utils/table.util";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import { Button, Col, Form, Row, Space, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TaxDeclarationFormModal from "./form/TaxDeclarationFormModal";
import { AppExtendCode } from "@ord-core/AppConst";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { debounce } from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import uiUtils from "@ord-core/utils/ui.utils";
import { TaxDeclrationService } from "@api/TaxDeclrationService";

function TaxDeclarationList() {
    const { taxDeclrationReportStore: stored } = useStore();
    const { t } = useTranslation(stored.getNamespaceLocale());
    const { t: tCommon } = useTranslation('common');
    const [searchFormRef] = Form.useForm();
    useEffect(() => {
        if (stored) {
            stored.setSearchFormRef(searchFormRef);
            searchFormRef.setFields([
                {
                    name: "rangeDate",
                    value: DateUtil.getDateRange("thang_nay"),
                },
            ]);
            stored.loadSummary();
        }
    }, []);
    const formatterNumber = Utils.formatterNumber;

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                dataIndex: "name",
                title: "Tên",
                align: "left",
                width: 150,
            },
        ],
        {
            actions: [
                {
                    title: "edit",
                    onClick: (d) => {
                        stored.openUpdateModal(d);
                    }
                },
                {
                    title: "remove",
                    onClick: (d: any) => {
                        const removeByHash = {
                            ...d,
                            id: d.id,
                        };
                        stored.openRemoveById(removeByHash);
                    }
                },
            ],
            viewAction: (d: any) => {
                return navigate(`${d.id}`);
            },
            ns: stored.getNamespaceLocale(),
        }
    );
    const navigate = useNavigate();

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange("thang_nay"),
            },
        ]);
        stored.searchData({});
        stored.loadSummary();
    }

    const topAction: IActionBtn[] = [
        {
            content: (
                <>
                    <Button onClick={() => navigate(-1)}>
                        <Space>
                            <ArrowLeftOutlined />
                        </Space>
                        {t("Quay lại (F10)")}
                    </Button>
                </>
            ),
        },
        {
            title: "addNew",
            onClick: () => {
                stored.createOrUpdateModal.visible = true;

            },
        },
    ];

    useEffect(() => {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange('thang_nay')
            }
        ])
        stored.searchData({});
    }, [stored.createOrUpdateModal.visible])

    useEffect(() => {
        if (!!stored.removeRecord) {
            const { removeRecord } = stored;
            uiUtils.showConfirm({
                title: tCommon('confirmDelete'),
                icon: "remove",
                content: (<Trans ns={stored.getNamespaceLocale()}
                    i18nKey="confirmRemove"
                    values={removeRecord}
                    components={{ italic: <i />, bold: <strong /> }}></Trans>),
                onOk: (d) => {
                    TaxDeclrationService.remove({ id: stored.removeRecord?.id }).then((res) => {
                        if(res.isSuccessful) {
                            uiUtils.showSuccess("Xoá bản ghi thành công"); 
                            searchFormRef.resetFields();
                            searchFormRef.setFields([
                                {
                                    name: "rangeDate",
                                    value: DateUtil.getDateRange('thang_nay')
                                }
                            ])
                        }
                        stored.searchData({});
                    });
                },
                onCancel: () => {
                    stored.closeRemoveById();
                }
            });
        }

    }, [stored.removeRecord]);


    return (
        <>
            <PageTopTitleAndAction usingCustom={true}
                items={[t('Báo cáo thuế'), t('Tờ khai thuế')]}>
                <TopAction topActions={topAction} />
            </PageTopTitleAndAction>
            <Form className={'ord-container-box'} form={searchFormRef} layout={"vertical"}
                onFinish={debounce((d) => {
                    stored.searchData(d);
                }, 250)}>
                <Row gutter={16}>
                    <Col lg={8} md={12}>
                        <FloatLabel label={t('Khoảng thời gian')}>
                            <Form.Item>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Form.Item name='rangeDate' className='flex-auto'>
                                        <OrdDateRangeInput></OrdDateRangeInput>
                                    </Form.Item>
                                    <Button type='default' onClick={onResetClick} className={'btn-other'} icon={<IconlyLight width={22} type={'Reload.svg'} />} />
                                </Space.Compact>
                            </Form.Item>
                        </FloatLabel>

                    </Col>
                    <Button type='primary' htmlType={'submit'} className={'search-btn'} icon={<IconlyLight width={22} type={'Search.svg'} />} />
                </Row>
            </Form>
            <AntTableWithDataPaged
                searchForm={searchFormRef}
                columns={columns}
                searchData={stored.searchDataState}
                getPageResult={(d) => {
                    return stored.apiService().getPaged({
                        body: {
                            ...d.body
                        }
                    }, {})
                }}
                refreshDatasource={stored.refreshDataState} />
            <TaxDeclarationFormModal />
        </>)
}

export default observer(TaxDeclarationList);
