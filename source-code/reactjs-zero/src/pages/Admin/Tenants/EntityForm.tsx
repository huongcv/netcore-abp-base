import {Form} from "antd";
import React, {useMemo} from "react";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {useTranslation} from "react-i18next";
import {useTenantLogic} from "@pages/Admin/Tenants/useTenantLogic";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {UserAccountAdmin} from "@pages/Admin/Tenants/components/UserAccountAdmin";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";

export const TenantEntityForm = () => {
    const {isCreateNew} = useTenantLogic();
    const {t} = useTranslation();
    const form = Form.useFormInstance();
    const code_w = Form.useWatch('code', form);
    const config = useMemo(() => {
        return new FormBuilder()
            .addText({
                span: 12,
                name: 'code',
                rules: [ValidateUtils.NoSpecialCharacter],
                maxLength: 50,
                required: true
            })
            .addText({
                span: 12,
                name: 'name',
                label: 'tenant_name',
                maxLength: 200,
                required: true
            })
            .addText({
                span: 12,
                name: 'phoneNumber',
                rules: [ValidateUtils.phoneNumberVietNam],
                maxLength: 12
            })
            .addText({
                span: 12,
                name: 'email',
                maxLength: 200,
                rules: [ValidateUtils.email],
            })
            .addText({
                span: 24,
                name: 'address',
                maxLength: 200
            }).addCustom({
                render: () => isCreateNew ? <UserAccountAdmin/> : null
            })
            .addCheckbox({
                name: 'isActived',
                initialValue: true
            })
            .build();
    }, [isCreateNew]);

    return (<>
        <OrdFormBuilder config={config}/>
    </>);
}
