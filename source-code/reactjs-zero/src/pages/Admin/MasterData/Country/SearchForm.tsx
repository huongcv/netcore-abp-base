import React from "react";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import {CountryEntityForm} from "@pages/Admin/MasterData/Country/EntityForm";
import {useSelectIsActived} from "@ord-components/forms/select/selectDataSource/useSelectIsActived";

export const CountrySearchForm = () => {
    const config = new FormBuilder()
        .addSearchInput({
            span: 12
        }).addSelect({
            name: 'isActived',
            label: 'dang_hoat_dong',
            componentProps: {
                datasource: useSelectIsActived()
            }
        })
        .build();
    return (<>
        <OrdFormBuilder ignoreRowWrapper={true} config={config}/>
    </>)
}