import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Form, Modal} from 'antd';
import {ModalConfig, useGlobalModalStore} from "@ord-components/modal/GlobalModalManager/modalStore";
import UiUtils from "@ord-core/utils/ui.utils";
import {useModalHotkeys} from "@ord-components/modal/GlobalModalManager/useModalHotkeys";
import _ from 'lodash';
import {SaveButton} from "@ord-components/modal/GlobalModalManager/components/SaveButton";
import {ContinueCheckbox} from "@ord-components/modal/GlobalModalManager/components/ContinueCheckbox";
import {ButtonMapper} from "@ord-components/modal/GlobalModalManager/components/ButtonMapper";
import {ModalFooterRenderer} from "@ord-components/modal/GlobalModalManager/components/ModalFooterRenderer";
import {ModalContent} from "@ord-components/modal/GlobalModalManager/components/ModalContent";

// Main SingleModal Component
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
        formReadOnly,
        modalProps
    } = modal;

    const {closeModal, setLoading} = useGlobalModalStore();
    const [internalForm] = Form.useForm();
    const usedForm = form || internalForm;
    const [saving, setSaving] = useState(false);
    const [isContinue, setIsContinue] = useState(false);

    // Memoize initial values
    const initialValues = useMemo(() => modalData || {}, [modalData]);

    // Set form values chỉ khi modalData thay đổi thực sự
    useEffect(() => {
        if (modalData && !_.isEqual(usedForm.getFieldsValue(), modalData)) {
            usedForm.setFieldsValue(modalData);
        }
    }, [modalData, usedForm]);

    // Event handlers
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
            const submitValue = _.omit(values, ['extendUI']);
            setLoading(viewId, true);

            if (onSubmit) {
                const saveSuccess = await onSubmit(submitValue, modalData, usedForm, viewId);
                if (saveSuccess) {
                    usedForm.resetFields();
                    if (!isContinue) {
                        closeModal(viewId);
                    }
                }
            }
        } catch (error) {
            console.warn('Form submission failed:', error);
        } finally {
            setLoading(viewId, false);
            UiUtils.clearBusy();
            setSaving(false);
        }
    }, [saving, usedForm, onSubmit, modalData, viewId, closeModal, setLoading, mustLoadingPageWhenSaving, isContinue]);

    const handleFinishFailed = useCallback(() => {
        setSaving(false);
        UiUtils.showCommonValidateForm();
    }, []);

    // Render methods cho buttons
    const renderSaveButton = useCallback(() => (
        <SaveButton
            loading={saving}
            onSubmit={() => {
                if (!saving) {
                    setSaving(true);
                    usedForm.submit();
                }
            }}
        />
    ), [saving, usedForm]);

    const renderContinueCheckBox = useCallback(() => (
        <ContinueCheckbox
            checked={isContinue}
            onChange={setIsContinue}
        />
    ), [isContinue]);

    // Button mapping function
    const mapButtons = useCallback((buttons?: (React.ReactNode | 'save' | 'isContinueCheckBox')[]) => {
        return (
            <ButtonMapper
                buttons={buttons}
                renderSaveButton={renderSaveButton}
                renderContinueCheckBox={renderContinueCheckBox}
            />
        );
    }, [renderSaveButton, renderContinueCheckBox]);

    // Footer rendering
    const renderFooter = useMemo(() => (
        <ModalFooterRenderer
            modalProps={modalProps}
            footerButtons={footerButtons}
            onSubmit={onSubmit}
            handleCancel={handleCancel}
            renderSaveButton={renderSaveButton}
            mapButtons={mapButtons}
        />
    ), [modalProps, footerButtons, onSubmit, handleCancel, renderSaveButton, mapButtons]);

    // Hotkey configuration
    const hotKeyConfig = useMemo(() => {
        const ignoreKeys = ignoreHotKeys || [];

        if (!onSubmit) {
            return ['F8', ...ignoreKeys];
        }

        return ignoreKeys;
    }, [onSubmit, ignoreHotKeys]);

    // Setup modal hotkeys
    useModalHotkeys({
        modalId: viewId,
        ignoreHotKeys: hotKeyConfig,
        onOkModal: () => usedForm.submit(),
        onClose: handleCancel
    });

    // Modal props configuration
    const modalPropsConfig = useMemo(() => ({
        style: {top: 30},
        maskClosable: false,
        width: 800,
        destroyOnHidden: true,
        ...modalProps,
        title: modal.title,
        open: true,
        onCancel: handleCancel,
        footer: renderFooter
    }), [modalProps, modal.title, handleCancel, renderFooter]);

    return (
        <Modal {...modalPropsConfig}>
            <ModalContent
                modalData={modalData}
                formRender={formRender}
                modalContentRender={modalContentRender}
                usedForm={usedForm}
                formReadOnly={formReadOnly}
                handleFinish={handleFinish}
                handleFinishFailed={handleFinishFailed}
                initialValues={initialValues}
            />
        </Modal>
    );
};

// Main GlobalModalManager Component
export const GlobalModalManager: React.FC = React.memo(() => {
    const {modals} = useGlobalModalStore();

    return (
        <>
            {modals.map((modal) => (
                <SingleModal key={modal.viewId} modal={modal}/>
            ))}
        </>
    );
});