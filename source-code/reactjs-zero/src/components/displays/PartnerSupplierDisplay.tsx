import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectPartnerSupplier} from "@ord-components/forms/select/selectDataSource/useSelectPartnerSupplier";
import React from "react";

export const PartnerSupplierDisplay = (props: {
    value: any
}) => {
    return <>
        <DisplayTextFormSelectDataSource value={props.value}
                                         datasource={useSelectPartnerSupplier()}></DisplayTextFormSelectDataSource>
    </>
}
