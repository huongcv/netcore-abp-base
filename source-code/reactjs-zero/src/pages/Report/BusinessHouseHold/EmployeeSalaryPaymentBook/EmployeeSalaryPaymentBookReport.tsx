import { ArrowLeftOutlined, ExportOutlined } from "@ant-design/icons";
import { EmployeeSalaryPaymentBookDetailDto } from "@api/index.defs";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import { Button, Col, Form, Row, Space, Table, TableColumnsType } from "antd";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./index.scss"

const EmployeeSalaryPaymentBookReport = () => {
    const { employeeSalaryPaymentBookReportStore: stored } = useStore();
    const { t } = useTranslation(stored.getNamespaceLocale());
    const navigate = useNavigate();
    const formatterNumber = Utils.formatterNumber;
    const [searchFormRef] = Form.useForm();

    const isPayRoll = (record: any) => {
        return record.accountMoveCode?.startsWith("BL");
    }

    const columns: TableColumnsType<EmployeeSalaryPaymentBookDetailDto> = [
        {
            title: t("Ngày, tháng ghi sổ"),
            dataIndex: "accountMoveDate",
            width: 140,
            align: "center",
            render: (val, record) =>
                ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string)
                    ? ""
                    : DateUtil.toFormat(val, "DD/MM/YYYY"),
        },
        {
            title: t("Số hiệu"),
            dataIndex: "accountMoveCode",
            width: 150,
            align: "center",
        },
        {
            title: t("Ngày, tháng"),
            dataIndex: "accountMoveDate",
            width: 140,
            align: "center",
            render: (val, record) =>
                ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string)
                    ? ""
                    : DateUtil.toFormat(val, "DD/MM/YYYY"),
        },
        {
            title: t("Diễn giải"),
            dataIndex: "descriptions",
            width: 250,
            align: "left",
            render: (v) => {
                if (v === "OPENING_PAYMENT_AMOUNT") return <span className="font-bold">{t("Số dư đầu kỳ")}</span>;
                if (v === "DURING_TOTAL") return <span className="font-bold">{t("Cộng số phát sinh trong kỳ")}</span>;
                if (v === "ENDING_TOTAL") return <span className="font-bold">{t("Số dư cuối kỳ")}</span>;
                return <span>{v}</span>;
            },
        },
        {
            title: t("Tiền lương và thu nhập của người lao động"),
            align: "center",
            children: [
                {
                    title: t("Số phải trả"),
                    dataIndex: "totalSalaryAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) || record.accountMoveCode?.startsWith("PC") ? "" : formatterNumber(val, 0),
                },
                {
                    title: t("Số đã trả"),
                    dataIndex: "paymentSalaryAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) || isPayRoll(record) ? "" : formatterNumber(val, 0),
                },
                {
                    title: t("Số còn phải trả"),
                    dataIndex: "remainingSalaryAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        <span className={["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) ? "font-bold" : ""}>
                            {formatterNumber(val, 0)}
                        </span>,
                },
            ],
        },
        {
            title: t("Bảo hiểm xã hội"),
            align: "center",
            children: [
                {
                    title: t("Số phải trả"),
                    dataIndex: "totalSocialInsuranceAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) || record.accountMoveCode?.startsWith("PC")  ? "" : formatterNumber(val, 0),
                },
                {
                    title: t("Số đã trả"),
                    dataIndex: "paymentSocialInsuranceAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) || isPayRoll(record) ? "" : formatterNumber(val, 0),
                },
                {
                    title: t("Số còn phải trả"),
                    dataIndex: "remainingSocialInsuranceAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        <span className={["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) || record.accountMoveCode?.startsWith("PC")  ? "font-bold" : ""}>
                            {formatterNumber(val, 0)}
                        </span>,
                },
            ],
        },
        {
            title: t("Bảo hiểm y tế"),
            align: "center",
            children: [
                {
                    title: t("Số phải trả"),
                    dataIndex: "totalHealthInsuranceAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) || record.accountMoveCode?.startsWith("PC") ? "" : formatterNumber(val, 0),
                },
                {
                    title: t("Số đã trả"),
                    dataIndex: "paymentHealthInsuranceAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) || isPayRoll(record) ? "" : formatterNumber(val, 0),
                },
                {
                    title: t("Số còn phải trả"),
                    dataIndex: "remainingHealthInsuranceAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        <span className={["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) ? "font-bold" : ""}>
                            {formatterNumber(val, 0)}
                        </span>,
                },
            ],
        },
        {
            title: t("Bảo hiểm thất nghiệp"),
            align: "center",
            children: [
                {
                    title: t("Số phải trả"),
                    dataIndex: "totalUnemploymentInsuranceAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) || record.accountMoveCode?.startsWith("PC") ? "" : formatterNumber(val, 0),
                },
                {
                    title: t("Số đã trả"),
                    dataIndex: "paymentUnemploymentInsuranceAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        ["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) || isPayRoll(record) ? "" : formatterNumber(val, 0),
                },
                {
                    title: t("Số còn phải trả"),
                    dataIndex: "remainingUnemploymentInsuranceAmount",
                    width: 150,
                    align: "right",
                    render: (val, record) =>
                        <span className={["OPENING_PAYMENT_AMOUNT", "DURING_TOTAL", "ENDING_TOTAL"].includes(record.descriptions as string) ? "font-bold" : ""}>
                            {formatterNumber(val, 0)}
                        </span>,
                },
            ],
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
        }
    }, []);

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange('thang_nay')
            }
        ])
        stored.searchData({});
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
            <PageTopTitleAndAction usingCustom={true} mainTitle={t('S5-HKD: Sổ theo dõi tình hình thanh toán tiền lương và các khoản nộp theo lương của người lao động')}
                items={[t('Báo cáo Hộ kinh doanh'),]}>
                <TopAction topActions={topAction} />
            </PageTopTitleAndAction>
            <Form className={'ord-container-box'} form={searchFormRef} layout={"vertical"}
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
            </Form>
            <div className="ord-container-box">
                <AntTableWithDataPaged
                    columns={columns}
                    searchForm={searchFormRef}
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                    getPageResult={async (d) => {
                        const res = await stored.apiService().getPaged({ body: d.body });
                        stored.summaryData = res.summaryData;

                        return {
                            items: res.items,
                            totalCount: res.totalCount
                        };
                    }}
                    onChangePageResult={(pagedResult) => {
                        const s = stored.summaryData;

                        const openingRow = {
                            descriptions: "OPENING_PAYMENT_AMOUNT",
                            remainingSalaryAmount: s.opening?.salaryAmount || 0,
                            remainingSocialInsuranceAmount: s.opening?.socialInsuranceAmount || 0,
                            remainingHealthInsuranceAmount: s.opening?.healthInsuranceAmount || 0,
                            remainingUnemploymentInsuranceAmount: s.opening?.unemploymentInsuranceAmount || 0,
                        };

                        const duringSummaryRow = {
                            descriptions: "DURING_TOTAL",
                            totalSalaryAmount: s.duringTotal?.salaryAmount || 0,
                            paymentSalaryAmount: s.duringTotal?.salaryAmount || 0,
                            remainingSalaryAmount: (s.duringTotal?.salaryAmount || 0) - (s.duringPayment?.salaryAmount || 0),

                            totalSocialInsuranceAmount: s.duringTotal?.socialInsuranceAmount || 0,
                            paymentSocialInsuranceAmount: s.duringTotal?.socialInsuranceAmount || 0,
                            remainingSocialInsuranceAmount: (s.duringTotal?.socialInsuranceAmount || 0) - (s.duringPayment?.socialInsuranceAmount || 0),

                            totalHealthInsuranceAmount: s.duringTotal?.healthInsuranceAmount || 0,
                            paymentHealthInsuranceAmount: s.duringTotal?.healthInsuranceAmount || 0,
                            remainingHealthInsuranceAmount: (s.duringTotal?.healthInsuranceAmount || 0) - (s.duringPayment?.healthInsuranceAmount || 0),

                            totalUnemploymentInsuranceAmount: s.duringTotal?.unemploymentInsuranceAmount || 0,
                            paymentUnemploymentInsuranceAmount: s.duringTotal?.unemploymentInsuranceAmount || 0,
                            remainingUnemploymentInsuranceAmount: (s.duringTotal?.unemploymentInsuranceAmount || 0) - (s.duringPayment?.unemploymentInsuranceAmount || 0),
                        };

                        const endingSummaryRow = {
                            descriptions: "ENDING_TOTAL",
                            remainingSalaryAmount: s.ending?.salaryAmount || 0,
                            remainingSocialInsuranceAmount: s.ending?.socialInsuranceAmount || 0,
                            remainingHealthInsuranceAmount: s.ending?.healthInsuranceAmount || 0,
                            remainingUnemploymentInsuranceAmount: s.ending?.unemploymentInsuranceAmount || 0,
                        };

                        pagedResult.items = [
                            openingRow,
                            ...(pagedResult.items || []),
                            duringSummaryRow,
                            endingSummaryRow
                        ];
                    }}

                    summary={() => {
                        const s = stored.summaryData;
                        return (
                            <Table.Summary fixed="bottom">
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4} className="font-bold !pr-1.5">
                                        <strong>{t("Tổng cộng")}</strong>
                                    </Table.Summary.Cell>

                                    {/* Tổng Tiền lương */}
                                    <Table.Summary.Cell index={4} align="right" className="font-bold !pr-1.5">
                                        {formatterNumber(s?.duringTotal?.salaryAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5} align="right" className="font-bold !pr-1.5">
                                        {formatterNumber(s?.duringPayment?.salaryAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6} align="right" className="font-bold !pr-1.5">
                                    </Table.Summary.Cell>

                                    {/* Tổng BHXH */}
                                    <Table.Summary.Cell index={7} align="right" className="font-bold !pr-1.5">
                                        {formatterNumber(s?.duringTotal?.socialInsuranceAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={8} align="right" className="font-bold !pr-1.5">
                                        {formatterNumber(s?.duringPayment?.socialInsuranceAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={9} align="right" className="font-bold !pr-1.5">
                                    </Table.Summary.Cell>

                                    {/* Tổng BHYT */}
                                    <Table.Summary.Cell index={10} align="right" className="font-bold !pr-1.5">
                                        {formatterNumber(s?.duringTotal?.healthInsuranceAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={11} align="right" className="font-bold !pr-1.5">
                                        {formatterNumber(s?.duringPayment?.healthInsuranceAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={12} align="right" className="font-bold !pr-1.5">
                                    </Table.Summary.Cell>

                                    {/* Tổng BHTN */}
                                    <Table.Summary.Cell index={13} align="right" className="font-bold !pr-1.5">
                                        {formatterNumber(s?.duringTotal?.unemploymentInsuranceAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={14} align="right" className="font-bold !pr-1.5">
                                        {formatterNumber(s?.duringPayment?.unemploymentInsuranceAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={15} align="right" className="font-bold !pr-1.5">
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />
            </div>
        </>
    );
};

export default observer(EmployeeSalaryPaymentBookReport);
