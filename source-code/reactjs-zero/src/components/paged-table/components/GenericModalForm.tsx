import React, {useEffect, useState} from 'react';
import type {FormInstance, ModalProps} from 'antd';
import {Form, Modal} from 'antd';
import {FooterCrudModal} from '@ord-components/crud/FooterCrudModal';
import uiUtils from "@ord-core/utils/ui.utils";
import {useHotkeys} from "react-hotkeys-hook";
import {useTranslation} from "react-i18next";
import {UseBoundStore} from "zustand/react";
import {StoreApi} from "zustand/vanilla";
import {ModalFormState} from "@ord-components/paged-table/hooks/useModalStoreFactory";

export interface Props<T = any>
    extends Omit<ModalProps, 'onOk' | 'open' | 'onCancel'> {
    modalStore: UseBoundStore<StoreApi<ModalFormState<T>>>;
    formFields?: React.ReactNode;
    form?: FormInstance;
    initialValues?: Record<string, any>;
    onSave?: (formValue: any) => Promise<boolean>;
    children?: any;
    hiddenOk?: boolean;
}

export const GenericModalForm = <T extends object>({
                                                       modalStore,
                                                       formFields,
                                                       form,
                                                       initialValues = {},
                                                       onSave,
                                                       children,
                                                       hiddenOk,
                                                       ...modalProps
                                                   }: Props<T>) => {
    const {open, close, dataItem} = modalStore();
    const [internalForm] = Form.useForm();
    const usedForm = form || internalForm;
    const [isAddNewContinue, setIsAddNewContinue] = useState(false);
    const [saving, setSaving] = useState(false);

    const {t} = useTranslation();

    useEffect(() => {
        if (open) {
            usedForm.setFieldsValue(dataItem || {});
        } else {
            usedForm.resetFields();
            setIsAddNewContinue(false);
        }
    }, [open]);

    const handleFinish = async () => {
        if (!onSave) {
            return;
        }
        if (saving) {
            return;
        }
        setSaving(true);
        try {
            const values = await usedForm.validateFields();

            const result = await onSave(values);
            if (!result) {
                return;
            }
            close();
        } catch {

        } finally {
            setSaving(false);
        }
    };

    const onOkModal = () => {
        usedForm?.submit();
    };

    const closeModal = () => {
        close();
        usedForm.resetFields();
    };

    const disableHostKeyScopeForm_w = Form.useWatch('disableHostKeyScopeForm', usedForm);
    useHotkeys('F8', (event) => {
        if (open && usedForm && !disableHostKeyScopeForm_w) {
            usedForm.validateFields()
                .then(() => {
                    onOkModal();
                    event.preventDefault();
                }).catch(() => {
            });
        }
    }, {
        enableOnFormTags: true,
        enabled: !disableHostKeyScopeForm_w
    });

    useHotkeys('F10', (event) => {
        close();
        event.preventDefault();
    }, {
        enableOnFormTags: true,
        enabled: !disableHostKeyScopeForm_w
    });
    const defaultFooter = (
        <FooterCrudModal
            hasAddNewContinue={false}
            onOk={onOkModal}
            onCancel={closeModal}
            hiddenOk={hiddenOk}
        />
    );

    return (
        <Modal
            open={open}
            onCancel={closeModal}
            onOk={handleFinish}
            maskClosable={false}
            destroyOnHidden={true}
            footer={defaultFooter}
            width={680}
            style={{
                top: '30px'
            }}
            {...modalProps}
        >
            <Form
                autoComplete="off"
                layout='vertical'
                clearOnDestroy
                form={usedForm}
                onFinish={handleFinish}
                onFinishFailed={() => {
                    setSaving(false);
                    uiUtils.showCommonValidateForm();
                }}
                initialValues={initialValues}
            >
                {formFields}
                <Form.Item name={'disableHostKeyScopeForm'} initialValue={false} hidden noStyle></Form.Item>
            </Form>
            {children}
        </Modal>
    );
};