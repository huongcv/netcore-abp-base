import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import {Form, FormInstance, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {CommonListStore} from "@ord-core/base/CommonListStore";
import {useTranslation} from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import uiUtils from "@ord-core/utils/ui.utils";
import {observer} from "mobx-react-lite";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";

const OrdCreateOrUpdateModal = (prop: {
    stored: CommonListStore<any>,
    entityForm?: (form: FormInstance) => React.ReactNode,
    entityFormMore?: (form: FormInstance) => {
        afterFormContent?: React.ReactNode,
        formContent?: React.ReactNode,
        beforeFormContent?: React.ReactNode,
    },
    contentAfterForm?: () => React.ReactNode,
    onSavedSuccess?: (entityDto: any) => void,
    hotkeyScope?: string,
}) => {
    const {stored} = prop;
    const [entityFormRef] = Form.useForm();
    const {createOrUpdateModal} = prop.stored;
    const {t} = useTranslation([prop.stored.getNamespaceLocale() || 'common']);
    const [isAddNewContinue, setIsAddNewContinue] = useState(false);
    const closeModalCrud = () => {
        setIsAddNewContinue(false);
        prop.stored.closeModal();
        entityFormRef.resetFields();
    }
    const onOkModal = () => {
        if (entityFormRef) {
            entityFormRef.submit();
        }
    } 
    
    useEffect(() => {
        const {stored} = prop;
        const {visible, entityData} = stored.createOrUpdateModal;
        if (entityFormRef) {
            if (entityData) {
                entityFormRef.setFieldsValue(entityData);
            }
        }
    }, [prop.stored.createOrUpdateModal.visible, prop.stored.createOrUpdateModal.entityData]);

    useEffect(() => {
        setIsAddNewContinue(false);
    }, [])

    useHotkeys('F8', (event) => {
        onOkModal();
        event.preventDefault();
    }, {scopes: [prop.hotkeyScope ?? HotKeyScope.crudPageBase], enableOnFormTags: true})
    useHotkeys('F10', (event) => {
        closeModalCrud();
        event.preventDefault();
    }, {scopes: [prop.hotkeyScope ?? HotKeyScope.crudPageBase], enableOnFormTags: true}) 

    const onSaveCreateOrUpdate = async (data: any) => {
        UiUtils.setBusy();
        try {
            if (stored.createOrUpdateModal.mode === 'addNew') {
                const result = await stored.createEntity({
                    ...data
                });
                if (result) {
                    UiUtils.showSuccess(t('addNewSuccess', {
                        ...data
                    }) as any);
                    if (prop.onSavedSuccess) {
                        prop.onSavedSuccess(stored.createOrUpdateEntitySaved)
                    }
                    if (!isAddNewContinue) {
                        stored.closeModal(true);
                    } else {
                        stored.refreshGridData().then();

                        if (entityFormRef) {
                            entityFormRef.resetFields();
                            entityFormRef.setFieldsValue(prop.stored.initFormValueWhenOpenModal());
                        }
                    }
                }
            } else {
                const body = {
                    ...stored.createOrUpdateModal?.entityData,
                    ...data
                };
                const result = await stored.updateEntity(body);
                if (result) {
                    stored.refreshGridData().then();
                    if (prop.onSavedSuccess) {
                        prop.onSavedSuccess(stored.createOrUpdateEntitySaved)
                    }
                    UiUtils.showSuccess(t('updateSuccess', {
                        ...body
                    }) as any);
                    stored.closeModal(true);
                }
            }
        } catch (e) {
            console.log(e)
        } finally {
            UiUtils.clearBusy();
        }

    }

    return (
        <>
            <Modal title={t(('title.' + createOrUpdateModal!.mode || 'createOrUpdateModal'), {
                ...createOrUpdateModal!.entityData
            }) as any}
                   open={createOrUpdateModal.visible}
                   width={createOrUpdateModal.width || 550}
                   maskClosable={false}
                   onCancel={closeModalCrud}
                   style={{top: '30px', ...createOrUpdateModal.style}}
                   onOk={onOkModal}
                   destroyOnClose
                   footer={<FooterCrudModal
                       hasAddNewContinue={prop.stored.createOrUpdateModal.mode === 'addNew'}
                       isAddNewContinue={isAddNewContinue}
                       isAddNewContinueChange={(v) => setIsAddNewContinue(v)}
                       hiddenOk={prop.stored.createOrUpdateModal.mode === 'viewDetail'}
                       onOk={onOkModal} onCancel={closeModalCrud}/>}
            >
                {prop.entityForm && <>
                    <Form autoComplete="off"
                          form={entityFormRef}
                          layout='vertical'
                          clearOnDestroy
                          disabled={prop.stored.entityFormDisable}
                          onFinish={onSaveCreateOrUpdate}
                          onFinishFailed={() => uiUtils.showCommonValidateForm()}>
                        {prop.entityForm(entityFormRef)}
                    </Form>
                </>}
                {prop.entityFormMore && <div className='flex flex-col'>
                    <div className='order-1'>{prop.entityFormMore(entityFormRef)?.beforeFormContent}</div>
                    <div className='order-last'>{prop.entityFormMore(entityFormRef)?.afterFormContent}</div>
                    <div className='order-2'>
                        <Form autoComplete="off"

                              form={entityFormRef}
                              layout='vertical'
                              clearOnDestroy
                              disabled={prop.stored.entityFormDisable}
                              onFinish={onSaveCreateOrUpdate}
                              onFinishFailed={() => uiUtils.showCommonValidateForm()}>
                            {prop.entityFormMore(entityFormRef)?.formContent}
                        </Form>
                    </div>

                </div>
                }

            </Modal>
        </>
    );
}
export default observer(OrdCreateOrUpdateModal);
