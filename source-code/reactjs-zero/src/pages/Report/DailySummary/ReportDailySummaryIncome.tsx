import {observer} from "mobx-react-lite";
import {Button, Col, Form, Row, Space, TableColumnsType} from "antd";
import {TopAction} from "@ord-components/crud/TopAction";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {ArrowLeftOutlined, ExportOutlined,} from "@ant-design/icons";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import {DailySummaryIncomeReportOutputDto, EmployeeDto,} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import Utils from "@ord-core/utils/utils";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useNavigate} from "react-router-dom";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {EmployeeService} from "@api/EmployeeService";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";

const useSelectEmployee = (): SelectDataSource => {
    const {t} = useTranslation("common");
    const key = "hrEmployee";

    return useSelectDataSource(key, async () => {
        const result = await EmployeeService.getComboOptions();
        if (!result || result.length === 0) {
            return [];
        }
        return result.map((it) => {
            return {
                ...EmployeeRenderSelectItem(it.data),
            };
        });
    });
};

const EmployeeRenderSelectItem = (dto: EmployeeDto) => {
    return {
        value: dto.userId,
        label: (
            <Space.Compact>
                <b>{dto.fullUserName}</b>
            </Space.Compact>
        ),
        data: {...dto},
        fts: Utils.removeAccentVietnamese([
            dto.fullUserName,
            dto.userName,
            dto.phoneNumber,
            dto.email,
        ]),
    };
};

function ReportDailySummaryIncome() {
    const {reportDailySummaryIncomeStore: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const {t: tEnum} = useTranslation("enum");
    const [searchFormRef] = Form.useForm();
    const {summaryData} = stored;
    useEffect(() => {
        if (stored) {
            searchFormRef.setFields([
                {
                    name: "reportDate",
                    value: DateUtil.getNow(),
                },
            ]);
            stored.setSearchFormRef(searchFormRef);
        }
    }, []);

    const navigate = useNavigate();

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

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "filter",
                value: null,
            },
            {
                name: "reportDate",
                value: DateUtil.getNow(),
            },
        ]);
        stored.searchData({});
        stored.loadSummary();
    }

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "accountMoveCode",
                dataIndex: "accountMoveCode",
                width: 200,
                sorter: false,
            },
            {
                title: "accountMoveDate",
                dataIndex: "accountMoveDate",
                width: 200,
                render: (data: string, record: DailySummaryIncomeReportOutputDto) => {
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
                width: 200,
                render: (data: string, record: DailySummaryIncomeReportOutputDto) => {
                    return (
                        <>
                            <div>
                                <span className="italic">({t(record.partnerName ?? "")})</span>
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
                render: (data: string, record: DailySummaryIncomeReportOutputDto) => {
                    return <>{tEnum(record.strPaymentMethod ?? "")}</>;
                },
            },
            {
                dataIndex: "income",
                title: "income",
                align: "right",
                width: 200,
                render: (data: string, record: DailySummaryIncomeReportOutputDto) => {
                    return (
                        <>
              <span
                  style={{color: record.accountMoveType == 2 ? "red" : "green"}}
              >
                {Utils.formatterNumber(
                    record.accountMoveType == 2
                        ? -(record?.amount ?? 0)
                        : record.amount,
                    0
                )}
              </span>
                        </>
                    );
                },
            },

            {
                dataIndex: "notes",
                title: "notes",
                width: 300
            },
        ],
        {
            ns: stored.getNamespaceLocale(),
        }
    );

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
                }, 250)}
            >
                <Row gutter={16}>
                    <Col lg={6} md={12}>
                        <FloatLabel label={t("reportDate")}>
                            <Form.Item name="reportDate">
                                <OrdDateInput></OrdDateInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={4} md={12}>
                        <FloatLabel label={t("creator")}>
                            <Form.Item name="creatorId">
                                <OrdSelect
                                    allowClear
                                    datasource={useSelectEmployee()}
                                ></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={10} md={14}>
                        <SearchFilterText onReset={onResetClick} span={24}/>
                    </Col>
                </Row>
            </Form>
            <div className="ord-container-box">
                <Row gutter={16} align="middle" justify="center" className="mb-2">
                    <Col lg={6} md={12} className="text-center">
                        <span>{t("totalIncome")}:</span>
                        <strong className="text-green-600 ml-1">
                            {Utils.formatterNumber(summaryData?.totalIncome, 0)}
                        </strong>
                    </Col>
                    <Col lg={6} md={12} className="text-center">
                        <span>{t("totalCost")}:</span>
                        <strong className="text-red-500 ml-1">
                            {Utils.formatterNumber(summaryData?.totalSpending, 0)}
                        </strong>
                    </Col>
                </Row>
                <AntTableWithDataPaged
                    searchForm={searchFormRef}
                    getPageResult={(d) => {
                        stored.loadSummary();
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
}

export default observer(ReportDailySummaryIncome);
