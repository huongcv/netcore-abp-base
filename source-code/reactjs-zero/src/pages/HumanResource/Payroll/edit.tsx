import {
    ArrowLeftOutlined,
    CheckOutlined,
    FileExcelOutlined,
    MoneyCollectOutlined
} from "@ant-design/icons";
import { EmployeePayrollService } from "@api/EmployeePayrollService";
import { EmployeePayrollDetailDto } from "@api/index.defs";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectTimesheet } from "@ord-components/forms/select/selectDataSource/useSelectTimesheet";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import { Button, Card, Col, Form, Input, Row, Space, Spin, Table, TableColumnsType } from "antd";
import FileSaver from "file-saver";
import { observer } from "mobx-react-lite";
import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PaySalaryModal from "./PaySalaryModal";

const EditPayroll = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const { payrollStore: stored, payrollDetailStore: detailStore } = useStore();
    const [t] = useTranslation(stored.getNamespaceLocale());
    const [payrollDto, setPayrollDto] = useState<any>(null);
    const [cusForm] = Form.useForm();
    const timesheetData = useSelectTimesheet(); 
    useEffect(() => {
        if (id) {
            loadPayroll().then();
        }
    }, [id]);
    const loadPayroll = async () => {
        UiUtils.setBusy();
        try {
            const payroll = await EmployeePayrollService.getById({
                idHash: id
            });
            setPayrollDto(payroll);
            cusForm.setFieldsValue(payroll);
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
    const currentDate = new Date();
    const formattedDate = currentDate.getDate().toString().padStart(2, '0') + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getFullYear();
    const appendDateToFileName = (fileName: string, formattedDate: string): string => {
        if (fileName.endsWith('.xlsx')) {
            const fileNameWithoutExtension = fileName.replace('.xlsx', '');
            return `${fileNameWithoutExtension}_${formattedDate}.xlsx`;
        } else {
            return fileName;
        }
    }

    const exportExcelDetail = async (payrollDetailId: string) => {
        UiUtils.setBusy();
        try {
            const timesheetId = cusForm.getFieldValue('timesheetId');
            const body = { payrollDetailId: payrollDetailId, timesheetId: timesheetId };
            // @ts-ignore
            const resultBlob = await EmployeePayrollService.exportPayrollDetailByEmployeeResult(body, { responseType: 'blob' });
            if (resultBlob) {
                const fileName = t('payrollDetailExportName');
                const fileNameFormatted = appendDateToFileName(fileName, formattedDate);
                FileSaver.saveAs(resultBlob, fileNameFormatted);
            }
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            UiUtils.clearBusy();
        }
    };

    const renderTitle = (title: string, code: string) => {
        return (
            <>
                {title} ({code})
            </>
        );
    }

    const columns: TableColumnsType<EmployeePayrollDetailDto> = TableUtil.getColumns([
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_: any, __: EmployeePayrollDetailDto, index: number) => index + 1,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'employeeName',
            key: 'employeeName',
            width: 180,
        },
        {
            title: 'Tổng ngày công cơ bản',
            dataIndex: 'totalWorkDay',
            key: 'totalWorkDay',
            align: 'end',
            width: 200,
            children: [
                {
                    title: '(1)',
                    dataIndex: 'totalWorkDay',
                    key: 'totalWorkDay',
                    align: 'end',
                    width: 200,
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Tổng ngày công thực tế',
            dataIndex: 'actualWorkDay',
            key: 'actualWorkDay',
            align: 'end',
            width: 240,
            children: [
                {
                    title: '(2)',
                    dataIndex: 'actualWorkDay',
                    key: 'actualWorkDay',
                    align: 'end',
                    width: 240,
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Lương cơ bản',
            dataIndex: 'salaryAmount',
            key: 'salaryAmount',
            align: 'end',
            width: 180,
            children: [
                {
                    title: '(3)',
                    dataIndex: 'salaryAmount',
                    key: 'salaryAmount',
                    align: 'end',
                    width: 180,
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Tổng lương thực tế',
            dataIndex: 'actualSalaryAmount',
            key: 'actualSalaryAmount',
            align: 'end',
            width: 180,
            children: [
                {
                    title: '(4)',
                    dataIndex: 'actualSalaryAmount',
                    key: 'actualSalaryAmount',
                    align: 'end',
                    width: 180,
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Phụ cấp chịu thuế',
            dataIndex: 'taxableAllowanceAmount',
            key: 'taxableAllowanceAmount',
            width: 180,
            align: 'end',
            children: [
                {
                    title: '(5)',
                    dataIndex: 'taxableAllowanceAmount',
                    key: 'taxableAllowanceAmount',
                    width: 180,
                    align: 'end',
                    render: (v) => Utils.formatterNumber(v)
                }
            ]
        },
        {
            title: 'Tổng TN chịu thuế',
            dataIndex: 'totalTaxableIncome',
            key: 'totalTaxableIncome',
            align: 'end',
            width: 240,
            children: [
                {
                    title: '(7) = (4) + (5)',
                    dataIndex: 'totalTaxableIncome',
                    key: 'totalTaxableIncome',
                    align: 'end',
                    width: 240,
                    render: (v) => Utils.formatterNumber(v)
                }
            ]

        },
        {
            title: 'Bảo hiểm NLĐ đóng',
            dataIndex: 'totalInsuranceDeduction',
            key: 'totalInsuranceDeduction',
            align: 'end',
            width: 180,
            children: [
                {
                    title: '(8)',
                    dataIndex: 'totalInsuranceDeduction',
                    key: 'totalInsuranceDeduction',
                    align: 'end',
                    width: 180,
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Bảo hiểm Công ty đóng',
            dataIndex: 'totalCompanyInsuranceAmount',
            key: 'totalCompanyInsuranceAmount',
            align: 'end',
            width: 180,
            children: [
                {
                    title: '(9)',
                    dataIndex: 'totalCompanyInsuranceAmount',
                    key: 'totalCompanyInsuranceAmount',
                    align: 'end',
                    width: 180,
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Tổng giảm trừ',
            dataIndex: 'totalDeductionAmount',
            key: 'totalDeductionAmount',
            align: 'end',
            width: 180,
            children: [
                {
                    title: '(10)',
                    dataIndex: 'totalDeductionAmount',
                    key: 'totalDeductionAmount',
                    align: 'end',
                    width: 180,
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Thuế TNCN',
            dataIndex: 'personalIncomeTaxAmount',
            key: 'personalIncomeTaxAmount',
            align: 'end',
            width: 180,
            children: [
                {
                    title: '(11)',
                    dataIndex: 'personalIncomeTaxAmount',
                    key: 'personalIncomeTaxAmount',
                    align: 'end',
                    width: 180,
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Thu nhập sau thuế',
            dataIndex: 'totalAfterTaxIncome',
            key: 'totalAfterTaxIncome',
            align: 'end',
            width: 180,
            children: [
                {
                    title: '(12) = (7) - (8) - (11)',
                    dataIndex: 'totalAfterTaxIncome',
                    key: 'totalAfterTaxIncome',
                    align: 'end',
                    width: 180,
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Phụ cấp không chịu thuế',
            dataIndex: 'allowanceAmount',
            key: 'allowanceAmount',
            width: 240,
            align: 'end',
            children: [
                {
                    title: '(13)',
                    dataIndex: 'allowanceAmount',
                    key: 'allowanceAmount',
                    width: 240,
                    align: 'end',
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        },
        {
            title: 'Thực lĩnh',
            dataIndex: 'totalSalaryAmount',
            key: 'totalSalaryAmount',
            align: 'end',
            width: 180,
            fixed: 'right',
            children: [
                {
                    title: '(14) = (12) + (13)',
                    dataIndex: 'totalSalaryAmount',
                    key: 'totalSalaryAmount',
                    align: 'end',
                    width: 180,
                    fixed: 'right',
                    render: (v) => Utils.formatterNumber(v)

                }
            ]
        }
    ], {
        actions: [
            {
                title: 'view',
                icon: <CheckOutlined />,
                onClick: (d: EmployeePayrollDetailDto) => {
                    if (!payrollDto || !payrollDto.timesheetId) {
                        return;
                    }
                    const modalData = {
                        ...d,
                        timesheetId: payrollDto.timesheetId,
                    };
                    detailStore.openCreateModal(modalData);
                }
            },
            {
                title: 'pay',
                icon: <MoneyCollectOutlined />,
                hiddenIf: (d: EmployeePayrollDetailDto) => d.paymentTotalSalary == d.totalSalaryAmount,
                onClick: (d: EmployeePayrollDetailDto) => {
                    if (!payrollDto || !payrollDto.timesheetId) {
                        return;
                    }
                    detailStore.openPaySalaryModal(d);
                }
            },
            {
                title: t('export.excel.payroll.detail'),
                icon: <FileExcelOutlined />,
                permission: 'EmployeePayroll.CreateOrUpdate',
                onClick: (d: EmployeePayrollDetailDto) => {
                    // @ts-ignore
                    exportExcelDetail(d?.id);
                }
            },
        ],
        ns: stored.getNamespaceLocale()
    }, true);

    const topAction: IActionBtn[] = [
        {
            title: t('actionBtn.ReasonType'),
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined />
                    </Space>
                    {t('actionBtn.back')}
                </Button>
            </>
        },
    ]

    const LazyModalPayrollDetail = lazy(() => import('@pages/HumanResource/Payroll/modalDetailPayroll'));


    return (
        <>
            {
                payrollDto &&
                <div>
                    <PageTopTitleAndAction usingCustom={true} mainTitle={t('detail')} items={[t('titlePageDetailLvl1'), t('titlePageDetailLvl2')]}>
                        <>
                            <TopAction topActions={topAction} />
                        </>
                    </PageTopTitleAndAction>
                    <Card>
                        <Form form={cusForm} className={"mt-3"}>
                            <Row gutter={16}>
                                <Col span={7}>
                                    <FloatLabel label={t("name.payroll")}>
                                        <Form.Item name="name">
                                            <Input disabled />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={7}>
                                    <FloatLabel label={t("timesheet")}>
                                        <Form.Item name="timesheetId">
                                            <OrdSelect
                                                datasource={timesheetData}
                                                placeholder={t("select.timesheet")}
                                                disabled
                                            />
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>

                                <Col span={4}>
                                    <FloatLabel label={t('startDate')}>
                                        <Form.Item name='startDate'>
                                            <OrdDateInput disabled></OrdDateInput>
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                                <Col span={4}>
                                    <FloatLabel label={t('endDate')}>
                                        <Form.Item name='endDate'>
                                            <OrdDateInput disabled></OrdDateInput>
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>


                                <Col span={24}>
                                    <Table
                                        pagination={false}
                                        scroll={{ x: 'max-content' }}
                                        rowKey="rowIndex"
                                        bordered
                                        dataSource={payrollDto.details}
                                        columns={columns}
                                    />
                                </Col>
                            </Row>
                        </Form>
                        <Suspense fallback={<Spin />}>
                            {detailStore.createOrUpdateModal.visible && <LazyModalPayrollDetail onCruSuccess={() => {
                                loadPayroll().then();
                                stored.refreshGridData(true).then()
                            }}></LazyModalPayrollDetail>}
                        </Suspense>
                    </Card>
                    <PaySalaryModal onSuccess={() => {
                        loadPayroll().then()
                    }}/>
                </div>
            }
        </>
    );
}
export default observer(EditPayroll);
