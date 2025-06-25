import React, {useEffect} from 'react';
import {Form, FormInstance, FormProps, Row} from 'antd';
import {useWatch} from "antd/es/form/Form";
import {debounce} from "lodash";

export interface Props extends FormProps {
    tableStore: ReturnType<typeof import('@ord-components/paged-table/useTableStoreFactory').createTableStore>;
    children: React.ReactNode;
    form?: FormInstance;
}

export const TableSearchForm: React.FC<Props> = ({
                                                     form,
                                                     tableStore,
                                                     children,
                                                     ...restProps // phần còn lại của FormProps như onValuesChange, onFieldsChange,...
                                                 }) => {
    const [internalForm] = Form.useForm();
    const usedForm = form || internalForm;
    const {setSearchParams, reset} = tableStore();

    useEffect(() => {
        onSearch().then();
    }, []);
    const onFinishFormSearch = () => {
        onSearch().then();
    }
    const onSearch = async () => {
        const values = usedForm.getFieldsValue();
        setSearchParams({...values});
    };
    const extendResetTick_w = useWatch('extendResetTick', usedForm);
    useEffect(() => {
        if (extendResetTick_w) {
            usedForm.resetFields();
            usedForm.submit();
        }
    }, [extendResetTick_w]);
    return (
        <Form
            form={usedForm}
            layout="vertical"
            onFinish={debounce((d) => {
                onFinishFormSearch()
            }, 250)}
            {...restProps}
            className={`crud-search-box ${restProps.className || ''}`}
        >
            <Row gutter={[16, 8]}>
                {children}
            </Row>
            <Form.Item hidden name={'extendResetTick'} noStyle/>
        </Form>
    );
};
