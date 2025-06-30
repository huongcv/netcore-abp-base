import {useCallback} from 'react';
import {Checkbox, CheckboxProps, Form, ModalProps} from 'antd';
import {useGlobalModalStore} from '@ord-components/modal/GlobalModalManager/modalStore';
import {ICommonResultDtoApi, IModifyApiService} from '@ord-components/paged-table/types';
import {ModifyModalI18nConfig, useModifyModalI18n} from '@ord-components/paged-table/hooks/useModifyModalI18n';
import uiUtils from '@ord-core/utils/ui.utils';
import UiUtils from '@ord-core/utils/ui.utils';
import {l} from "@ord-core/language/lang.utils";

export type ModifyModalMode = 'create' | 'edit' | 'viewDetail';

export interface ICrudModalFormStoreSetting {
    transformBeforeCreate?: (values: any) => void;
    transformBeforeUpdate?: (values: any, editingItem: any) => void;
    onSuccess?: (result: ICommonResultDtoApi<any>, mode: ModifyModalMode) => void;
}

export interface UseModifyModalConfig<T = any> {
    // API Service
    apiService: IModifyApiService;

    // CRUD Settings
    crudSettings?: ICrudModalFormStoreSetting;

    // Form configuration
    formFields: React.ReactNode;
    initialValues?: Record<string, any>;

    // Callbacks
    onSaved?: () => void;

    // I18n configuration
    transformNotificationParameter: (entity: any) => any;
    entityTranslationNs: string;
    i18nConfig?: ModifyModalI18nConfig;

    // Modal props
    modalProps?: Omit<ModalProps, 'onOk' | 'open' | 'onCancel'>;
}

