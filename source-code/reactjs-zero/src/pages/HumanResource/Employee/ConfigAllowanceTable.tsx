import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {Checkbox, Form, FormInstance, Spin, Table, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import utils from "@ord-core/utils/utils";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { AllowanceService } from "@api/AllowanceService";
import { AllowanceDto } from "@api/index.defs";

export const ConfigAllowanceTable = (props:{
    form: FormInstance,
}) => {
    const { t } = useTranslation('allowance');

    const [loading, setLoading] = useState(true);
    const [datasource, setDatasource] = useState<AllowanceDto[]>([]);
    const {form} = props;


    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await AllowanceService.getComboOptions({});
                const lstCheck:any[] = form.getFieldValue('listAllowanceId')??[];
                const datasource = response.map((item, idx) => {
                    const data = item.data as AllowanceDto
                    const ret = {
                        id: data.id,
                        code: data.code,
                        name: data.name,
                        notes: data.notes,
                        amount: data.amount,
                        isChecked: lstCheck.findIndex(x => x == data.id) > -1
                    }
                    return ret;
                })
                setDatasource(datasource);
            } catch (error) {

            } finally {
                setLoading(false);
            }
        };
        fetchOptions().then();
    }, [form]);

    const handleCheckboxChange = (checked: boolean, record: any) => {
        const newData = datasource.map((item) =>
            item.id === record.id ? { ...item, isChecked: checked } : item
        );
        const lstCheck:any[] = form.getFieldValue('listAllowanceId')??[];
        const newLstCheck = checked
            ? [...lstCheck, record.id]
            : lstCheck.filter((id) => id !== record.id);

        setDatasource(newData);
        form.setFieldValue('listAllowanceId', newLstCheck);
    };
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: '',
            dataIndex: 'isChecked',
            align: 'center',
            width: 50,
            render: (_: any, record: any) => (
                <Checkbox
                    checked={record.isChecked || false}
                    onChange={(e) => handleCheckboxChange(e.target.checked, record)}
                />
            ),
        },
        {
            title: 'code',
            dataIndex: 'code',
            width: 150,
        },
        {
            dataIndex: 'name',
            title: 'name',
            width: 200,
            render: (text) => <TextLineClampDisplay content={text} />
        },
        {
            dataIndex: 'notes',
            title: 'notes',
            width: 200,
            render: (text) => <TextLineClampDisplay content={text} />
        },
        {
            dataIndex: 'amount',
            title: 'amount',
            align: 'right',
            width: 150,
            render: (data: string, record: AllowanceDto) => {
                return <>
                    {utils.formatterNumber(record.amount)}
                </>
            },
        },
    ], {
        actions: [],
        ns: 'allowance'
    }, true);
    
    return (<>
            { loading?(<Spin></Spin >) : (
        <Form.Item name='listAllowanceId'>
            <p style={{marginBottom: 5, fontWeight: "600"}}>{t('employeeAllowanceTitle')}</p>
                <Table pagination={false} bordered
                    columns={columns}
                    dataSource={datasource.map((row, index) => ({
                        key: index,
                        ...row
                    }))}
                />
                </Form.Item>
    )}
    </> )
}
