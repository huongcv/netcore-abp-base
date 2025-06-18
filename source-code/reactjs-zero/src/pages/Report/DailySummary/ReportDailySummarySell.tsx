import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Space,
    Table,
    TableColumnsType,
} from "antd";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useNavigate} from "react-router-dom";
import {ReturnIcon} from "@ord-components/icon/ReturnIcon";
import React, {useEffect, useState} from "react";
import {SaleInvoiceReportDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import DateUtil from "@ord-core/utils/date.util";
import {TableProps} from "antd/es/table/InternalTable";
import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import {TopAction} from "@ord-components/crud/TopAction";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {
    ArrowLeftOutlined,
    ExportOutlined,
    RedoOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";

function ReportDailySummarySell() {
    const {reportDailySummarySellStore: store} = useStore();
    const {t} = useTranslation("report-daily-summary-sale");
    const [searchFormRef] = Form.useForm();

    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState<number>();
    const [totalQuantity, setTotalQuantity] = useState<number>();
    const formatterNumber = Utils.formatterNumber;
    useEffect(() => {
        if (store) {
            store.setSearchFormRef(searchFormRef);
            searchFormRef.setFields([
                {
                    name: "creationTime",
                    value: new Date(),
                },
                {
                    name: "creatorEmployeeId",
                    value: undefined,
                },
            ]);
            store.setSearchFormRef(searchFormRef);
            // store.loadSummary()
        }
    }, []);

    // useHotkeys(
    //     "F3",
    //     (event) => {
    //         searchFormRef.submit();
    //         event.preventDefault();
    //     },
    //     {scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true}
    // );

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "creationTime",
                value: new Date(),
            },
            {
                name: "creatorEmployeeId",
                value: undefined,
            },
        ]);
        store.searchData({});
        store.loadSummary();
    }

    const collumns: TableColumnsType<SaleInvoiceReportDto> = TableUtil.getColumns(
        [
            {
                title: t("invoiceCode"),
                dataIndex: "invoiceCode",
                width: 100,
                align: "center",
            },
            {
                title: t("creationTime"),
                dataIndex: "creationTime",
                width: 100,
                render: (data: string, record: SaleInvoiceReportDto) => {
                    return (
                        <>
                            {" "}
                                <span>
                  {" "}
                                    {DateUtil.toFormat(record.creationTime, "DD/MM/YYYY HH:mm")}
                </span>
                        </>
                    );
                },
                sorter: false,
                align: "center",
            },
            {
                dataIndex: "totalQty",
                title: t("totalQty"),
                align: "right",
                width: 150,
                render: (data: string, record: SaleInvoiceReportDto) => {
                    return (
                        <span>
              {formatterNumber(record.totalQty, 0)}
            </span>
                    );
                },
            },
            {
                dataIndex: "totalAmount",
                title: t("totalAmount"),
                align: "right",
                width: 150,
                render: (data: string, record: SaleInvoiceReportDto) => {
                    return (
                        <span>
              <b> {formatterNumber(record.totalAmount, 0)}</b>
            </span>
                    );
                },
            },
        ],
        
    );

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
                        store.exportExcel().then((res) => {
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

    const Paged = (d: any) => {
        return store
            .apiService()
            .getPaged(
                {
                    body: {
                        ...d.body,
                    },
                },
                {}
            )
            .then((x) => {
                setTotalQuantity((x.extraProperties as any)?.totalQtyAll as number);
                setTotalAmount((x.extraProperties as any)?.totalAmountAll as number);
                return x;
            });
    };
    const DataTable = (props: TableProps<any>) => {
        const {summaryData} = store;
        return (
            <Table
                bordered={true}
                {...props}
                scroll={{x: "max-content"}}
                className={"ord-container-box"}
                summary={(pageData) => {
                    return (
                        <Table.Summary fixed="top">
                            <Table.Summary.Row >
                                <Table.Summary.Cell index={0} colSpan={3} align="left" >
                                    <strong >{t("total")}</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={5} align="right">
                                    <b >
                                        {" "}
                                        {formatterNumber(totalQuantity, 0)}
                                    </b>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4} align="right">
                                    <b >
                                        {" "}
                                        {formatterNumber(totalAmount, 0)}
                                    </b>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    );
                }}
                sticky={{offsetHeader: 1}}
            />
        );
    };
    const TableData = withDataTableFetching<any>(DataTable);

    return (
        <>
            <PageTopTitleAndAction
                usingCustom={true}
                mainTitle={t("Selling")}
                items={[t("pageTitle")]}
            >
                <TopAction topActions={topAction}/>
            </PageTopTitleAndAction>

            <Form
                className={"ord-container-box"}
                form={searchFormRef}
                layout={"vertical"}
                onFinish={debounce((d) => {
                    store.searchData(d);
                    store.loadSummary();
                }, 250)}
            >
                <Row gutter={16}>
                    <Col lg={6} md={12}>
                        <FloatLabel label={t("creationTime")}>
                            <Form.Item>
                                <Form.Item name="creationTime">
                                    <OrdDateInput></OrdDateInput>
                                </Form.Item>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <SearchFilterText onReset={onResetClick} span={12} ></SearchFilterText>
                </Row>
            </Form>

            <div className={"ord-container-box"}>
                <AntTableWithDataPaged
                    searchForm={searchFormRef}
                    getPageResult={(d) => Paged(d)}
                    columns={collumns}
                    searchData={store.searchDataState}
                    refreshDatasource={store.refreshDataState}
                    summary={(pageData) => {
                        return (
                            <Table.Summary fixed="top">
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={3} align="left">
                                        <strong className="">{t("total")}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5} align="right">
                                        <b className="">
                                            {" "}
                                            {formatterNumber(totalQuantity, 0)}
                                        </b>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align="right">
                                        <b className="">
                                            {" "}
                                            {formatterNumber(totalAmount, 0)}
                                        </b>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />
            </div>
        </>
    );
}

export default observer(ReportDailySummarySell);
