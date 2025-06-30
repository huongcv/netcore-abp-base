import React, {useMemo} from 'react';
import {Form} from 'antd';


// Component riêng cho Modal Content
export const ModalContent: React.FC<{
    modalData: any;
    formRender?: (data: any) => React.ReactNode;
    modalContentRender?: (data: any) => React.ReactNode;
    usedForm: any;
    formReadOnly?: boolean;
    handleFinish: () => void;
    handleFinishFailed: () => void;
    initialValues: any;
}> = React.memo(({
                     modalData,
                     formRender,
                     modalContentRender,
                     usedForm,
                     formReadOnly,
                     handleFinish,
                     handleFinishFailed,
                     initialValues
                 }) => {
    const commonFormProps = useMemo(() => ({
        form: usedForm,
        disabled: formReadOnly,
        layout: "vertical" as const,
        autoComplete: "off",
        onFinish: handleFinish,
        initialValues
    }), [usedForm, formReadOnly, handleFinish, initialValues]);

    if (modalContentRender) {
        return (
            <>
                <Form {...commonFormProps} />
                {modalContentRender(modalData)}
            </>
        );
    }

    return (
        <Form
            {...commonFormProps}
            onFinishFailed={handleFinishFailed}
        >
            {formRender?.(modalData)}
        </Form>
    );
});