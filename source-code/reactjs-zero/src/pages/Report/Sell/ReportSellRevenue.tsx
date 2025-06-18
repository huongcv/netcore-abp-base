import React, {useEffect} from "react";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Row, Space, Table, TableColumnsType} from "antd";
import {SellReportRevenueOutputDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import DateUtil from "@ord-core/utils/date.util";
import {ArrowLeftOutlined, ExportOutlined,} from "@ant-design/icons";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {observer} from "mobx-react-lite";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useNavigate} from "react-router-dom";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import "./Sell.scss";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {PriceCell} from "@ord-components/table/cells/priceCell";

function ReportSellRevenue() {
    const {reportSellRevenue: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
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

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "invoiceDate",
                dataIndex: "invoiceDate",
                width: 150,
                fixed: "left",
                className: "overide-ant-col-fixed-left",
                align: "center",
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return (
                        <>
                            {DateUtil.toFormat(record.invoiceDate, "DD/MM/YYYY")}
                        </>
                    );
                },
                sorter: false,
            },
            {
                dataIndex: "totalAmountBeforeDiscount",
                title: "totalAmountBeforeDiscount",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return <PriceCell value={record.totalAmountBeforeDiscount}/>
                },
            },
            {
                dataIndex: "discountAmount",
                title: "discountAmount",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return <PriceCell value={record.discountAmount}/>
                },
            },
            {
                dataIndex: "discountAmountAllocation",
                title: "discountAmountAllocation",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return <PriceCell value={record.discountAmountAllocation}/>
                },
            },
            {
                dataIndex: "taxAmount",
                title: "taxAmount",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return <PriceCell value={record.taxAmount}/>
                },
            },
            {
                title: "totalAmount",
                width: 180,
                align: "right",
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return <PriceCell value={record.totalAmount}/>
                },
            },
            {
                title: "returnTotalAmount",
                width: 180,
                align: "right",
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return <PriceCell value={record.returnTotalAmount}/>
                },
            },
            {
                dataIndex: "revenueAmount",
                title: "revenueAmount",
                align: "right",
                width: 180,
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return <PriceCell value={record.revenueAmount}/>
                },
            },
            {
                title: "paymentAmount",
                width: 200,
                align: "right",
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return <PriceCell value={record.paymentAmount}/>
                },
            },
            {
                dataIndex: "debtAmount",
                title: "debtAmount",
                align: "right",
                width: 120,
                render: (data: string, record: SellReportRevenueOutputDto) => {
                    return <PriceCell value={record.debtAmount}/>
                },
            }
        ],
        {
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
            title: t("actionBtn.ReasonType"),
            content: (
                <>
                    <Button onClick={() => navigate(-1)}>
                        <Space>
                            <ArrowLeftOutlined/>
                        </Space>
                        {t("actionBtn.back")}
                    </Button>
                </>
            ),
        },
        {
            content: (
                <Button
                    type="primary"
                    onClick={() => {
                        stored.exportExcelPagedResult().then((res) => {
                        });
                    }}
                >
                    <Space>
                        <ExportOutlined/>
                    </Space>
                    {t("actionBtn.exportExcel")}
                </Button>
            ),
        },
    ];
    const {summaryData} = stored;
    return (
        <>
            <PageTopTitleAndAction
                usingCustom={true}
                mainTitle={t("titlePage")}
                items={[t("titlePageLvl1"), t("titlePageLvl2")]}
            >
                <TopAction topActions={topAction}/>
            </PageTopTitleAndAction>
            <Form
                className={"ord-container-box"}
                form={searchFormRef}
                layout={"vertical"}
                onFinish={debounce((d) => {
                    stored.searchData(d);
                    stored.loadSummary();
                }, 250)}
            >
                <Row gutter={16}>
                    <Col lg={8} md={12}>
                        <FloatLabel label={t("rangeDate")}>
                            <Form.Item>
                                <Space.Compact style={{width: "100%"}}>
                                    <Form.Item name="rangeDate" className="flex-auto">
                                        <OrdDateRangeInput></OrdDateRangeInput>
                                    </Form.Item>
                                    <Button type='default' onClick={onResetClick} className={'btn-other'}
                                            icon={<IconlyLight width={22} type={'Reload.svg'}/>}></Button>
                                </Space.Compact>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Button type='primary' htmlType={'submit'} className={'search-btn ml-2'}
                            icon={<IconlyLight width={22} type={'Search.svg'}/>}></Button>
                </Row>
            </Form>
            <div className="ord-container-box">
                <AntTableWithDataPaged
                    searchForm={searchFormRef}
                    getPageResult={(d) => {
                        return stored.apiService().getPaged(
                            {
                                body: {
                                    ...d.body,
                                },
                            },
                            {}
                        );
                    }}
                    summary={(pageData) => {
                        return (
                            <Table.Summary fixed="top">
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={2} align="left">
                                        <strong className="">{t("total")}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={6}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.totalAmountBeforeDiscount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={8}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.discountAmount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={8}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.discountAmountAllocation}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={7}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.taxAmount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={9}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.totalAmount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={9}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.returnTotalAmount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={10}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.revenueAmount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={11}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.paymentAmount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={12}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.debtAmount}/>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                    columns={columns}
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                />
            </div>


        </>
    );
}

export default observer(ReportSellRevenue);
