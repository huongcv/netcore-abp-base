import { useTranslation } from "react-i18next";
import { Checkbox, Form, Modal, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import UiUtils from "@ord-core/utils/ui.utils";
import { EmployeeTimesheetDetailSummaryDto, TIMEKEEPING_STATUS } from "@api/index.defs";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import TimesheetStore from "@ord-store/Payroll/timesheetStore";
import tableUtil from "@ord-core/utils/table.util";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdMonthInput from "@ord-components/forms/OrdMonthInput";
import { EmployeeTimesheetService } from "@api/EmployeeTimesheetService";

function TimesheetDetailModal(prop: { stored: TimesheetStore }) {
    const { t } = useTranslation('timesheet');
    const [enumTranslation] = useTranslation('enum');
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [employeeTimesheetData, setEmployeeTimesheetData] = useState<EmployeeTimesheetDetailSummaryDto>(prop.stored.timeSheetEditModel.entityData || {});
    const { timeSheetEditModel } = prop.stored;

    useEffect(() => {
        if (timeSheetEditModel.visible) {
            const detail = timeSheetEditModel.entityData?.employeeTimesheetDetailObject || {};
            const timesheetDate: Date = new Date(timeSheetEditModel.entityData?.timesheetDate || new Date());
            form.setFieldValue('timeSheetDate', timesheetDate);

            const rows = Object.entries(detail).map(([dayKey, value]: [string, any]) => {
                const dayNumber = parseInt(dayKey.replace('day', ''), 10);
                const displayDate = new Date(timesheetDate.getFullYear(), timesheetDate.getMonth(), dayNumber);

                let fullDayWorkStatus = 0;
                let halfDayWorkStatus = 0;

                if (value.workRate == 1) fullDayWorkStatus = value.status;
                else if (value.workRate == 0.5) halfDayWorkStatus = value.status;

                return {
                    key: dayKey,
                    day: displayDate,
                    fullDayWorkStatus,
                    halfDayWorkStatus,
                    dayNumber,
                    status: value.status,
                    ...value
                };
            });
            rows.unshift({ key: "all" })
            setEmployeeTimesheetData(timeSheetEditModel.entityData);
            setDataSource(rows);
        }
    }, [timeSheetEditModel.visible]);

    const handleSelectAll = (
        record: any,
        field: 'fullDayWorkStatus' | 'halfDayWorkStatus',
        value: TIMEKEEPING_STATUS,
        checked: boolean
    ) => {
        const isFullDay = field === 'fullDayWorkStatus';
        const statusField = isFullDay ? 'fullDayWorkStatus' : 'halfDayWorkStatus';
        const otherField = isFullDay ? 'halfDayWorkStatus' : 'fullDayWorkStatus';

        setDataSource(prev =>
            prev.map(row => {
                const isAllRow = record.key === 'all';
                const isCurrentRow = row.key === record.key;

                // Bỏ qua ngày nghỉ
                if (row.status === 4) return row;
                updateEmployeeTimesheetDetail(row, field, value, checked);
                // Nếu là chọn tất cả
                if (isAllRow) {
                    if (row.key === 'all') {
                        // Toggle trạng thái cho hàng "all" khi click chính nó
                        return {
                            ...row,
                            [statusField]: row[statusField] === value ? 0 : value,
                            [otherField]: 0,
                        };
                    }

                    return {
                        ...row,
                        [statusField]: checked ? value : 0,
                        [otherField]: 0,
                    };
                }

                // Nếu chỉ là thay đổi 1 hàng cụ thể
                if (isCurrentRow) {
                    return {
                        ...row,
                        [statusField]: row[statusField] === value ? 0 : value,
                        [otherField]: 0,
                    };
                }

                return row;
            })
        );
    };

    const handleCheckboxChange = (
        record: any,
        field: 'fullDayWorkStatus' | 'halfDayWorkStatus',
        value: TIMEKEEPING_STATUS,
        checked: boolean
    ) => {
        if (record.key === "all") {
            handleSelectAll(record, field, value, checked);
            return;
        }

        //cập nhật ListEmployeeTimesheetDetail
        updateEmployeeTimesheetDetail(record, field, value, checked);

        // Cập nhật trạng thái checkbox trong dataSource
        setDataSource(prev =>
            prev.map(row => {
                if (row.key !== record.key) return row;
                value = checked ? value : 4;
                const isFullDay = field === 'fullDayWorkStatus';
                const statusField = isFullDay ? 'fullDayWorkStatus' : 'halfDayWorkStatus';
                const otherField = isFullDay ? 'halfDayWorkStatus' : 'fullDayWorkStatus';

                return {
                    ...row,
                    [statusField]: row[statusField] === value ? 0 : value,
                    [otherField]: 0
                };
            })
        );
    };

    const updateEmployeeTimesheetDetail = (record: any,
        field: 'fullDayWorkStatus' | 'halfDayWorkStatus',
        value: TIMEKEEPING_STATUS,
        checked: boolean) => {
        const workRate = field === 'fullDayWorkStatus' ? 1 : 0.5;

        if (!checked) {
            field = 'fullDayWorkStatus';
            value = 3; // Nếu bỏ chọn, đặt giá trị là 3 (KL)
        }
        if (record.key === "all") {
            return;
        }
        setEmployeeTimesheetData(prev => {
            const updated = { ...prev };
            const workDate = new Date(record.day);
            if (!updated.listEmployeeTimesheetDetail) {
                updated.listEmployeeTimesheetDetail = [];
            }

            const index = updated.listEmployeeTimesheetDetail.findIndex(item => {
                return item.workDate && new Date(item.workDate).getDate() === workDate.getDate();
            });
            const newDetail = {
                ...(index !== -1 ? updated.listEmployeeTimesheetDetail[index] : {}),
                workDate: workDate,
                status: value,
                workRate,
                employeeId: updated.employeeId,
            };

            if (index !== -1) {
                updated.listEmployeeTimesheetDetail[index] = newDetail;
            } else {
                updated.listEmployeeTimesheetDetail.push(newDetail);
            }

            return updated;
        });
    }

    const columns: TableColumnsType<any> = tableUtil.getColumns([
        {
            title: enumTranslation('TimeUnit.Day'),
            width: 120,
            render: (_, record) => {
                if (record.key === "all") {
                    return <></>
                }
                const date = new Date(record.day);
                const weekday = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(date);
                const dateStr = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
                return <div style={{ whiteSpace: 'pre-line' }}><div>{weekday}</div><div>{dateStr}</div></div>;
            },
        },
        {
            title: <>{t("1CL")}<div>(CL)</div></>,
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Checkbox
                    disabled={record.status === 4}
                    checked={record.fullDayWorkStatus === 1}
                    onChange={(e) => handleCheckboxChange(record, 'fullDayWorkStatus', 1, e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                />
            ),
        },
        {
            title: <>{t("1P")}<div>(P)</div></>,
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Checkbox
                    disabled={record.status === 4}
                    checked={record.fullDayWorkStatus === 2}
                    onChange={(e) => handleCheckboxChange(record, 'fullDayWorkStatus', 2, e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                />
            ),
        },
        {
            title: <>{t("1KL")}<div>(KL)</div></>,
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Checkbox
                    disabled={record.status === 4}
                    checked={record.fullDayWorkStatus === 3}
                    onChange={(e) => handleCheckboxChange(record, 'fullDayWorkStatus', 3, e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                />
            ),
        },
        // {
        //     title: <>{t("0.5CL")}<div>(CL)</div></>,
        //     width: 80,
        //     align: 'center',
        //     render: (_, record) => (
        //         <Checkbox
        //             disabled={record.status === 4}
        //             checked={record.halfDayWorkStatus === 1}
        //             onChange={(e) => handleCheckboxChange(record, 'halfDayWorkStatus', 1)}
        //             style={{ transform: 'scale(1.2)' }}
        //         />
        //     ),
        // },
        {
            title: <>{t("0.5P")}<div>(P)</div></>,
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Checkbox
                    disabled={record.status === 4}
                    checked={record.halfDayWorkStatus === 2}
                    onChange={(e) => handleCheckboxChange(record, 'halfDayWorkStatus', 2, e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                />
            ),
        },
        {
            title: <>{t("0.5KL")}<div>(KL)</div></>,
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Checkbox
                    disabled={record.status === 4}
                    checked={record.halfDayWorkStatus === 3}
                    onChange={(e) => handleCheckboxChange(record, 'halfDayWorkStatus', 3, e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                />
            ),
        },
    ], {}, true);

    const onOkModal = async () => {
        try {
            // Xử lý lưu logic ở đây nếu cần
            UiUtils.setBusy();
            await EmployeeTimesheetService.updateEmployeeTimesheetDetail({ body: employeeTimesheetData }).then((res) => {
                if (res.isSuccessful) {
                    UiUtils.showSuccess(t('updateDatailEmployeeTimesheetSuccess'));
                    prop.stored.closeTimesheetEditModal(true);
                } else {
                    UiUtils.showError(res.message);
                }

            }
            );

        } catch (e) {
            UiUtils.showCommonValidateForm();
        } finally {
            UiUtils.clearBusy();
        }
    };

    return (
        <Modal
            title={t('title.timeSheetEditEmployee') + timeSheetEditModel.entityData?.employeeName}
            open={timeSheetEditModel.visible}
            width={timeSheetEditModel.width}
            maskClosable={false}
            style={{ top: "30px" }}
            onCancel={() => prop.stored.closeTimesheetEditModal()}
            destroyOnClose
            footer={
                <FooterCrudModal
                    hiddenOk={timeSheetEditModel.mode === "viewDetail"}
                    onOk={onOkModal}
                    onCancel={() => prop.stored.closeTimesheetEditModal()}
                />
            }
        >
            <Form form={form}>
                <ColSpanResponsive span={8}>
                    <FloatLabel label={enumTranslation('TimeUnit.Month')} required>
                        <Form.Item name='timeSheetDate'>
                            <OrdMonthInput disabled />
                        </Form.Item>
                    </FloatLabel>
                </ColSpanResponsive>
                <Table
                    bordered
                    pagination={false}
                    scroll={{ x: 'max-content', y: '60vh' }}
                    sticky={{ offsetHeader: 1 }}
                    columns={columns}
                    dataSource={dataSource}
                />
            </Form>
        </Modal>
    );
}

export default observer(TimesheetDetailModal);
