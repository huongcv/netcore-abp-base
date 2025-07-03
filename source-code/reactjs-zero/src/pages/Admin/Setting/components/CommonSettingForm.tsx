import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";

export const CommonSettingForm = () => {
    const config = new FormBuilder()
        .addText({
            span: 24,
            name: 'name',
            label: 'setting_name',
            required: true,
            maxLength: 200,
            autoFocus: true,
        }).addText({
            span: 24,
            name: 'value',
            label: 'setting_value',
            required: true,
            maxLength: 500,
        }).addCheckbox({
            name: 'mustEncrypt'
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