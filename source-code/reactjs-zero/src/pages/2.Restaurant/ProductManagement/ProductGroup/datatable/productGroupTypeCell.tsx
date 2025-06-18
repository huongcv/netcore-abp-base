import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import React from "react";
import {useSelectProductGroupType} from "@ord-components/forms/select/selectDataSource/useSelectProductGroupType";

export const ProductGroupTypeCell = (props: {
    value: number
}) => {
    const selectProductGroupType = useSelectProductGroupType();
    return <DisplayTextFormSelectDataSource
        datasource={selectProductGroupType}
        value={props.value}/>
}
