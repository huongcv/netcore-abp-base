import {useCallback, useRef} from 'react';
import {FormInstance, ModalProps} from 'antd';
import {useGlobalModalStore} from './useGlobalModalStore';
import {OrdModalFooter} from '@ord-components/modal/footer/OrdModalFooter';
import {OrdModalSaveButton} from '@ord-components/modal/footer/buttons/OrdModalSaveButton';
import UiUtils from '@ord-core/utils/ui.utils';
import {useRenderFormModalContent} from "@ord-components/modal/GlobalModalManager/hook/useRenderFormModalContent";

export interface UseFormModalConfig<T = any> {
    title: React.ReactNode;
    formFields: React.ReactNode;
    submitLabel?: React.ReactNode;
    submitIcon?: React.ReactNode;
    onSaved?: () => void;
    modalProps?: Omit<ModalProps, 'onOk' | 'open' | 'onCancel'>;
}

export const useFormModal = <T extends object>(config: UseFormModalConfig<T>) => {
    const {openModal, closeModal} = useGlobalModalStore();
    const {
        title,
        formFields,
        submitIcon,
        submitLabel,
        onSaved,
        modalProps = {
            width: 690
        },
    } = config;
    const isSubmittingRef = useRef(false);

    const renderFooter = (onClose: () => void, internalForm: any) => (
        <OrdModalFooter
            onClose={onClose}
            right={[<OrdModalSaveButton key="save"
                                        icon={submitIcon}
                                        label={submitLabel}
                                        onSubmit={() => internalForm.submit()}/>]}
        />
    );

    const renderFormModalContent = (initialValues: any,
                                    onFinish: (values: T, form: FormInstance) => Promise<void>) =>
        useRenderFormModalContent({
            formFields,
            onFinish,
            initialValues
        });
    const openFormModal = useCallback((modalData: Record<string, any> = {},
                                       onSubmit: (formValue: any, form: FormInstance, modalData: any) => Promise<{
                                           mustCloseModal: boolean;
                                           mustResetForm?: boolean;
                                       }>) => {
        let modalId: string;
        modalId = openModal({
            title: title,
            modalProps,
            renderModalContent: renderFormModalContent(modalData, async (values, form) => {
                if (isSubmittingRef.current) return;
                isSubmittingRef.current = true;
                UiUtils.setBusy();
                try {
                    const result = await onSubmit?.(values, form, modalData || {});
                    if (result) {
                        const {mustCloseModal} = result;
                        if (mustCloseModal) {
                            closeModal(modalId);
                        }
                    }
                    onSaved?.();
                } catch (err) {
                } finally {
                    isSubmittingRef.current = false;
                    UiUtils.clearBusy();
                }
            }),
            renderModalFooter: renderFooter,
        });
        return modalId;
    }, []);

    return {
        openFormModal
    };
};
