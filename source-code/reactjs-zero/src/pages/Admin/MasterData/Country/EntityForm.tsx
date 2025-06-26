import React from "react";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";

export const CountryEntityForm = () => {
    const config = new FormBuilder()
        .addText({
            span: 12,
            name: 'code',
            required: true,
            maxLength: 10,
            autoFocus: true,
        }).addText({
            span: 12,
            name: 'name',
            required: true,
            maxLength: 100,
        }).addText({
            span: 12,
            name: 'phoneCode',
            label: 'phone_code',
            maxLength: 50,
        }).addText({
            span: 12,
            name: 'currencyCode',
            label: 'currency_code',
            maxLength: 50,
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