export const useModifyModal = <T extends object>(config: UseModifyModalConfig<T>) => {
    const {
        apiService,
        crudSettings,
        formFields,
        entityTranslationNs = 'common',
        initialValues = {},
        onSaved,
        transformNotificationParameter,
        i18nConfig,
        modalProps = {}
    } = config;

    const {openModal} = useGlobalModalStore();

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

    // Submit handler với logic từ createModalFormStore
    const handleSubmit = useCallback(async (values: any, mode: ModifyModalMode, editingItem?: T) => {
        UiUtils.setBusy();
        try {
            const isCreate = mode === 'create';

            let body = isCreate ? values : {
                ...editingItem,
                ...values,
                encodedId: (editingItem as any)?.encodedId
            };

            // Apply transformations
            if (isCreate && crudSettings?.transformBeforeCreate) {
                crudSettings.transformBeforeCreate(body);
            }

            if (!isCreate && crudSettings?.transformBeforeUpdate) {
                crudSettings.transformBeforeUpdate(body, editingItem);
            }

            const result = isCreate
                ? await apiService.create({body})
                : await apiService.update({body});

            // Call success callback
            if (crudSettings?.onSuccess) {
                crudSettings.onSuccess(result, mode);
            }

            return result;
        } catch (err) {
            console.error('Modal submit error', err);
            throw err;
        } finally {
            UiUtils.clearBusy();
        }
    }, [apiService, crudSettings]);

    // Delete handler với logic từ createModalFormStore
    const handleDelete = useCallback(async (deletingItem: T) => {
        const confirmContent = getConfirmContent({
            ...transformNotificationParameter(deletingItem)
        });
        const confirmTitle = getConfirmTitle();

        return new Promise<void>((resolve) => {
            UiUtils.showConfirm({
                title: confirmTitle,
                icon: "remove",
                content: confirmContent,
                onOk: async () => {
                    if (!apiService.remove) {
                        resolve();
                        return;
                    }

                    UiUtils.setBusy();
                    try {
                        const body = {
                            encodedId: (deletingItem as any)?.encodedId
                        };
                        const result = await apiService.remove({body});

                        if (!result) {
                            resolve();
                            return;
                        }

                        if (!result.isSuccessful && result.message) {
                            uiUtils.showError(result.message);
                            resolve();
                            return;
                        }

                        if (onSaved) {
                            onSaved();
                        }

                        const successMessage = getDeleteSuccessMessage(transformNotificationParameter(deletingItem));
                        if (successMessage) {
                            uiUtils.showSuccess(successMessage);
                        }
                        resolve();
                    } catch (err) {
                        console.error('Modal delete error', err);
                        resolve();
                    } finally {
                        UiUtils.clearBusy();
                    }
                },
                onCancel: () => {
                    resolve();
                }
            });
        });
    }, [apiService, getConfirmContent, getConfirmTitle, transformNotificationParameter, getDeleteSuccessMessage, onSaved]);

    const openCreateModal = useCallback((customInitialValues?: Record<string, any>) => {
        let isAddNewContinue = false;
        const onChange: CheckboxProps['onChange'] = (e) => {
            isAddNewContinue = e.target.checked;
        };
        const renderCheckBoxAddNew = <Checkbox checked={isAddNewContinue}
                                               onChange={onChange}>
            {l.transCommon('addNewContinue')}
        </Checkbox>;
        const modalId = openModal({
            title: getTitleText('create', {}),
            width: 680,
            modalData: customInitialValues || initialValues,
            mustLoadingPageWhenSaving: true,
            ignoreHotKeys: [],
            ...modalProps,

            formRender: (modalData) => {
                return (
                    <>
                        {formFields}
                        <Form.Item name="disableHostKeyScopeForm" initialValue={false} hidden noStyle/>
                    </>
                );
            },

            onSubmit: async (formValues, modalData, modalId) => {
                try {
                    const result = await handleSubmit(formValues, 'create');
                    if (!result) {
                        return false;
                    }

                    // Handle successful save
                    if (result.isSuccessful) {
                        if (onSaved) {
                            onSaved();
                        }

                        const message = getSuccessMessage('create', transformNotificationParameter(result.data));
                        if (message) {
                            uiUtils.showSuccess(message);
                        }

                        if (isAddNewContinue) {
                            return false; // Don't close modal, reset form instead
                        }
                        return true; // Close modal
                    } else {
                        if (result.message) {
                            uiUtils.showError(result.message);
                        }
                        return false; // Don't close modal
                    }
                } catch (error) {
                    return false;
                }
            },
            footerButtons: {
                left: [renderCheckBoxAddNew],
                right: ['save'],

            }
        });

        return modalId;
    }, [
        openModal,
        getTitleText,
        initialValues,
        modalProps,
        formFields,
        handleSubmit,
        onSaved,
        getSuccessMessage,
        transformNotificationParameter
    ]);

    const openEditModal = useCallback((editingItem: T) => {
        const modalId = openModal({
            title: getTitleText('edit', transformNotificationParameter(editingItem)),
            width: 680,
            modalData: editingItem,
            mustLoadingPageWhenSaving: true,
            ignoreHotKeys: [],
            ...modalProps,

            formRender: (modalData) => {
                return (
                    <>
                        {formFields}
                    </>
                );
            },

            onSubmit: async (formValues, modalData, modalId) => {
                try {
                    const result = await handleSubmit(formValues, 'edit', editingItem);
                    if (!result) {
                        return false;
                    }

                    // Handle successful save
                    if (result.isSuccessful) {
                        if (onSaved) {
                            onSaved();
                        }

                        const message = getSuccessMessage('edit', transformNotificationParameter(result.data));
                        if (message) {
                            uiUtils.showSuccess(message);
                        }

                        return true; // Close modal
                    } else {
                        if (result.message) {
                            uiUtils.showError(result.message);
                        }
                        return false; // Don't close modal
                    }
                } catch (error) {
                    return false;
                }
            },

            footerButtons: {
                right: ['save']
            }
        });

        return modalId;
    }, [
        openModal,
        getTitleText,
        modalProps,
        formFields,
        handleSubmit,
        onSaved,
        getSuccessMessage,
        transformNotificationParameter
    ]);

    const openViewModal = useCallback((viewingItem: T) => {
        const modalId = openModal({
            title: getTitleText('viewDetail', transformNotificationParameter(viewingItem)),
            width: 680,
            modalData: viewingItem,
            mustLoadingPageWhenSaving: false,
            ignoreHotKeys: [],
            ...modalProps,
            formRender: (modalData) => {
                return (
                    <>
                        {formFields}
                    </>
                );
            }
        });

        return modalId;
    }, [
        openModal,
        getTitleText,
        modalProps,
        formFields,
        transformNotificationParameter
    ]);

    const openDeleteConfirm = useCallback((deletingItem: T) => {
        handleDelete(deletingItem);
    }, [handleDelete]);

    return {
        openCreateModal,
        openEditModal,
        openViewModal,
        openDeleteConfirm
    };
};