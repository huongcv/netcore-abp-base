import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import {Form} from "antd";
import {useMemo} from "react";
import {SETTING_NAME_FOR_APP} from "@pages/Admin/Setting/components/SettingNameSelect/setting-name.const";
import NameSettingSelectControl from "@pages/Admin/Setting/components/SettingNameSelect/NameSettingSelectControl";

export const CommonSettingForm = () => {
    const usingJson = Form.useWatch('usingJson');
    const name_w = Form.useWatch('name');
    const isNameSelectInput = useMemo(() => {
        return SETTING_NAME_FOR_APP.includes(name_w);
    }, [name_w]);
    const config = new FormBuilder()
        .addCustomFieldContent({
            span: 24,
            name: 'name',
            label: 'setting_name',
            required: true,
            autoFocus: true,
            content: <NameSettingSelectControl typeSetting={1}/>
        }).addText({
            span: 24,
            name: 'value',
            label: 'setting_value',
            required: true,
            hidden: usingJson,
            maxLength: 500,
        }).addTextArea({
            span: 24,
            name: 'value',
            label: 'setting_value',
            required: true,
            hidden: !usingJson,
            maxLength: 500,
        }).addCheckbox({
            name: 'usingJson',
            label: 'setting_usingJson',
        }).addCheckbox({
            name: 'mustEncrypt',
            hidden: usingJson,
        }).addCheckbox({
            name: 'isActived',
            label: 'dang_hoat_dong',
            initialValue: true
        })
        .build();
    return (<>
        <OrdFormBuilder disableResponsiveCol config={config}/>
    </>)
}