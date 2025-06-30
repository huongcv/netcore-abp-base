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
        form,
        ...rest
    } = modal;
    const {closeModal, setLoading, topModalId} = useGlobalModalStore();
    const [internalForm] = Form.useForm();
    const usedForm = form || internalForm;
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (modalData) {
            usedForm.setFieldsValue(modalData);
        }
    }, [modalData, usedForm]);

    const handleCancel = useCallback(() => {
        closeModal(viewId);
        usedForm.resetFields();
    }, [closeModal, usedForm, viewId]);

    const handleFinish = useCallback(async () => {
        if (saving) return;
        setSaving(true);
        if (mustLoadingPageWhenSaving) {
            UiUtils.setBusy();
        }
        try {
            const values = await usedForm.validateFields();
            setLoading(viewId, true);

            if (onSubmit) {
                const shouldClose = await onSubmit(values, modalData, viewId);
                if (shouldClose) {
                    closeModal(viewId);
                    usedForm.resetFields();
                }
            }
        } catch {
            // Silent catch
        } finally {
            setLoading(viewId, false);
            UiUtils.clearBusy();
            setSaving(false);
        }
    }, [saving, usedForm, onSubmit, modalData, viewId, closeModal, setLoading, mustLoadingPageWhenSaving]);

    const renderContent = useMemo(() => {
        if (modalContentRender) {
            return <>
                <Form
                    form={usedForm}
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
                form={usedForm}
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
    }, [modalContentRender, modalData, usedForm, handleFinish, formRender]);
    const renderSaveButton = useCallback(() => (
        <OrdModalSaveButton
            loading={saving}
            onSubmit={() => {
                if (!saving) {
                    setSaving(true);
                    usedForm.submit();
                }
            }}
        />
    ), [saving, usedForm]);
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
        if (onSubmit) {
            return (
                <OrdModalFooter onClose={handleCancel} right={[
                    renderSaveButton()
                ]}/>
            )
        }
        return (
            <OrdModalFooter onClose={handleCancel}/>
        )

    }, [handleCancel, usedForm, saving]);

    const ignoreHotKeyFinal = useMemo(() => {
        const ignoreKeys = ignoreHotKeys || [];
        if (!onSubmit) {
            return ['F8', ...ignoreKeys];
        }
        return [...ignoreKeys];
    }, [onSubmit, ignoreHotKeys]);

    useModalHotkeys({
        modalId: viewId,
        ignoreHotKeys: ignoreHotKeyFinal,
        onOkModal: () => {
            usedForm.submit();
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
