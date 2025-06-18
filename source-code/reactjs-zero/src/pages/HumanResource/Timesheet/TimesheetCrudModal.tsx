import { useTranslation } from "react-i18next";
import { Button, Form, Input, Modal, Result, Row, Space, Table } from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import React, { useEffect, useState } from "react";
import { useStore } from "@ord-store/index";
import { observer } from "mobx-react-lite";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import OrdMonthInput from "@ord-components/forms/OrdMonthInput";
import TableUtil from "@ord-core/utils/table.util";
import { ColumnType } from "antd/es/table/interface";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import UiUtils from "@ord-core/utils/ui.utils";
import { EmployeeTimesheetService } from "@api/EmployeeTimesheetService";
import { EmployeeTimesheetDetailSummaryDto, EmployeeTimesheetDto } from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import DateUtil from "@ord-core/utils/date.util";
import { CalculatorOutlined } from "@ant-design/icons";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { CheckIn } from "@ord-components/icon/CheckIn";
import { CheckOut } from "@ord-components/icon/CheckOut";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import OrdDateInput from "@ord-components/forms/OrdDateInput";


function TimesheetCrudModal() {

    const { t } = useTranslation('timesheet');
    const [enumTranslation] = useTranslation('enum');
    const { timesheetStore: stored } = useStore();
    const { createOrUpdateModal } = stored;
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<EmployeeTimesheetDetailSummaryDto[]>([]);

    const [columns, setColumns] = useState<ColumnType<any>[]>([]);
    const [isShowTimesheet, setIsShowTimesheet] = useState(false);
    const timeSheetDate_w = Form.useWatch('timeSheetDate', form);

    useEffect(() => {

        if (createOrUpdateModal.mode === 'addNew') {
            refreshData();
        }
    }, [Form.useWatch('timeSheetDate', form)])

    useEffect(() => {

        if (createOrUpdateModal.mode === 'update' || createOrUpdateModal.mode === 'viewDetail') {
            UiUtils.setBusy();
            EmployeeTimesheetService.getById({
                idHash: createOrUpdateModal.entityData?.idHash
            }).then((result: EmployeeTimesheetDto) => {
                createOrUpdateModal.entityData = result;
                if (result?.startDate) {

                    form.setFieldsValue({
                        timeSheetDate: new Date(result?.startDate)
                    });
                }
                generateColumnsByDaysInMonth(form.getFieldValue('timeSheetDate'));
                mapRowIndexData(result.listEmployeeTimesheetDetailSummary);
                setIsShowTimesheet(true);
            }).finally(UiUtils.clearBusy)
        }
    }, [])

    const generateColumnsByDaysInMonth = (date: Date | null) => {
        if (date) {
            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

            let dayColumn: any = [];

            for (let day = 1; day <= daysInMonth; day++) {
                dayColumn.push({
                    dataIndex: 'employeeId',
                    title: day.toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0'),
                    width: 80,
                    align: 'center',
                    render: (data: number, record: EmployeeTimesheetDetailSummaryDto) => {
                        // @ts-ignore
                        const timesheetDetail: any = record.employeeTimesheetDetailObject['day' + day];
                        let resultTemp = <></>;
                        if (timesheetDetail?.status === 1) {
                            resultTemp = <>
                                <div>
                                    {timesheetDetail.checkIn && <><CheckIn width={'16px'} /> <span
                                        style={{ color: timesheetDetail.lateInMinutes ? 'red' : 'green' }}>{DateUtil.toFormat(timesheetDetail.checkIn, 'HH:mm')}</span></>}
                                </div>
                                <div>{timesheetDetail.checkOut && <><CheckOut width={'16px'} /> <span
                                    style={{ color: timesheetDetail.earlyOutMinutes ? 'red' : 'green' }}>{DateUtil.toFormat(timesheetDetail.checkOut, 'HH:mm')}</span></>}
                                </div>
                            </>;
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

            ], {
                ns: stored.getNamespaceLocale()
            }))
        }
    }

    const refreshData = () => {
        if (form.getFieldValue('timeSheetDate')) {
            UiUtils.setBusy();
            EmployeeTimesheetService.calculateTimesheetFromTimekeeping({
                body: {
                    id: createOrUpdateModal.entityData?.id,
                    month: (form.getFieldValue('timeSheetDate') as Date).getMonth() + 1,
                    year: (form.getFieldValue('timeSheetDate') as Date).getFullYear()
                }
            }).then(result => {
                createOrUpdateModal.entityData = result;
                generateColumnsByDaysInMonth(form.getFieldValue('timeSheetDate'));
                form.setFieldValue('startDate', result.startDate);
                form.setFieldValue('endDate', result.endDate);
                form.setFieldValue("timesheetName", result.name);
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

            await stored.createEntity({
                ...createOrUpdateModal.entityData,
                month: (form.getFieldValue('timeSheetDate') as Date).getMonth() + 1,
                year: (form.getFieldValue('timeSheetDate') as Date).getFullYear(),
            })
                // @ts-ignore
                .then((result) => {
                    if (result) {
                        const mess = createOrUpdateModal.mode === 'addNew' ? t('addNewSuccess') : t('updateSuccess');
                        UiUtils.showSuccess(mess);
                        stored.closeModal(true);
                    }
                })

        } catch (e) {
            UiUtils.showCommonValidateForm()
        } finally {
            UiUtils.clearBusy();
        }


    }

    useHotkeys('F8', (event) => {
        onOkModal();
        event.preventDefault();
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });


    useHotkeys('F10', (event) => {
        stored.closeModal();
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });


    return (
        <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
            <Modal
                title={t('title.' + createOrUpdateModal!.mode)}
                open={createOrUpdateModal.visible}
                width={createOrUpdateModal.width}
                maskClosable={false}
                style={{ top: "30px" }}
                onCancel={() => stored.closeModal()}
                destroyOnClose
                footer={
                    <FooterCrudModal
                        hiddenOk={createOrUpdateModal.mode === "viewDetail"}
                        onOk={onOkModal}
                        onCancel={() => stored.closeModal()}
                    />
                }
            >
                <Form autoComplete="off"
                    form={form}
                    layout='vertical'
                    clearOnDestroy
                    disabled={createOrUpdateModal.mode === 'viewDetail'}
                    onFinish={onOkModal}
                    onFinishFailed={() => UiUtils.showCommonValidateForm()}>
                    <Row gutter={16}>
                        <ColSpanResponsive span={24}>
                            <FloatLabel label={enumTranslation('TimeUnit.Month')} required>
                                <Form.Item name='timeSheetDate' rules={[ValidateUtils.required]}>
                                    <OrdMonthInput
                                        onChange={(value) => {
                                            if (!value) {
                                                form.setFieldValue('startDate', null);
                                                form.setFieldValue('endDate', null);
                                                form.setFieldValue("timesheetName", null);
                                            }
                                        }}
                                        disabled={(createOrUpdateModal.mode === 'update' || createOrUpdateModal.mode === 'viewDetail')} />
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>
                        {
                            timeSheetDate_w &&
                            <>
                                <ColSpanResponsive span={24}>
                                    <FloatLabel label={t("timesheetName")}>
                                        <Form.Item name="timesheetName">
                                            <Input disabled />
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={12}  >
                                    <FloatLabel label={t('startDate')} >
                                        <Form.Item name='startDate' >
                                            <OrdDateInput disabled></OrdDateInput>
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                                <ColSpanResponsive span={12}>
                                    <FloatLabel label={t('endDate')} >
                                        <Form.Item name='endDate' >
                                            <OrdDateInput disabled></OrdDateInput>
                                        </Form.Item>
                                    </FloatLabel>
                                </ColSpanResponsive>
                            </>
                        }

                        {/* {
                            (createOrUpdateModal.mode === 'addNew' || createOrUpdateModal.mode === 'update')
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
                        } */}

                    </Row>
                    {/*                     
                    {isShowTimesheet ? <Table bordered
                        pagination={false}
                        scroll={{ x: 'max-content', y: '60vh' }}
                        sticky={{ offsetHeader: 1 }}
                        columns={columns}
                        dataSource={dataSource}
                    /> : <Result status="warning" title={t('monthReportInvalidTimesheetWarning')} />
                    } */}

                </Form>
            </Modal>
        </HotkeysProvider>
    );
}

export default observer(TimesheetCrudModal);
