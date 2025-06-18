import React, {useEffect, useState} from 'react';
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Table, TableColumnsType, Tag} from "antd";
import {
    EmployeeTimesheetDetailDto,
} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {observer} from "mobx-react-lite";
import {CheckCircleOutlined, ExclamationCircleOutlined, StopOutlined} from "@ant-design/icons";
import DateUtil from "@ord-core/utils/date.util";
import UiUtils from "@ord-core/utils/ui.utils";

function TimesheetDetail(props: {
    timesheetId?: number | string | undefined,
    employeeId?: number | string | undefined
}) {
    const {payrollStore: stored} = useStore();
    const [data, setData] = useState<EmployeeTimesheetDetailDto[]>([]);
    const {t} = useTranslation(stored.getNamespaceLocale());
    useEffect(() => {
        if (stored) {
            UiUtils.setBusy();
            // @ts-ignore
            stored.apiService().getTimesheetByEmployee(props)
                .then(result => {
                    setData(result);
                }).finally(()=>{
                UiUtils.clearBusy();
            })
        }
    }, []);

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: "STT", // Tiêu đề cột
            dataIndex: "index",
            key: "index",
            width: 40,
            align: "center",
            render: (_: any, __: EmployeeTimesheetDetailDto, index: number) => index + 1,
        },
        {
            title: 'workDate',
            dataIndex: 'workDate',
            width: 200,
            fixed: 'left',
            align: 'center',
            sorter: false,
            render: v => (DateUtil.showWithFormat(v, "dd/MM/yyyy")),
        },
        {
            title: 'checkIn',
            dataIndex: 'checkIn',
            align: 'center',
            width: 200,
            sorter: false,
            render: v => (DateUtil.showWithFormat(v,"HH:mm"))
        },
        {
            title: 'checkOut',
            dataIndex: 'checkOut',
            align: 'center',
            width: 200,
            render: v => (DateUtil.showWithFormat(v,"HH:mm"))
        },
        {
            title: 'status',
            dataIndex: 'status',
            render: (data: number, record: EmployeeTimesheetDetailDto) => {
                return <>
                    {data == 1 && <Tag icon={<ExclamationCircleOutlined/>} color="success">
                        {t('timesheet.detail.valid')}
                    </Tag>}
                    {data == 2 && <Tag icon={<CheckCircleOutlined/>} color="success">
                        {t('timesheet.detail.authorized.leave')}
                    </Tag>}
                    {data == 3 && <Tag icon={<StopOutlined/>} color="default">
                        {t('timesheet.detail.unauthorized.leave')}
                    </Tag>}
                </>
            },
        }

    ], {
        ns: stored.getNamespaceLocale()
    }, true);

    return (
        <>
            <Table
                pagination={false}
                rowKey="rowIndex"
                bordered
                dataSource={data}
                columns={columns}
            />
        </>
    );
}
export default observer(TimesheetDetail);



