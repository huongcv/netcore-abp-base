import React, {useEffect, useState} from 'react';
import type {FormInstance, ModalProps} from 'antd';
import {Form, Modal} from 'antd';
import {FooterCrudModal} from '@ord-components/crud/FooterCrudModal';
import uiUtils from "@ord-core/utils/ui.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {ICommonResultDtoApi} from "@ord-components/paged-table/types";
import {useHotkeys} from "react-hotkeys-hook";
import {useModifyModalI18n, ModifyModalI18nConfig} from './useModifyModalI18n';

export interface ModifyModalFormProps<T = any>
    extends Omit<ModalProps, 'onOk' | 'open' | 'onCancel'> {
    modalStore: ReturnType<typeof import('@ord-components/paged-table/useModalFormStoreFactory').createModalFormStore>;
    tableStore?: ReturnType<typeof import('@ord-components/paged-table/useTableStoreFactory').createTableStore>;
    formFields: React.ReactNode;
    form?: FormInstance;
    initialValues?: Record<string, any>;
    onSaved?: () => void;
    transformNotificationParameter: (entity: any) => any;
    entityTranslationNs: string; // namespace cho đa ngữ
    // Cấu hình đa ngữ mở rộng
    i18nConfig?: ModifyModalI18nConfig;
}

export const ModifyModalForm = <T extends object>({
                                                      modalStore,
                                                      formFields,
                                                      form,
                                                      entityTranslationNs = 'common',
                                                      initialValues = {},
                                                      tableStore,
                                                      onSaved,
                                                      transformNotificationParameter,
                                                      i18nConfig,
                                                      ...modalProps
                                                  }: ModifyModalFormProps<T>) => {
    const {open, editingItem, deletingItem, mode, close, onSubmit, onDelete} = modalStore();
    const [internalForm] = Form.useForm();
    const usedForm = form || internalForm;
    const [isAddNewContinue, setIsAddNewContinue] = useState(false);
    const [saving, setSaving] = useState(false);
    const {onLoadData: tableOnLoadData, setReloadStatusCounter} = tableStore?.() || {};
    const isView = mode === 'viewDetail';

    // Sử dụng hook đa ngữ
    const {
        getTitleText,
        getSuccessMessage,
        getDeleteSuccessMessage,
        getConfirmContent,
        getConfirmTitle
    } = useModifyModalI18n({
        entityTranslationNs,
        i18nConfig
    });

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
            await reloadStateTable();

            const message = getSuccessMessage(mode, result.data, transformNotificationParameter);
            if (message) {
                uiUtils.showSuccess(message);
            }

            if (isAddNewContinue) {
                usedForm.resetFields();
                return;
            }
            closeModal();
        } else {
            if (result.message) {
                uiUtils.showError(result.message);
            }
        }
    };

    const reloadStateTable = async () => {
        if (tableOnLoadData) {
            try {
                await tableOnLoadData();
            } catch {
            }
        }
        if (setReloadStatusCounter) {
            setReloadStatusCounter();
        }
        if (onSaved) {
            onSaved();
        }
    };

    const onOkModal = () => {
        usedForm?.submit();
    };

    const closeModal = () => {
        close();
        usedForm.resetFields();
    };

    const renderTitle = () => {
        return getTitleText(mode, editingItem);
    };

    useEffect(() => {
        if (!!deletingItem) {
            const confirmContent = getConfirmContent(deletingItem);
            const confirmTitle = getConfirmTitle();

            UiUtils.showConfirm({
                title: confirmTitle,
                icon: "remove",
                content: confirmContent,
                onOk: (d) => {
                    onDelete().then((result) => {
                        if (!result) {
                            return;
                        }
                        if (!result.isSuccessful && result.message) {
                            uiUtils.showError(result.message);
                            close();
                            return;
                        }
                        reloadStateTable().then();

                        const successMessage = getDeleteSuccessMessage(deletingItem, transformNotificationParameter);
                        if (successMessage) {
                            uiUtils.showSuccess(successMessage);
                        }
                        close();
                    });
                },
                onCancel: () => {
                    close();
                }
            });
        }
    }, [deletingItem]);

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

    return (
        <Modal
            open={open}
            onCancel={closeModal}
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
                    onCancel={closeModal}
                />
            }
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
                disabled={isView}
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
        </Modal>
    );
};