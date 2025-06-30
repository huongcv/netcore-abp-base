import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Form, Modal} from 'antd';
import {ModalConfig, useGlobalModalStore} from "@ord-components/modal/GlobalModalManager/modalStore";
import UiUtils from "@ord-core/utils/ui.utils";
import {OrdModalFooter} from "@ord-components/modal/footer/OrdModalFooter";
import {OrdModalSaveButton} from "@ord-components/modal/footer/buttons/OrdModalSaveButton";
import {useModalHotkeys} from "@ord-components/modal/GlobalModalManager/useModalHotkeys";

const SingleModal: React.FC<{ modal: ModalConfig }> = ({modal}) => {
    const {
        viewId,
        modalData,
        formRender,
        onSubmit,
        modalContentRender,
        mustLoadingPageWhenSaving = true,
        footerButtons,
        ignoreHotKeys,
        ...rest
    } = modal;
    const {closeModal, setLoading, topModalId} = useGlobalModalStore();
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (modalData) {
            form.setFieldsValue(modalData);
        }
    }, [modalData, form]);

    const handleCancel = useCallback(() => {
        closeModal(viewId);
        form.resetFields();
    }, [closeModal, form, viewId]);

    const handleFinish = useCallback(async () => {
        if (saving) return;
        setSaving(true);
        if (mustLoadingPageWhenSaving) {
            UiUtils.setBusy();
        }
        try {
            const values = await form.validateFields();
            setLoading(viewId, true);

            if (onSubmit) {
                const shouldClose = await onSubmit(values, modalData, viewId);
                if (shouldClose) {
                    closeModal(viewId);
                    form.resetFields();
                }
            }
        } catch {
            // Silent catch
        } finally {
            setLoading(viewId, false);
            UiUtils.clearBusy();
            setSaving(false);
        }
    }, [saving, form, onSubmit, modalData, viewId, closeModal, setLoading, mustLoadingPageWhenSaving]);

    const renderContent = useMemo(() => {
        if (modalContentRender) {
            return <>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleFinish}
                    initialValues={modalData || {}}>
                </Form>
                {modalContentRender(modalData)}
            </>;
        }

        return (
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                onFinish={handleFinish}
                onFinishFailed={() => {
                    setSaving(false);
                    UiUtils.showCommonValidateForm();
                }}
                initialValues={modalData || {}}
            >
                {formRender?.(modalData)}
            </Form>
        );
    }, [modalContentRender, modalData, form, handleFinish, formRender]);
    const renderSaveButton = useCallback(() => (
        <OrdModalSaveButton
            loading={saving}
            onSubmit={() => {
                if (!saving) {
                    setSaving(true);
                    form.submit();
                }
            }}
        />
    ), [saving, form]);
    const mapButtons = useCallback((buttons?: (React.ReactNode | 'save')[]) =>
            buttons?.map(btn => btn === 'save' ? renderSaveButton() : btn),
        [renderSaveButton]);

    const renderFooter = useMemo(() => {
        if (rest.footer) {
            return rest.footer;
        }
        if (footerButtons) {
            const {right, left, leftClose} = footerButtons;
            return (
                <OrdModalFooter
                    onClose={handleCancel}
                    left={mapButtons(left)}
                    leftClose={mapButtons(leftClose)}
                    right={mapButtons(right)}
                />
            );
        }
        return (
            <OrdModalFooter onClose={handleCancel} right={[
                renderSaveButton()
            ]}/>
        )
    }, [handleCancel, form, saving]);

    useModalHotkeys({
        modalId: viewId,
        ignoreHotKeys,
        onOkModal: () => {
            form.submit();
        }, onClose: () => {
            handleCancel();
        }
    });

    return (
        <Modal
            style={{
                top: 30
            }}
            maskClosable={false}
            width={800}
            destroyOnHidden
            {...rest}
            title={modal.title}
            open={true}
            onCancel={handleCancel}
            footer={renderFooter}>
            {renderContent}
        </Modal>
    );
};

export const GlobalModalManager: React.FC = () => {
    const {modals} = useGlobalModalStore();

    return (
        <>
            {modals.map((modal) => (
                <SingleModal key={modal.viewId} modal={modal}/>
            ))}
        </>
    );
};
