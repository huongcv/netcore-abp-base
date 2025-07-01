import React from 'react';
import {Form, FormInstance} from 'antd';
import UiUtils from '@ord-core/utils/ui.utils';

type UseRenderFormModalContentProps<T> = {
    formFields: React.ReactNode;
    onFinish: (values: T, form: FormInstance) => Promise<void>;
    initialValues?: Record<string, any>;
    disabled?: boolean;
};

export function useRenderFormModalContent<T = any>({
                                                       formFields,
                                                       onFinish,
                                                       initialValues = {},
                                                       disabled = false,
                                                   }: UseRenderFormModalContentProps<T>) {
    return (internalForm: FormInstance) => (
        <Form
            form={internalForm}
            clearOnDestroy
            initialValues={initialValues}
            autoComplete="off"
            layout="vertical"
            disabled={disabled}
            onFinishFailed={() => {
                UiUtils.showCommonValidateForm();
            }}
            onFinish={async (formValues) => {
                await onFinish(formValues, internalForm);
            }}
        >
            {formFields}
            <Form.Item noStyle name="encodedId"/>
            <Form.Item noStyle name={['extendUi', 'modifyMode']}/>
        </Form>
    );
}
