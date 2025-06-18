import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {UserService} from "@api/UserService";
import UiUtils from "@ord-core/utils/ui.utils";
import {Checkbox, Col, Form, Input} from "antd";
import {UndoOutlined} from "@ant-design/icons";
import React from "react";
import {l} from "@ord-core/language/lang.utils";
import {UserNS} from "@pages/Admin/Users/user.util";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {ActionLazy} from "@ord-components/table/cells/ActionLazy";

const ChangePasswordForm = () => {
    const {useHostListStore} = useStore();
    const {t} = useTranslation(useHostListStore.getNamespaceLocale());
    return (<>
        <Form.Item label={l.trans(UserNS + '.Name')} name='name'>
            <Input disabled/>
        </Form.Item>
        <Form.Item label={l.trans('common.UserName')} name='userName'>
            <Input disabled/>
        </Form.Item>
        <Form.Item label={l.trans('common.Password')} name='newPassword'
                   rules={[ValidateUtils.required, ValidateUtils.password]}>
            <Input.Password autoComplete='off'/>
        </Form.Item>
        <Col span={24}>
            <Form.Item noStyle name='mustChangePassword' valuePropName="checked">
                <Checkbox>{t('mustChangePassword')}</Checkbox>
            </Form.Item>
        </Col>
    </>);
}

class ChangePwdAction extends ActionLazy {
    icon(): React.ReactNode {
        return <UndoOutlined/>;
    }

    onClick(record: any): void {
        const user = record;
        this.props.entityModalStore.openModalForm({
            modal: {
                title: l.trans(UserNS + '.ChangePasswordModalTitle'),
                width: 400
            },
            entity: {
                ...user
            },
            formContent: (form) => (<ChangePasswordForm/>),
            onSave: async (saveData) => {
                const result = await UserService.resetPassword({
                    body: {
                        ...saveData,
                        userId: user.id
                    }
                });
                const isSuccessful = result.isSuccessful || false;
                if (isSuccessful) {
                    UiUtils.showSuccess(l.trans(UserNS + 'ChangePasswordSuccess', {...saveData}) as any);
                }
                return isSuccessful;
            }
        });
    }
}

export default ChangePwdAction;
