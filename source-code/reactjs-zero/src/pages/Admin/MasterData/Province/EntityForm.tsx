import React from "react";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import {useSelectCountry} from "@ord-components/forms/select/selectDataSource/useSelectCountry";
import {useSelectProvince} from "@ord-components/forms/select/selectDataSource/useSelectProvince";
import {Form} from "antd";

export const ProvinceEntityForm = () => {
    const countryCode = Form.useWatch('countryCode');
    const form = Form.useFormInstance();
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
            componentProps: {
                datasource: useSelectCountry(),
                allowClear: false
            }
        }).addSelect({
            name: 'level',
            label: 'cap',
            componentProps: {
                datasource: {
                    data: [{
                        value: 'Tỉnh',
                        label: 'Tỉnh'
                    }, {
                        value: 'Thành phố Trung ương',
                        label: 'Thành phố Trung ương'
                    }],
                    isPending: false
                },
                allowClear: false,
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