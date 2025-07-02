import OrdDateInput from "@ord-components/forms/OrdDateInput";
import DateUtil from "@ord-core/utils/date.util";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {Col, Form, Input, Row} from "antd";
import {useTranslation} from "react-i18next";
import {useUserLogic} from "@pages/Admin/Users/hook/useUserLogic";
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {useMemo} from "react";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";

const UserEntityForm = () => {
    const {t} = useTranslation();
    const modifyMode = Form.useWatch(['extendUi', 'modifyMode']);
    const isReadOnly = useMemo(() => {
        return modifyMode == 'view'
    }, [modifyMode]);
    const isAdd = useMemo(() => {
        return modifyMode == 'add'
    }, [modifyMode]);
    const form = Form.useFormInstance();
    const firstFocusRef = useAutoFocus();

    const config = useMemo(() => {
        const formBuilder = new FormBuilder();
        formBuilder.addText({
            span: 12,
            name: 'userName',
            label: 'UserName',
            required: true,
            maxLength: 100,
            disabled: !isAdd,
            autoFocus: true,
            rules: isAdd ? [ValidateUtils.userName] : []
        });
        if (!isReadOnly) {
            formBuilder.addPassword({
                span: 12,
                name: 'password',
                label: 'Password',
                required: isAdd,
                maxLength: 100,
                rules: [ValidateUtils.password],
                componentProps: {
                    placeholder: modifyMode === 'edit' ? t('emptyIfNotChangePassword') : ''
                }
            });
        }
        formBuilder.addText({
            span: 12,
            name: 'name',
            label: 'full_name',
            required: true,
            maxLength: 200
        }).addDate({
            span: 12,
            name: 'birthDay',
            label: 'BirthDay'
        }).addText({
            span: 12,
            name: 'email',
            label: 'email',
            maxLength: 200,
            rules: [ValidateUtils.email]
        }).addText({
            span: 12,
            name: 'phoneNumber',
            label: 'PhoneNumber',
            maxLength: 12,
            rules: [ValidateUtils.phoneNumberVietNam]
        }).addCheckbox({
            span: 24,
            name: 'mustChangePassword',
            label: 'mustChangePassword'
        }).addCheckbox({
            span: 24,
            name: 'isLockoutEnabled',
            label: 'isLockoutEnabled'
        }).addCheckbox({
            span: 24,
            name: 'isActived',
            label: 'dang_hoat_dong',
            initialValue: true
        });
        return formBuilder.build();
    }, [modifyMode, isAdd, isReadOnly]);


    return (<>
        <OrdFormBuilder config={config}/>
    </>)
}
export default UserEntityForm;
