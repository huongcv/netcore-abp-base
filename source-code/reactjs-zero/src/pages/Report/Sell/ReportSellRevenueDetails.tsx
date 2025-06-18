import React, {useEffect} from "react";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Row, Space, Table, TableColumnsType,} from "antd";
import {SellReportRevenueDetailOutputDto} from "@api/index.defs";
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
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import "./Sell.scss";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {PriceCell} from "@ord-components/table/cells/priceCell";

function ReportSellRevenueDetails() {
    const {reportSellRevenueDetails: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const [searchFormRef] = Form.useForm();
    useEffect(() => {
        if (stored) {
            searchFormRef.setFields([
                {
                    name: "rangeDate",
                    value: DateUtil.getDateRange("thang_nay"),
                },
            ]);
            stored.setSearchFormRef(searchFormRef);
            stored.loadSummary();
        }
    }, []);
    const formatterNumber = Utils.formatterNumber;

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "invoiceDate",
                dataIndex: "invoiceDate",
                width: 150,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return (
                        <>
                            {record.invoiceDate ? (
                                <strong>
                                    {DateUtil.toFormat(record.invoiceDate, "DD/MM/YYYY HH:mm")}
                                </strong>
                            ) : (
                                ""
                            )}
                        </>
                    );
                },
            },
            {
                title: "invoiceCode",
                width: 120,
                dataIndex: "invoiceCode",
            },
            {
                title: "partnerName",
                dataIndex: "partnerName",
                width: 250,
            },
            {
                title: "productName",
                dataIndex: "productName",
                width: 150,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return (
                        <>
                            {record?.children ? (
                                <strong className={"text-primary"}>
                                    <span>{t("count")}</span> : {record?.children.length}
                                </strong>
                            ) : (
                                <TextLineClampDisplay content={data}/>
                            )}
                        </>
                    );
                },
            },
            {
                dataIndex: "totalAmountBeforeDiscount",
                title: "totalAmountBeforeDiscount",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return <PriceCell value={record.totalAmountBeforeDiscount}/>;
                },
            },
            {
                dataIndex: "discountAmount",
                title: "discountAmount",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return <PriceCell value={record.discountAmount}/>;
                },
            },
            {
                dataIndex: "discountAmountAllocation",
                title: "discountAmountAllocation",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return <PriceCell value={record.discountAmountAllocation}/>;
                },
            },
            {
                dataIndex: "taxAmount",
                title: "taxAmount",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return <PriceCell value={record.taxAmount}/>;
                },
            },
            {
                dataIndex: "totalAmount",
                title: "totalAmount",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return <PriceCell value={record.totalAmount}/>;
                },
            },
            {
                dataIndex: "returnTotalAmount",
                title: "returnTotalAmount",
                align: "right",
                width: 170,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return <PriceCell value={record.returnTotalAmount}/>
                },
            },
            {
                dataIndex: "revenueAmount",
                title: "revenueAmount",
                align: "right",
                width: 170,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return <strong>{formatterNumber(record.revenueAmount, 0)}</strong>
                },
            },
            {
                title: "paymentAmount",
                width: 170,
                align: "right",
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return <PriceCell value={record.paymentAmount}/>
                },
            },
            {
                dataIndex: "debtAmount",
                title: "debtAmount",
                align: "right",
                width: 150,
                render: (data: string, record: SellReportRevenueDetailOutputDto) => {
                    return <PriceCell value={record.debtAmount}/>;
                },
            },
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
                    console.log("d", d);
                    stored.searchData(d);
                    stored.loadSummary();
                }, 250)}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12}>
                        <FloatLabel label={t("rangeDate")}>
                            <Form.Item name="rangeDate" className="flex-auto">
                                <OrdDateRangeInput></OrdDateRangeInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(12)}>
                        <SearchFilterText onReset={onResetClick} span={24}/>
                    </Col>
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
                                    <Table.Summary.Cell index={0} colSpan={5} align="left">
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
                                        index={10}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData.returnTotalAmount}/>

                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={11}
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

export default observer(ReportSellRevenueDetails);
