import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { observer } from "mobx-react-lite";
import { Button, Checkbox, Col, Collapse, Form, Modal, Row, Space, Table, TableColumnsType } from "antd";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";
import { useEffect, useState } from "react";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, CheckOutlined, ExportOutlined } from "@ant-design/icons";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { debounce, isNumber } from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { MoveReasonTypeDto, TaxLiabilityBookDetailDto, TaxLiabilityGroupTypeDto } from "@api/index.defs";
import { TaxLiabilityBookService } from "@api/TaxLiabilityBookService";
import { ShopSettingService } from "@api/ShopSettingService";

const { Panel } = Collapse;
const SETTING_TYPE_NAME = "Shop:Report:TaxLiabilityBook:ReasonTypeFilter";
const TaxLiabilityBookReport = () => {
    const { taxLiabilityBook: stored } = useStore();
    const { t } = useTranslation(stored.getNamespaceLocale());
    const navigate = useNavigate();
    const formatterNumber = Utils.formatterNumber;
    const [searchFormRef] = Form.useForm();

    const columns: TableColumnsType<TaxLiabilityBookDetailDto> = [
        {
            title: "Chứng từ",
            children: [
                {
                    title: "Số hiệu",
                    dataIndex: "moveCode",
                    key: "moveCode",
                    align: 'center',
                    width: 100,
                    render: (val) => (val === "OPENING" || val === "TOTAL" || val === "ENDING") ? "" : val
                },
                {
                    title: "Ngày, tháng",
                    dataIndex: "moveDate",
                    key: "moveDate",
                    width: 100,
                    render: (val) => val ? DateUtil.toFormat(val, 'DD/MM/YYYY') : ''
                },
            ],
        },
        {
            title: "Diễn giải",
            dataIndex: "descriptions",
            key: "descriptions",
            width: 300,
            render: (val, record) => {
                if (record.moveCode === "OPENING") return <b>Số dư đầu kỳ</b>;
                if (record.moveCode === "TOTAL") return <b>Cộng số phát sinh trong kỳ</b>;
                if (record.moveCode === "ENDING") return <b>Số dư cuối kỳ</b>;
                return val;
            },
        },
        {
            title: "Số thuế phải nộp",
            dataIndex: "taxMustPay",
            key: "taxMustPay",
            width: 150,
            align: "right",
            render: (val, record) => isNumber(val) ? <b>{formatterNumber(val)}</b> : "",
        },
        {
            title: "Số thuế đã nộp",
            dataIndex: "taxPaid",
            key: "taxPaid",
            width: 150,
            align: "right",
            render: (val, record) => {
                if (record.moveCode === "ENDING" || record.moveCode === "OPENING") return "";
                return isNumber(val) ? <b>{formatterNumber(val)}</b> : "";
            },
        },
        {
            title: "Ghi chú",
            key: "notes",
            dataIndex: "note",
            width: 200,
        },
    ];

    useEffect(() => {
        if (stored) {
            stored.setSearchFormRef(searchFormRef);
            searchFormRef.setFields([
                {
                    name: "rangeDate",
                    value: DateUtil.getDateRange("thang_nay"),
                },
            ]);
            stored.searchData(searchFormRef.getFieldsValue())
        }
    }, [Form.useWatch('reasonTypeIds', searchFormRef)]);


    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange('thang_nay')
            },
        ])
        stored.searchData(searchFormRef.getFieldsValue());
    }

    const topAction: IActionBtn[] = [
        {
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined />
                    </Space>
                    {t('Quay lại')}
                </Button>
            </>
        },
        {
            content: <Button type='primary' onClick={() => {
                stored.exportExcelPagedResult({
                    ...searchFormRef.getFieldsValue()
                })
            }}>
                <Space>
                    <ExportOutlined />
                </Space>
                {t('actionBtn.exportExcel')}
            </Button>
        },
    ]

    return (
        <>
            <PageTopTitleAndAction usingCustom={true} mainTitle={t('S4-HKD: Sổ theo dõi tình hình thực hiện nghĩa vụ thuế với NSNN')}
                items={[t('Báo cáo Hộ kinh doanh')]}>
                <TopAction topActions={topAction} />
            </PageTopTitleAndAction>
            <Form className={'ord-container-box'} form={searchFormRef} layout="vertical"
                onFinish={debounce((d) => {
                    stored.searchData(d);
                }, 250)}>
                <Row gutter={16}>
                    <Col lg={12} md={12}>
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
                <Form.Item hidden name={"reasonTypeIds"} />
            </Form>
            <div className="ord-container-box">
                <AntTableWithDataPaged
                    columns={columns}
                    searchForm={searchFormRef}
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                    getPageResult={(d) =>
                        stored.apiService().getPaged({
                            body: {
                                ...d.body,
                            },
                        })
                    }
                    onChangePageResult={(pagedResult) => {
                        const summary = pagedResult?.summaryData || stored.summaryData;
                        if (!pagedResult?.items || !summary) return;

                        stored.summaryData = summary;

                        pagedResult.items = [
                            {
                                moveCode: "OPENING",
                                taxMustPay: summary.openingBalance || 0,
                                taxPaid: 0,
                            },
                            ...pagedResult.items,
                            {
                                moveCode: "TOTAL",
                                taxMustPay: summary.taxMustPay || 0,
                                taxPaid: summary.taxPaid || 0,
                            },
                            {
                                moveCode: "ENDING",
                                taxMustPay: summary.closingBalance || 0,
                                taxPaid: 0,
                            },
                        ];
                    }}
                />
            </div>
        </>
    );
};

export default observer(TaxLiabilityBookReport);
