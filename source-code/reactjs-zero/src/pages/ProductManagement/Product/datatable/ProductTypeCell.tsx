import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import React from "react";
import {useSelectProductType} from "@ord-components/forms/select/selectDataSource/useSelectProductType";

export const ProductTypeCell = (props: {
    value: number
}) => {
    const selectProductGroupType = useSelectProductType();
    return <DisplayTextFormSelectDataSource
        datasource={selectProductGroupType}
        value={props.value}/>
}
