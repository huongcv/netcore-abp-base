import {Form, FormInstance, Modal} from "antd";
import UiUtils from "@ord-core/utils/ui.utils";
import React, {useEffect, useState} from "react";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import {ModalConfig} from "@ord-core/model/OrdEntityModalProp";
import {observer} from "mobx-react-lite";
import {HotkeysProvider, useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";

const EntityFormModal = (props: {
    children?: any,
    entity: any;
    modal?: ModalConfig;
    formContent?: (form: FormInstance) => React.ReactNode;
    onSave?: (formValues: any) => Promise<boolean>;
    onClose?: () => void;
}) => {
    const [entity, setEntity] = useState<any>();
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [formContent, setFormContent] = useState<React.ReactNode>();

    const scopeId = React.useMemo(() => `appModalEntity-${Math.random().toString(36).substring(2, 15)}`, []);
    const disableHostKeyScopeForm_w = Form.useWatch('disableHostKeyScopeForm', form);

    useEffect(() => {
        if (!!props.entity && props.formContent) {
            setEntity(props.entity);
            setModalOpen(true);
            setFormContent(props.formContent(form));
        }
    }, [props.entity]);

    const onSave = async (formValues: any) => {
        if (props.onSave) {
            const result = await props.onSave({
                ...props.entity,
                ...formValues
            });
            if (result) {
                onCloseModal();
            }
        } else {
            onCloseModal();
        }

    }
    const onCloseModal = () => {
        setEntity(null);
        setModalOpen(false);
        if (props.onClose) {
            props.onClose();
        }
    }
    const onOkModal = () => {
        form.submit();
    }

    useHotkeys('F8', (event) => {
        if (modalOpen && form && !disableHostKeyScopeForm_w) {
            form.validateFields()
                .then(() => {
                    onOkModal();
                    event.preventDefault();
                }).catch(() => {
            });
        }

    }, {
        scopes: [scopeId || HotKeyScope.crudPageBase],
        enableOnFormTags: true,
        enabled: !disableHostKeyScopeForm_w
    });
    useHotkeys('F10', (event) => {
        onCloseModal();
        event.preventDefault();
    }, {
        scopes: [scopeId || HotKeyScope.crudPageBase],
        enableOnFormTags: true,
        enabled: !disableHostKeyScopeForm_w
    });

    return (
        <HotkeysProvider initiallyActiveScopes={[scopeId]}>
            {props.entity &&
                <Modal
                    title={props?.modal?.title}
                    style={{top: 20, ...props?.modal?.style}}
                    width={props?.modal?.width || 550}
                    open={modalOpen}
                    onCancel={onCloseModal}
                    okButtonProps={{autoFocus: true, htmlType: 'submit'}}
                    destroyOnClose
                    maskClosable={false}
                    modalRender={(dom) => {
                        if (props?.modal?.ignoreFormEntity === true) {
                            <h1>Viet2</h1>
                            return (<>{dom}</>);
                        }
                        return (
                            <Form
                                layout="vertical"
                                form={form}
                                autoComplete="off"
                                initialValues={entity}
                                clearOnDestroy
                                onFinish={onSave}
                                onFinishFailed={() => UiUtils.showCommonValidateForm()}
                            >
                                {dom}
                                <h1>Viet</h1>
                                <div hidden>
                                    <Form.Item name={'disableHostKeyScopeForm'} initialValue={false}></Form.Item>
                                </div>
                            </Form>
                        )
                    }}
                    footer={<FooterCrudModal hasAddNewContinue={false}
                                             okBtn={props?.modal?.okBtn}
                                             cancelBtn={props?.modal?.cancelBtn}
                                             hiddenOk={props?.modal?.hiddenOk}
                                             otherBtn={props?.modal?.otherBtn}
                                             onOk={onOkModal}
                                             onCancel={() => onCloseModal()}/>}
                >
                    {formContent}
                    {props?.children}
                </Modal>}
        </HotkeysProvider>
    );
}
export default observer(EntityFormModal);
