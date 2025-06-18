import React, {useEffect} from "react";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Row, Space, Table, TableColumnsType,} from "antd";
import {DailySummaryProductReportOutputDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {ArrowLeftOutlined, ExportOutlined,} from "@ant-design/icons";
import {debounce, round} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {observer} from "mobx-react-lite";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useNavigate} from "react-router-dom";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectProductType} from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import {PriceCell} from "@ord-components/table/cells/priceCell";

function ReportDailySummaryProduct() {
    const {reportDailySummaryProductStore: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const [searchFormRef] = Form.useForm();
    const productTypeCombo = useSelectProductType();

    useEffect(() => {
        if (stored) {
            searchFormRef.setFields([
                {
                    name: "reportDate",
                    value: new Date(),
                },
            ]);
            stored.setSearchFormRef(searchFormRef);
            stored.loadSummary();
        }
    }, []);

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "productCode",
                dataIndex: "productCode",
                width: 150,
                fixed: "left",
                render: (data: string, record: DailySummaryProductReportOutputDto) => {
                    return <strong>{data}</strong>;
                },
                sorter: false,
            },
            {
                title: "productName",
                dataIndex: "productName",
                width: 250,
                render: (data: string, record: DailySummaryProductReportOutputDto) => {
                    return (
                        <>
                            <TextLineClampDisplay content={data}/>{" "}
                        </>
                    );
                },
                sorter: false,
            },
            {
                title: "basicUnitName",
                dataIndex: "basicUnitName",
                width: 70,
            },
            {
                title: "qtyConvert",
                dataIndex: "qtyConvert",
                align: "right",
                width: 100,
            },

            {
                dataIndex: "totalAmountBeforeDiscount",
                title: "totalAmountBeforeDiscount2",
                align: "right",
                width: 150,
                render: (data: string, record: DailySummaryProductReportOutputDto) => {
                    return (
                        <PriceCell value={record.totalAmountBeforeDiscount}/>
                    );
                },
            },
            {
                dataIndex: "discountAmount",
                title: t("discountAmount"),
                align: "right",
                width: 100,
                render: (data: string, record: DailySummaryProductReportOutputDto) => {
                    return <PriceCell value={record.discountAmount}/>
                },
            },
            {
                dataIndex: "discountAmountAllocation",
                title: t("discountAmountAllocation"),
                align: "right",
                width: 100,
                render: (data: string, record: DailySummaryProductReportOutputDto) => {
                    return <PriceCell value={record.discountAmountAllocation}/>
                },
            },
            {
                dataIndex: "taxAmount",
                title: "taxAmount",
                align: "right",
                width: 150,
                render: (data: string, record: DailySummaryProductReportOutputDto) => {
                    return <PriceCell value={record.taxAmount}/>
                },
            },
            {
                title: "totalAmount",
                width: 150,
                align: "right",
                render: (data: string, record: DailySummaryProductReportOutputDto) => {
                    return <PriceCell value={record.totalAmount}/>
                },
            },
            {
                title: "returnQtyConvert",
                dataIndex: "returnQtyConvert",
                align: "right",
                width: 80,
            },
            {
                dataIndex: "returnTotalAmount",
                title: "returnTotalAmount",
                align: "right",
                width: 150,
                render: (data: string, record: DailySummaryProductReportOutputDto) => {
                    return (
                        <PriceCell value={record.returnTotalAmount}/>
                    );
                },
            },
            {
                dataIndex: "revenueAmount",
                title: "revenueAmount",
                align: "right",
                width: 150,
                render: (data: string, record: DailySummaryProductReportOutputDto) => {
                    return (
                        <PriceCell value={record.revenueAmount}/>
                    );
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
                name: "reportDate",
                value: new Date(),
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
                    <Col lg={6} md={12}>
                        <FloatLabel label={t("reportDate")}>
                            <Form.Item name="reportDate" className="flex-auto">
                                <OrdDateInput></OrdDateInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(6)}>
                        <FloatLabel label={t("type")}>
                            <Form.Item name="productTypeId">
                                <OrdSelect allowClear datasource={productTypeCombo}/>
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
                                    <Table.Summary.Cell index={0} colSpan={4} align="left">
                                        <strong className="font-bold ">{t("total")}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={5}
                                        align="right"
                                        className="font-bold "
                                    >
                                        {summaryData?.qtyConvert}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={6}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData?.totalAmountBeforeDiscount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={8}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData?.discountAmount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={8}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData?.discountAmountAllocation}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={7}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData?.taxAmount}/>
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell
                                        index={8}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData?.totalAmount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={10}
                                        align="right"
                                        className="font-bold "
                                    >
                                        <PriceCell value={summaryData?.returnQtyConvert}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={11}
                                        align="right"
                                        className="font-bold  !pr-1.5"
                                    >
                                        <PriceCell value={summaryData?.returnTotalAmount}/>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell
                                        index={12}
                                        align="right"
                                        className="font-bold !pr-1.5"
                                    >
                                        <PriceCell value={summaryData?.revenueAmount}/>
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

export default observer(ReportDailySummaryProduct);
