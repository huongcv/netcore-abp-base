import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import React from "react";
import {useSelectProductUnit} from "@ord-components/forms/select/selectDataSource/useSelectProductUnit";

export const ProductUitCell = (props: {
    value: number | string | undefined,
    productId: number | string | undefined,
}) => {
    const selectProductGroupType = useSelectProductUnit(props.productId);
    return <DisplayTextFormSelectDataSource
        datasource={selectProductGroupType}
        value={props.value}/>
}
