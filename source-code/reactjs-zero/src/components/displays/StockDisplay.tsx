import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectStock} from "@ord-components/forms/select/selectDataSource/useSelectStock";
import React from "react";

export const StockDisplay = (props: {
    value: any
}) => {
    return <>
        <DisplayTextFormSelectDataSource value={props.value}
                                         datasource={useSelectStock()}></DisplayTextFormSelectDataSource>
    </>
}
