import {useMemo, useRef} from 'react';
import {FormInstance, ModalProps} from 'antd';
import {useGlobalModalStore} from './useGlobalModalStore';
import {OrdModalFooter} from '@ord-components/modal/footer/OrdModalFooter';
import {OrdModalSaveButton} from '@ord-components/modal/footer/buttons/OrdModalSaveButton';
import UiUtils from '@ord-core/utils/ui.utils';
import {FormModalBodyContent} from "@ord-components/modal/GlobalModalManager/components/FormModalContent";

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
    // hàm chính để mở modal
    const openFormModal = <TData = any>(
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
            renderModalContent: ({internalForm}) => {
                const onHandlerSubmit = async (values: any, form: FormInstance) => {
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
                }
                return <FormModalBodyContent internalForm={internalForm}
                                             onFinish={onHandlerSubmit}
                                             formFields={formFields}
                                             initialValues={modalData}
                />
            },
            // renderModalContent: ({internalForm}) => renderFormModalContent(modalData, async (values, form) => {
            //     if (isSubmittingRef.current) return;
            //     isSubmittingRef.current = true;
            //     UiUtils.setBusy();
            //     try {
            //         const result = await onSubmit(values, form, modalData);
            //         if (result?.mustCloseModal) {
            //             closeModal(modalId);
            //         }
            //         onSaved?.();
            //     } catch (error) {
            //         console.error('[useFormModal] Submit error:', error);
            //     } finally {
            //         isSubmittingRef.current = false;
            //         UiUtils.clearBusy();
            //     }
            // })(internalForm),
            renderModalFooter: ({onClose, internalForm}) => {
                if (customRenderFooter) {
                    return customRenderFooter?.(onClose, internalForm, modalData);
                }
                return <OrdModalFooter
                    onClose={onClose}
                    right={[
                        <OrdModalSaveButton
                            key="save"
                            icon={submitIcon}
                            label={submitLabel}
                            onSubmit={() => internalForm.submit()}
                        />,
                    ]}
                />;
            }

        });

        return modalId;
    }

    return {
        openFormModal,
    };
};
