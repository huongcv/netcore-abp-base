import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Form, Modal} from 'antd';
import {ModalConfig, useGlobalModalStore} from "@ord-components/modal/GlobalModalManager/modalStore";
import UiUtils from "@ord-core/utils/ui.utils";
import {OrdModalFooter} from "@ord-components/modal/footer/OrdModalFooter";

const SingleModal: React.FC<{ modal: ModalConfig }> = ({modal}) => {
    const {
        viewId,
        modalData,
        formRender,
        onSubmit,
        modalContentRender,
        mustLoadingPageWhenSaving = true,
        ...rest
    } = modal;
    const {closeModal, setLoading} = useGlobalModalStore();
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
            return modalContentRender(modalData);
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

    const renderFooter = useMemo(() => {
        if (rest.footer) {
            return rest.footer;
        }
        return (
            <OrdModalFooter onClose={handleCancel} right={[
                <Button key="cancel" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button key="save" type="primary" onClick={() => form.submit()} loading={saving}>
                    Lưu
                </Button>,
            ]}></OrdModalFooter>
        )
    }, [handleCancel, form, saving]);

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
