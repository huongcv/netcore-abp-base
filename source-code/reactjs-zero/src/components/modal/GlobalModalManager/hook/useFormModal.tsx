import {useCallback, useMemo, useRef} from 'react';
import {FormInstance, ModalProps} from 'antd';
import {useGlobalModalStore} from './useGlobalModalStore';
import {OrdModalFooter} from '@ord-components/modal/footer/OrdModalFooter';
import {OrdModalSaveButton} from '@ord-components/modal/footer/buttons/OrdModalSaveButton';
import UiUtils from '@ord-core/utils/ui.utils';
import {useRenderFormModalContent} from '@ord-components/modal/GlobalModalManager/hook/useRenderFormModalContent';

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
    const isSubmittingRef = useRef(false);

    const {
        title,
        formFields,
        submitIcon,
        submitLabel,
        onSaved,
        modalProps: rawModalProps,
    } = config;

    // Tránh tạo object mới mỗi lần render
    const modalProps = useMemo(() => rawModalProps || {width: 690}, [rawModalProps]);

    const renderFooter = useCallback(
        (onClose: () => void, internalForm: FormInstance) => (
            <OrdModalFooter
                onClose={onClose}
                right={[
                    <OrdModalSaveButton
                        key="save"
                        icon={submitIcon}
                        label={submitLabel}
                        onSubmit={() => internalForm.submit()}
                    />,
                ]}
            />
        ),
        [submitIcon, submitLabel]
    );

    const renderFormModalContent = (
        initialValues: any,
        onFinish: (values: T, form: FormInstance) => Promise<void>
    ) =>
        useRenderFormModalContent({
            formFields,
            initialValues,
            onFinish,
        });

    const openFormModal = useCallback(<TData = any>(
            modalData: TData = {} as TData,
            onSubmit: (
                formValue: Partial<TData> & Record<string, any>,
                form: FormInstance,
                modalData: TData
            ) => Promise<{ mustCloseModal: boolean; mustResetForm?: boolean }>,
            customRenderFooter?: (
                onClose: () => void,
                internalForm: FormInstance,
                modalData?: TData
            ) => React.ReactNode
        ) => {
            const modalId = openModal({
                title,
                modalProps,
                renderModalContent: renderFormModalContent(modalData, async (values, form) => {
                    if (isSubmittingRef.current) return;
                    isSubmittingRef.current = true;
                    UiUtils.setBusy();
                    try {
                        const result = await onSubmit(values, form, modalData);
                        if (result?.mustCloseModal) {
                            closeModal(modalId);
                        }
                        onSaved?.();
                    } catch (error) {
                        console.error('[useFormModal] Submit error:', error);
                    } finally {
                        isSubmittingRef.current = false;
                        UiUtils.clearBusy();
                    }
                }),
                renderModalFooter: (onClose, internalForm) =>
                    customRenderFooter?.(onClose, internalForm, modalData) ||
                    renderFooter(onClose, internalForm),
            });

            return modalId;
        },
        [title, modalProps, formFields, onSaved, renderFooter]
    );

    return {
        openFormModal,
    };
};
