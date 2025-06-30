import {useCallback, useRef} from 'react';
import {Form, ModalProps} from 'antd';
import {useGlobalModalStore} from './useGlobalModalStore';
import {ICommonResultDtoApi, IModifyApiService} from '@ord-components/paged-table/types';
import {ModifyModalI18nConfig, useModifyModalI18n} from '@ord-components/paged-table/hooks/useModifyModalI18n';
import {OrdModalFooter} from '@ord-components/modal/footer/OrdModalFooter';
import {OrdModalSaveButton} from '@ord-components/modal/footer/buttons/OrdModalSaveButton';
import UiUtils from '@ord-core/utils/ui.utils';

export interface UseModifyModalConfig<T = any> {
    apiService: IModifyApiService;
    crudSettings?: {
        transformBeforeCreate?: (values: any) => void;
        transformBeforeUpdate?: (values: any, editingItem: any) => void;
        onSuccess?: (result: ICommonResultDtoApi<any>, mode: 'create' | 'edit') => void;
    };
    formFields: React.ReactNode;
    initialValues?: Record<string, any>;
    onSaved?: () => void;
    transformNotificationParameter: (entity: any) => any;
    entityTranslationNs: string;
    i18nConfig?: ModifyModalI18nConfig;
    modalProps?: Omit<ModalProps, 'onOk' | 'open' | 'onCancel'>;
}

export const useModifyEntityModal = <T extends object>(config: UseModifyModalConfig<T>) => {
    const {openModal, closeModal} = useGlobalModalStore();
    const {
        apiService,
        crudSettings,
        formFields,
        entityTranslationNs = 'common',
        onSaved,
        transformNotificationParameter,
        i18nConfig,
        modalProps = {},
    } = config;

    const {
        getTitleText,
        getSuccessMessage,
        getDeleteSuccessMessage,
        getConfirmContent,
        getConfirmTitle,
    } = useModifyModalI18n({entityTranslationNs, i18nConfig});
    const isSubmittingRef = useRef(false);
    const renderFooter = (onClose: () => void, internalForm: any) => (
        <OrdModalFooter
            onClose={onClose}
            right={[<OrdModalSaveButton key="save" onSubmit={() => internalForm.submit()}/>]}
        />
    );

    const renderFormModalContent = (
        initialValues: any,
        onFinish: (values: T) => Promise<void>,
        disabled = false
    ) => (internalForm: any) => (
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
            onFinish={onFinish}
        >
            {formFields}
            {!disabled && <Form.Item noStyle name="encodedId"/>}
        </Form>
    );

    const openCreateModal = useCallback((customInitialValues: Record<string, any> = {}) => {
        let modalId: string;
        modalId = openModal({
            title: getTitleText('create', {}),
            modalProps,
            renderModalContent: renderFormModalContent(customInitialValues, async (values) => {
                if (isSubmittingRef.current) return;
                isSubmittingRef.current = true;
                UiUtils.setBusy();
                try {
                    let body = values;
                    crudSettings?.transformBeforeCreate?.(body);
                    const result = await apiService.create({body});
                    if (result.isSuccessful) {
                        UiUtils.showSuccess(getSuccessMessage('create', transformNotificationParameter(result.data)));
                        onSaved?.();
                        crudSettings?.onSuccess?.(result, 'create');
                        closeModal(modalId);
                    } else result.message && UiUtils.showError(result.message);
                } catch (err) {
                } finally {
                    isSubmittingRef.current = false;
                    UiUtils.clearBusy();
                }
            }),
            renderModalFooter: renderFooter,
        }, 'MODAL_ENTITY_' + entityTranslationNs);
        return modalId;
    }, [apiService, crudSettings, onSaved]);

    const openEditModal = useCallback((editingItem: Record<string, any> = {}) => {
        let modalId: string;
        modalId = openModal({
            title: getTitleText('edit', transformNotificationParameter(editingItem)),
            modalProps,
            renderModalContent: renderFormModalContent(editingItem, async (values) => {
                if (isSubmittingRef.current) return;
                isSubmittingRef.current = true;
                UiUtils.setBusy();
                try {
                    let body = values;
                    crudSettings?.transformBeforeUpdate?.(body, editingItem);
                    const result = await apiService.update({body});
                    if (result.isSuccessful) {
                        UiUtils.showSuccess(getSuccessMessage('edit', transformNotificationParameter(result.data)));
                        onSaved?.();
                        crudSettings?.onSuccess?.(result, 'edit');
                        closeModal(modalId);
                    } else result.message && UiUtils.showError(result.message);
                } catch (err) {
                } finally {
                    isSubmittingRef.current = false;
                    UiUtils.clearBusy();
                }
            }),
            renderModalFooter: renderFooter,
        });
        return modalId;
    }, [apiService, crudSettings, onSaved]);

    const openViewModal = useCallback((viewingItem: Record<string, any> = {}) => {
        return openModal({
            title: getTitleText('viewDetail', transformNotificationParameter(viewingItem)),
            modalProps,
            renderModalContent: renderFormModalContent(viewingItem, async () => {
            }, true),
            renderModalFooter: (onClose) => <OrdModalFooter onClose={onClose}/>,
        });
    }, []);

    const handleDelete = useCallback((deletingItem: T) => {
        const confirmContent = getConfirmContent(transformNotificationParameter(deletingItem));
        const confirmTitle = getConfirmTitle();

        return new Promise<void>((resolve) => {
            UiUtils.showConfirm({
                title: confirmTitle,
                icon: 'remove',
                content: confirmContent,
                onOk: async () => {
                    if (!apiService.remove) return resolve();
                    UiUtils.setBusy();
                    try {
                        const result = await apiService.remove({body: {encodedId: (deletingItem as any)?.encodedId}});
                        if (!result?.isSuccessful) {
                            result?.message && UiUtils.showError(result.message);
                            return resolve();
                        }
                        onSaved?.();
                        UiUtils.showSuccess(getDeleteSuccessMessage(transformNotificationParameter(deletingItem)));
                        resolve();
                    } catch (err) {
                        console.error('Modal delete error', err);
                        resolve();
                    } finally {
                        UiUtils.clearBusy();
                    }
                },
                onCancel: resolve,
            });
        });
    }, [apiService, getConfirmContent, getDeleteSuccessMessage, transformNotificationParameter, onSaved]);

    const openDeleteConfirm = useCallback((deletingItem: T) => {
        handleDelete(deletingItem);
    }, [handleDelete]);

    return {
        openCreateModal,
        openEditModal,
        openViewModal,
        openDeleteConfirm,
    };
};
