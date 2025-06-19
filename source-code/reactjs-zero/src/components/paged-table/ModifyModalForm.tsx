import React, {useEffect, useState} from 'react';
import type {FormInstance, ModalProps} from 'antd';
import {Form, Modal} from 'antd';
import {FooterCrudModal} from '@ord-components/crud/FooterCrudModal';
import {useTranslation} from "react-i18next";
import uiUtils from "@ord-core/utils/ui.utils";
import {ICommonResultDtoApi} from "@ord-components/paged-table/types";

export interface ModifyModalFormProps<T = any>
    extends Omit<ModalProps, 'onOk' | 'open' | 'onCancel'> {
    modalStore: ReturnType<typeof import('@ord-components/paged-table/useModalFormStoreFactory').createModalFormStore>;
    tableStore?: ReturnType<typeof import('@ord-components/paged-table/useTableStoreFactory').createTableStore>;
    formFields: React.ReactNode;
    form?: FormInstance;
    translationNs?: string; // namespace cho đa ngữ
    initialValues?: Record<string, any>;
}

export const ModifyModalForm = <T extends object>({
                                                      modalStore,
                                                      formFields,
                                                      form,
                                                      translationNs = 'common', // mặc định namespace là 'common'
                                                      initialValues = {},
                                                      tableStore,
                                                      ...modalProps
                                                  }: ModifyModalFormProps<T>) => {
    const {t} = useTranslation(['modify-modal']);
    const {open, editingItem, mode, close, onSubmit} = modalStore();
    const [internalForm] = Form.useForm();
    const usedForm = form || internalForm;
    const [isAddNewContinue, setIsAddNewContinue] = useState(false);
    const [saving, setSaving] = useState(false);

    const isView = mode === 'viewDetail';

    useEffect(() => {
        if (open) {
            usedForm.setFieldsValue(editingItem || {});
        } else {
            usedForm.resetFields();
            setIsAddNewContinue(false);
        }
    }, [open]);

    const handleFinish = async () => {
        if (saving) {
            return;
        }
        setSaving(true);
        const values = await usedForm.validateFields();
        const result = await onSubmit(values);
        if (!result) {
            return;
        }
        await handlerAfterSaved(result);
        setSaving(false);
    };
    const handlerAfterSaved = async (result: ICommonResultDtoApi<any>) => {
        if (result.isSuccessful) {
            if (tableStore) {
                try {
                    await tableStore.getState().onLoadData();
                } catch {

                }

            }
            const titlePrefix = translationNs + '.success.';
            const key = {
                create: titlePrefix + 'create',
                edit: titlePrefix + 'edit',
                viewDetail: titlePrefix + 'view',
            }[mode];
            const message = t(key, result.data);
            uiUtils.showSuccess(message);
            if (isAddNewContinue) {
                usedForm.resetFields();
                return;
            }
            close();
        } else {
            if (result.message) {
                uiUtils.showError(result.message);
            }
        }
    }

    const onOkModal = () => {
        usedForm?.submit();
    };

    const closeModalCrud = () => {
        close();
        usedForm.resetFields();
    };
    const renderTitle = () => {
        const titlePrefix = translationNs + '.title.';
        const key = {
            create: titlePrefix + 'create',
            edit: titlePrefix + 'edit',
            viewDetail: titlePrefix + 'view',
        }[mode];

        return t(key, editingItem || {}) || '---';
    };

    return (
        <Modal
            open={open}
            onCancel={closeModalCrud}
            onOk={handleFinish}
            maskClosable={false}
            destroyOnClose
            title={renderTitle()}
            footer={
                <FooterCrudModal
                    hasAddNewContinue={mode === 'create'}
                    isAddNewContinue={isAddNewContinue}
                    isAddNewContinueChange={setIsAddNewContinue}
                    hiddenOk={isView}
                    onOk={onOkModal}
                    onCancel={closeModalCrud}
                />
            }
            width={680}
            style={{
                top: '30px'
            }}
            {...modalProps}
        >
            <Form autoComplete="off" layout='vertical' clearOnDestroy form={usedForm}
                  disabled={isView}
                  onFinish={handleFinish}
                  onFinishFailed={() => {
                      setSaving(false);
                      uiUtils.showCommonValidateForm();
                  }}
                  initialValues={initialValues}>
                {formFields}
            </Form>
        </Modal>
    );
};
