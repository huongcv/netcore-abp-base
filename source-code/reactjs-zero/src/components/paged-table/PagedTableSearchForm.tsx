import React, {useEffect} from 'react';
import type {FormInstance} from 'antd';
import {Form, Row} from 'antd';
import uiUtils from "@ord-core/utils/ui.utils";
import {useWatch} from "antd/es/form/Form";

export interface PagedTableSearchFormProps {
    searchFields: React.ReactNode;
    form?: FormInstance;
    tableStore: ReturnType<typeof import('@ord-components/paged-table/useTableStoreFactory').createTableStore>
    initialValues?: Record<string, any>;
}

export const PagedTableSearchForm = ({
                                         searchFields,
                                         form,
                                         tableStore,
                                         initialValues,
                                     }: PagedTableSearchFormProps) => {
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
        const initial = initialValues || {};
        setSearchParams({...initial, ...values});
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
            className={'crud-search-box'}
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinishFormSearch}
            onFinishFailed={() => uiUtils.showCommonValidateForm()}
        >
            <Row gutter={[16, 8]}>
                {searchFields}
            </Row>
        </Form>
    );
};
