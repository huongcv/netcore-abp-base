import { useTranslation } from "react-i18next";
import { Button, Card, Form, Popover, Result, Row, Space, Spin, Table } from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { lazy, Suspense, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import OrdMonthInput from "@ord-components/forms/OrdMonthInput";
import TableUtil from "@ord-core/utils/table.util";
import { ColumnType } from "antd/es/table/interface";
import UiUtils from "@ord-core/utils/ui.utils";
import { EmployeeTimesheetService } from "@api/EmployeeTimesheetService";
import { EmployeeTimesheetDetailSummaryDto, EmployeeTimesheetDto } from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import DateUtil from "@ord-core/utils/date.util";
import { ArrowLeftOutlined, CalculatorOutlined, EditOutlined, InfoCircleOutlined, SaveOutlined } from "@ant-design/icons";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { CheckIn } from "@ord-components/icon/CheckIn";
import { CheckOut } from "@ord-components/icon/CheckOut";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "@ord-store/index";

function TimesheetDetailForm() {
    let { id } = useParams();
    const { t } = useTranslation('timesheet');
    const [enumTranslation] = useTranslation('enum');
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<EmployeeTimesheetDetailSummaryDto[]>([]);
    const navigate = useNavigate();
    const [columns, setColumns] = useState<ColumnType<any>[]>([]);
    const [isShowTimesheet, setIsShowTimesheet] = useState(false);
    const [employeeTimesheetData, setEmployeeTimesheetData] = useState<EmployeeTimesheetDto>({});
    const { timesheetStore: mainStore } = useStore();
    useEffect(() => {

        if (id) {
            UiUtils.setBusy();
            EmployeeTimesheetService.getById({
                idHash: id,
            }).then((result: EmployeeTimesheetDto) => {
                if (result?.startDate) {

                    form.setFieldsValue({
                        timeSheetDate: new Date(result?.startDate)
                    });
                }
                setEmployeeTimesheetData(result);
                generateColumnsByDaysInMonth(form.getFieldValue('timeSheetDate'));
                mapRowIndexData(result.listEmployeeTimesheetDetailSummary);
                setIsShowTimesheet(true);
            }).finally(UiUtils.clearBusy)
        }
    }, [])

    useEffect(() => {
        refreshData();
    }, [mainStore.refreshDataState])

    const generateColumnsByDaysInMonth = (date: Date | null) => {
        if (date) {
            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

            let dayColumn: any = [];

            for (let day = 1; day <= daysInMonth; day++) {
                dayColumn.push({
                    dataIndex: 'employeeId',
                    title: day.toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0'),
                    width: 100,
                    align: 'center',
                    render: (data: number, record: EmployeeTimesheetDetailSummaryDto) => {
                        // @ts-ignore
                        const timesheetDetail: any = record.employeeTimesheetDetailObject['day' + day];
                        let resultTemp = <></>;
                        if (timesheetDetail?.status === 1) {
                            let timeDetail = (
                                <>
                                    <div>
                                        {timesheetDetail.checkIn && <><CheckIn width={'16px'} /> <span
                                            style={{ color: timesheetDetail.lateInMinutes ? 'red' : 'green', fontWeight: 500 }}>{DateUtil.toFormat(timesheetDetail.checkIn, 'HH:mm')}</span></>}
                                    </div>
                                    <div>{timesheetDetail.checkOut && <><CheckOut width={'16px'} /> <span
                                        style={{ color: timesheetDetail.earlyOutMinutes ? 'red' : 'green', fontWeight: 500 }}>{DateUtil.toFormat(timesheetDetail.checkOut, 'HH:mm')}</span></>}
                                    </div>
                                </>
                            );
                          
                            resultTemp = (
                                <>
                                    {timesheetDetail?.workRate} CL
                                    <Popover content={timeDetail} title="Thông tin chấm công">
                                        <InfoCircleOutlined hidden={(timesheetDetail.checkIn == "0001-01-01T00:00:00" || !timesheetDetail.checkIn)} style={{ marginLeft: 4, cursor: 'pointer' }} />
                                    </Popover>
                                </>
                            );
                        } else if (timesheetDetail?.status === 2) {
                            resultTemp = <>{timesheetDetail?.workRate} P</>;
                        } else if (timesheetDetail?.status === 3) {
                            resultTemp = <>{timesheetDetail?.workRate} KL</>;
                        } else if (timesheetDetail?.status === 4) {
                            resultTemp = <> </>;
                        }
                        return resultTemp;
                    },
                })
            }

            setColumns(TableUtil.getColumns([
                {
                    dataIndex: 'employeeName',
                    title: t('employee'),
                    width: 200,
                }
                , {
                    dataIndex: 'totalWorkDay',
                    title: t('totalWorkDay'),
                    align: 'right',
                    width: 120,
                }
                , {
                    dataIndex: 'actualWorkDay',
                    title: t('actualWorkDay'),
                    align: 'right',
                    width: 120,
                }
                , {
                    dataIndex: 'totalOffDayWithSalary',
                    title: t('totalOffDayWithSalary'),
                    align: 'right',
                    width: 120,
                }
                , {
                    dataIndex: 'totalOffDayWithoutSalary',
                    title: t('totalOffDayWithoutSalary'),
                    align: 'right',
                    width: 150,
                }
                , {
                    dataIndex: 'totalLateInEarlyOutMinutes',
                    title: t('totalLateInEarlyOutMinutes'),
                    align: 'right',
                    render: (data: string, record: any) => {
                        return <>
                            {Utils.formatterNumber(record.totalLateInEarlyOutMinutes)}
                        </>
                    },
                    width: 130,
                }
                , ...dayColumn
                , {
                    title: t('action'),
                    fixed: 'right',
                    align: 'center',
                    hidden: (employeeTimesheetData.status === 3 || employeeTimesheetData.status === 4),
                    render: (data: string, record: any) => {
                        return <>
                            <Button onClick={() => {
                                console.log('record', record);
                                mainStore.setOpenTimesheetEditModal(record)
                            }} icon={<> <EditOutlined style={{ fontSize: 20 }} /></>}>{t("actionBtn.edit")}</Button>
                        </>
                    },
                    width: 120,
                }
            ], {
                ns: t('timesheet'),
            }))
        }
    }

    const refreshData = () => {
        if (form.getFieldValue('timeSheetDate')) {
            UiUtils.setBusy();
            EmployeeTimesheetService.calculateTimesheetFromTimekeeping({
                body: {
                    id: employeeTimesheetData.id,
                    month: (form.getFieldValue('timeSheetDate') as Date).getMonth() + 1,
                    year: (form.getFieldValue('timeSheetDate') as Date).getFullYear()
                }
            }).then(result => {
                setEmployeeTimesheetData(result);
                generateColumnsByDaysInMonth(form.getFieldValue('timeSheetDate'));
                mapRowIndexData(result.listEmployeeTimesheetDetailSummary);
                setIsShowTimesheet(true);
            }).finally(UiUtils.clearBusy)
        }
    }
    const mapRowIndexData = (listEmployeeTimesheetDetailSummary?: EmployeeTimesheetDetailSummaryDto[]) => {
        if (listEmployeeTimesheetDetailSummary) {
            const data = listEmployeeTimesheetDetailSummary.map((it: EmployeeTimesheetDetailSummaryDto, index) => {
                return {
                    ...it,
                    ordRowIndex: index + 1,
                    key: it.employeeId
                }
            });
            setDataSource(data)
        }
    }
    const onOkModal = async () => {
        try {
            await form.validateFields();
            UiUtils.setBusy();
            await EmployeeTimesheetService.createOrUpdate({
                body: {
                    ...employeeTimesheetData,
                    month: (form.getFieldValue('timeSheetDate') as Date).getMonth() + 1,
                    year: (form.getFieldValue('timeSheetDate') as Date).getFullYear(),
                }
            })
                // @ts-ignore
                .then((result) => {
                    if (result) {
                        const mess = t('updateSuccess');
                        UiUtils.showSuccess(mess);
                        navigate(-1);
                    }
                })

        } catch (e) {
            UiUtils.showCommonValidateForm()
        } finally {
            UiUtils.clearBusy();
        }


    }

    const topAction: IActionBtn[] = [
        {
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined />
                    </Space>
                    {t('actionBtn.back')}
                </Button>
            </>
        },
        // {
        //     content: <>
        //         <Button type='primary' onClick={() => { onOkModal() }} hidden={employeeTimesheetData.status == 3 || employeeTimesheetData.status == 4}>
        //             <Space.Compact> <Space><SaveOutlined
        //                 className="me-1" /></Space>{t('saveModal')} (F8)</Space.Compact>
        //         </Button>
        //     </>,

        // },
    ]

    const LazyModalTimesheetEdit = lazy(
        () => import("../Form/TimesheetEditModal")
    );

    return (
        <div>
            <PageTopTitleAndAction usingCustom={true} mainTitle={t('detail')} items={[t('titlePageDetailLvl1'), t('titlePageDetailLvl2')]}>
                <>
                    <TopAction topActions={topAction} />
                </>
            </PageTopTitleAndAction>
            <Card>
                <Form autoComplete="off"
                    form={form}
                    layout='vertical'
                    clearOnDestroy
                    disabled={employeeTimesheetData.status == 3 || employeeTimesheetData.status == 4}
                    onFinish={onOkModal}
                    onFinishFailed={() => UiUtils.showCommonValidateForm()}>
                    <Row gutter={16}>
                        <ColSpanResponsive span={8}>
                            <FloatLabel label={enumTranslation('TimeUnit.Month')} required>
                                <Form.Item name='timeSheetDate' rules={[ValidateUtils.required]}>
                                    <OrdMonthInput
                                        disabled />
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>
                        {
                            (employeeTimesheetData.status == 1 || employeeTimesheetData.status == 2)
                            && <ColSpanResponsive span={12}>
                                <Space>
                                    <Button
                                        type="primary"
                                        danger
                                        icon={<CalculatorOutlined />}
                                        onClick={refreshData}
                                    >
                                        {t("refreshTimesheet")}
                                    </Button>
                                </Space>
                            </ColSpanResponsive>
                        }

                    </Row>

                    {isShowTimesheet ? <Table bordered
                        pagination={false}
                        scroll={{ x: 'max-content', y: '60vh' }}
                        sticky={{ offsetHeader: 1 }}
                        columns={columns}
                        dataSource={dataSource}
                    /> : <Result status="warning" title={t('monthReportInvalidTimesheetWarning')} />
                    }
                    <Suspense fallback={<Spin />}>
                        {mainStore.timeSheetEditModel.visible && (
                            <LazyModalTimesheetEdit stored={mainStore}></LazyModalTimesheetEdit>
                        )}
                    </Suspense>
                </Form>
            </Card>

        </div>

    );
}

export default observer(TimesheetDetailForm);
