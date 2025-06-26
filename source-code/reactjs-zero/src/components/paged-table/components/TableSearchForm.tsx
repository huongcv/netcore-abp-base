import React, {useCallback, useEffect, useMemo} from 'react';
import {Form, FormInstance, FormProps, Row} from 'antd';
import {debounce} from 'lodash';
import type {TableStoredState} from '@ord-components/paged-table/hooks/useTableStoreFactory';
import type {StoreApi, UseBoundStore} from 'zustand';

export interface TableSearchFormProps extends FormProps {
    tableStore: UseBoundStore<StoreApi<TableStoredState>>;
    children: React.ReactNode;
    form?: FormInstance;
}

export const TableSearchForm: React.FC<TableSearchFormProps> = ({
                                                                    form,
                                                                    tableStore,
                                                                    children,
                                                                    ...restProps
                                                                }) => {
    const [internalForm] = Form.useForm();
    const usedForm = form || internalForm;
    const {setSearchParams, onLoadData, setReloadStatusCounter} = tableStore();

    // Memoize search function để tránh re-create
    const onSearch = useCallback(async () => {
        const values = usedForm.getFieldsValue();
        setSearchParams({...values});
    }, [usedForm, setSearchParams]);

    // Memoize debounced finish handler
    const debouncedFinish = useMemo(
        () => debounce(() => {
            onSearch();
        }, 250),
        [onSearch]
    );

    // Initial load
    useEffect(() => {
        onSearch();
    }, [onSearch]);

    // Signal listeners với Form.useWatch
    const resetSearchParameter = Form.useWatch(['extendUI', 'onResetSearchParameter'], usedForm);
    const reloadTableData = Form.useWatch(['extendUI', 'onLoadDataTable'], usedForm);
    const reloadStatusCounter = Form.useWatch(['extendUI', 'reloadStatusCounter'], usedForm);

    // Handle reset signal
    useEffect(() => {
        if (resetSearchParameter > 0) {
            usedForm.resetFields();
            usedForm.submit();
        }
    }, [resetSearchParameter, usedForm]);

    // Handle reload table data signal
    useEffect(() => {
        if (reloadTableData > 0) {
            onLoadData();
        }
    }, [reloadTableData, onLoadData]);

    // Handle reload status counter signal
    useEffect(() => {
        if (reloadStatusCounter > 0) {
            setReloadStatusCounter();
        }
    }, [reloadStatusCounter, setReloadStatusCounter]);

    // Cleanup debounced function
    useEffect(() => {
        return () => {
            debouncedFinish.cancel();
        };
    }, [debouncedFinish]);

    const className = useMemo(() =>
            `crud-search-box ${restProps.className || ''}`.trim(),
        [restProps.className]
    );

    return (
        <Form
            form={usedForm}
            layout="vertical"
            onFinish={debouncedFinish}
            {...restProps}
            className={className}
        >
            <Row gutter={[16, 8]}>
                {children}
            </Row>

            {/* Signal fields */}
            <Form.Item noStyle name={['extendUI', 'onResetSearchParameter']} initialValue={0}/>
            <Form.Item noStyle name={['extendUI', 'onLoadDataTable']} initialValue={0}/>
            <Form.Item noStyle name={['extendUI', 'reloadStatusCounter']} initialValue={0}/>
        </Form>
    );
};