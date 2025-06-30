import React from "react";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import {useSelectCountry} from "@ord-components/forms/select/selectDataSource/useSelectCountry";

export const ProvinceEntityForm = () => {
    const config = new FormBuilder()
        .addText({
            name: 'code',
            required: true,
            maxLength: 10,
            autoFocus: true,
        }).addText({
            name: 'name',
            required: true,
            maxLength: 100,
        }).addSelect({
            name: 'countryCode',
            label: 'quoc_gia',
            initialValue: 'VN',
            componentProps: {
                datasource: useSelectCountry()
            }
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