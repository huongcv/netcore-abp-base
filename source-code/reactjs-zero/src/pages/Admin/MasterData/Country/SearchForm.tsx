import React from "react";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";

export const CountrySearchForm = () => {
    const config = new FormBuilder()
        .addSearchInput({
            span: 12
        })
        .build();
    return (<>
        <OrdFormBuilder ignoreRowWrapper={true} config={config}/>
    </>)
}