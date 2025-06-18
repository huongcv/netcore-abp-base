import React, { useEffect, useState } from "react";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { useStore } from "@ord-store/index";
import { Button, Col, Form, Input, Row, Space, TableColumnsType } from "antd";
import TableUtil from "@ord-core/utils/table.util";
import { observer } from "mobx-react-lite";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { useTranslation } from "react-i18next";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {
    ArrowLeftOutlined,
    EditOutlined,
    ExportOutlined,
    RedoOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { useSelectAccountMoveType } from "@ord-components/forms/select/selectDataSource/useSelectAccountMoveType";
import { ACCOUNT_MOVE_TYPE, AccountMoveDto } from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import MoveReasonTypeInput from "@pages/AccountantManagement/Shared/forms/MoveReasonTypeInput";
import { useSelectPaymentMethod } from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { TopAction } from "@ord-components/crud/TopAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { ReturnIcon } from "@ord-components/icon/ReturnIcon";
import { Link, useNavigate } from "react-router-dom";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { OrdBreadcrumb } from "@ord-components/common/page/PageBreadcrumb";
import Utils from "@ord-core/utils/utils";
import { useSelectReasonType } from "@ord-components/forms/select/selectDataSource/useSelectReasonType";
import { useSelectReasonTypeEnum } from "@ord-components/forms/select/selectDataSource/useSelectReasonTypeEnum";
import { use } from "i18next";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

const ReportIncome = () => {
    const { reportSellInComeStore: stored } = useStore();
    const { summaryData } = stored;
    const { t } = useTranslation(stored.getNamespaceLocale());
    const { t: tEnum } = useTranslation("enum");

    const { t: tCommon } = useTranslation("common");
    const [searchFormRef] = Form.useForm();
    const [accMoveType, setAccMoveType] = useState<number>();
    const formatterNumber = Utils.formatterNumber;
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


    useEffect(() => {
        searchFormRef.setFieldValue('reasonTypeId', null); 
    }, [Form.useWatch('accountMoveType', searchFormRef)])

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "accountMoveCode",
                dataIndex: "accountMoveCode",
                width: 150,
                sorter: false,
            },
            {
                width: 180,
                dataIndex: "accountMoveReasonName",
                title: "accountMoveReasonName",
            },
            {
                title: "accountMoveDate",
                dataIndex: "accountMoveDate",
                width: 150,
                render: (data: string, record: AccountMoveDto) => {
                    return (
                        <>
                            <span>
                                {" "}
                                {DateUtil.toFormat(record.accountMoveDate, "DD/MM/YYYY HH:mm")}
                            </span>
                        </>
                    );
                },
                sorter: false,
            },
            {
                title: "partnerInfo",
                render: (data: string, record: AccountMoveDto) => {
                    return (
                        <>
                            <div>
                                {record.partnerName}{" "}
                                <span className="italic">
                                    ({tEnum(record.strPartnerType ?? "")})
                                </span>
                            </div>
                        </>
                    );
                },
            },
            {
                dataIndex: "strPaymentMethod",
                title: "strPaymentMethod",
                align: "center",
                width: 150,
                render: (data: string, record: AccountMoveDto) => {
                    return <>{tEnum(record.strPaymentMethod ?? "")}</>;
                },
            },
            {
                dataIndex: "amount",
                title: "amount",
                align: "right",
                width: 120,
                render: (data: string, record: AccountMoveDto) => {
                    return <>{formatterNumber(record.amount, 0)}</>;
                },
            },
            {
                dataIndex: "income",
                title: "income",
                align: "right",
                width: 120,
                render: (data: string, record: AccountMoveDto) => {
                    return (
                        <>
                            {record.accountMoveType == 2 ? (
                                <span
                                    style={{ color: record.accountMoveType == 2 ? "red" : "" }}
                                >
                                    {formatterNumber(Math.abs(record.income ?? 0), 0)}
                                </span>
                            ) : (
                                <span
                                    style={{ color: record.accountMoveType == 1 ? "green" : "" }}
                                >
                                    {formatterNumber(record.income ?? 0, 0)}
                                </span>
                            )}
                        </>
                    );
                },
            },

            {
                dataIndex: "notes",
                title: "notes",
                width: 300,
                align: 'center'
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
                            <ArrowLeftOutlined />
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
                        stored.exportExcelPagedResult().then((res) => { });
                    }}
                >
                    <Space>
                        <ExportOutlined />
                    </Space>
                    {t("actionBtn.exportExcel")}
                </Button>
            ),
        },
    ];
    return (
        <>
            <PageTopTitleAndAction
                usingCustom={true}
                mainTitle={t("titlePage")}
                items={[t("titlePageLvl1"), t("titlePageLvl2")]}
            >
                <TopAction topActions={topAction} />
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
                    <Col lg={7} md={12}>
                        <FloatLabel label={t("rangeDate")}>
                            <Form.Item name="rangeDate">
                                <OrdDateRangeInput></OrdDateRangeInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={3} md={12}>
                        <FloatLabel label={t("accountMoveType")}>
                            <Form.Item name="accountMoveType">
                                <OrdSelect
                                    allowClear
                                    datasource={useSelectAccountMoveType()}
                                    onChange={(data) => {
                                        setAccMoveType(data);
                                    }}
                                ></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={3} md={12}>
                        <FloatLabel label={t("reasonType")}>
                            <Form.Item name="reasonTypeId">
                                {/* <MoveReasonTypeInput
                  disabled={!accMoveType}
                  reason_move_type={accMoveType ?? 1}
                ></MoveReasonTypeInput> */}
                                <OrdSelect
                                    allowClear
                                    disabled={!accMoveType}
                                    datasource={useSelectReasonTypeEnum(accMoveType)}
                                ></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={4} md={12}>
                        <FloatLabel label={t("paymentMethod")}>
                            <Form.Item name="paymentMethod">
                                <OrdSelect
                                    allowClear={true}
                                    datasource={useSelectPaymentMethod()}
                                ></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={7} md={12} style={{paddingLeft:0,paddingRight:0}}>
                        <SearchFilterText onReset={onResetClick} span={24}    />
                    </Col>
                </Row>
            </Form>

            <div className={"ord-container-box"}>
                <Row gutter={16} align="middle" justify="center" className="mb-2">
                    <Col lg={6} md={12} className="text-center">
                        <span>{t("beginningBalance")}:</span>
                        <strong className="text-red-500 ml-1">
                            {formatterNumber(summaryData?.beginningBalance, 0)}
                        </strong>
                    </Col>
                    <Col lg={6} md={12} className="text-center">
                        <span>{t("totalIncome")}:</span>
                        <strong className="text-green-600 ml-1">
                            {formatterNumber(summaryData?.totalIncome, 0)}
                        </strong>
                    </Col>
                    <Col lg={6} md={12} className="text-center">
                        <span>{t("totalCost")}:</span>
                        <strong className="text-red-500 ml-1">
                            {formatterNumber(summaryData?.totalCost, 0)}
                        </strong>
                    </Col>
                    <Col lg={6} md={12} className="text-center">
                        <span>{t("endingBalance")}:</span>
                        <strong className="text-red-500 ml-1">
                            {formatterNumber(summaryData?.endingBalance, 0)}
                        </strong>
                    </Col>
                </Row>
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
                    columns={columns}
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                />
            </div>
        </>
    );
};

export default observer(ReportIncome);
