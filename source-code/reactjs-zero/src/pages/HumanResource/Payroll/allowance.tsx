import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from 'react';
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {
    Button,
    Form,
    FormInstance, Input,
    InputNumber,
    Popconfirm,
    Space,
    Table,
    TableColumnsType,
} from "antd";
import {
    EmployeePayrollDetailPayslipDto, TIMESHEET_STATUS,
} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {observer} from "mobx-react-lite";
import {
    DeleteOutlined
} from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import TextArea from "antd/lib/input/TextArea";
import "./allowance.scss"
import Utils from "@ord-core/utils/utils";
import DateUtil from "@ord-core/utils/date.util";

interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}
interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}
interface EditableRowProps {
    index: number;
}

const AllowanceByEmployee = forwardRef((props: {
    employeeId?: number | string | undefined,
    payrollDetailId?: number | string | undefined,
    status?: TIMESHEET_STATUS | number | undefined,
    form: FormInstance
}, ref) => {
    const {payrollStore: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const [data, setData] = useState<EmployeePayrollDetailPayslipDto[]>([]);
    useEffect(() => {
        if (stored) {
            UiUtils.setBusy();
            // @ts-ignore
            stored.apiService().getAllowanceByEmployee(props)
                // @ts-ignore
                .then(result => {
                    setData(result);
                }).finally(() => {
                UiUtils.clearBusy();
            })
        }
    }, []);
    // Dùng useImperativeHandle để expose các phương thức cho parent
    useImperativeHandle(ref, () => ({
        getValue: () => data, // Phương thức này sẽ được parent gọi
    }));
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            width: 40,
            align: "center",
            render: (_: any, __: EmployeePayrollDetailPayslipDto, index: number) => index + 1,
        },
        {
            title: 'AllowanceName',
            fixed: 'left',
            dataIndex: "name",
            width: 330,
            sorter: false,
            onCell: (record: EmployeePayrollDetailPayslipDto) => ({
                record,
                // @ts-ignore
                editable: props.status !== 3 && props.status!==4,
                dataIndex: "name",
                title: "AllowanceName",
                handleSave,
            }),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            width: 200,
            align: 'end',
            sorter: false,
            render: v => (Utils.formatterNumber(v)),
            onCell: (record: EmployeePayrollDetailPayslipDto) => ({
                record,
                // @ts-ignore
                editable: props.status !== 3 && props.status!==4,
                dataIndex: "amount",
                title: "Amount",
                handleSave,
            }),

        },
        {
            title: 'Note',
            dataIndex: 'notes',
            sorter: false,
        },
        {
            align: 'center',
            width: 40,
            sorter: false,
            hidden:  props.status === 3 || props.status===4,
            render: (_, record: EmployeePayrollDetailPayslipDto, index: number) =>
                data.length >= 1 ? (
                    <Popconfirm title="Bạn chắc chắn xóa?" onConfirm={() => handleDelete(index)}>
                        <DeleteOutlined/>
                    </Popconfirm>
                ) : null,
        }

    ], {
        ns: stored.getNamespaceLocale()
    }, true);

    const EditableContext = React.createContext<FormInstance<any> | null>(null);
    const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const handleDelete = (index: number) => {
        const newData = data.filter((_, i) => i !== index);
        // @ts-ignore
        const totalAllowance = newData.reduce((sum, item) => sum + item?.amount, 0);
        props.form.setFieldValue("allowanceAmount", totalAllowance);
        const actualSalaryAmount = props.form.getFieldValue("actualSalaryAmount");
        props.form.setFieldValue("totalSalaryAmount", actualSalaryAmount + totalAllowance);
        setData(newData);
    };


    const handleSave = (row: EmployeePayrollDetailPayslipDto) => {
        const newData = [...data];
        const index = newData.findIndex((item) => row.name === item.name);
        // if(index < 0) {
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setData(newData);
        // @ts-ignore
        const totalAllowance = newData.reduce((sum, item) => sum + item?.amount, 0);
        props.form.setFieldValue("allowanceAmount", totalAllowance);
        const actualSalaryAmount = props.form.getFieldValue("actualSalaryAmount");
        props.form.setFieldValue("totalSalaryAmount", actualSalaryAmount + totalAllowance);
        // }else {
        //     UiUtils.showError(t('existAllowance'));
        // }
    };

    const handleAdd = () => {
        const index = data.findIndex((item) => item.name === undefined);
        if (index < 0) {
            // @ts-ignore
            const newData: EmployeePayrollDetailPayslipDto = {
                // @ts-ignore
                name: undefined,
                // @ts-ignore
                employeeId: props.employeeId,
                amount: 0,
                notes: undefined
            };
            setData([...data, newData]);
        } else {
            UiUtils.showError(t('choiceAllowanceToContinue'));
        }
    };

    const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                    title,
                                                                                    editable,
                                                                                    children,
                                                                                    dataIndex,
                                                                                    record,
                                                                                    handleSave,
                                                                                    ...restProps
                                                                                }) => {

        const form = useContext(EditableContext)!;

        useEffect(() => {
            if (record)
                form.setFieldValue(dataIndex, record[dataIndex])
        }, [dataIndex, record]);


        const save = async () => {
            const values = await form.validateFields();
            handleSave({...record, ...values});
        };

        let childNode = children;
        if (editable) {
            // @ts-ignore
            if (dataIndex === "amount") {
                childNode = (
                    <Space.Compact style={{marginBottom: '0px !important', width: '100%'}}>
                        <Form.Item style={{marginBottom: '0px !important', width: '100%'}} name={dataIndex}>
                            <InputNumber
                                disabled
                                step={1000}
                                onPressEnter={save} onBlur={save}
                                precision={2}
                                formatter={Utils.formatterNumberInput}
                                className={"w-full"}></InputNumber>
                        </Form.Item>
                    </Space.Compact>
                );
            } else { // @ts-ignore
                if (dataIndex === "name") {
                    childNode = (
                        <Space.Compact style={{marginBottom: '0px !important', width: '100%'}}>
                            <Form.Item style={{marginBottom: '0px !important', width: '100%'}} name={dataIndex}>
                                <Input onPressEnter={save} onBlur={save} disabled></Input>
                            </Form.Item>
                        </Space.Compact>
                    );
                } else {
                    childNode = (<Space.Compact style={{marginBottom: '0px !important', width: '100%'}}>
                        <Form.Item style={{marginBottom: '0px !important', width: '100%'}} name={dataIndex}>
                            <TextArea className={"w-full"} rows={1} onPressEnter={save} onBlur={save} disabled/>
                        </Form.Item>
                    </Space.Compact>);
                }
            }
        }
        return <td {...restProps}>{childNode}</td>;
    };

    return (
        <>
            <Table<EmployeePayrollDetailPayslipDto>
                pagination={false}
                rowKey="rowIndex"
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={data}
                columns={columns}
            />
            {/* {props.status !== 3 && props.status !== 4 && <Button onClick={handleAdd} type="primary" style={{marginTop: 5}}>
                Thêm phụ cấp
            </Button>
            } */}
        </>
    );
});

export default observer(AllowanceByEmployee);



