import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import React from "react";
import {useSelectMoveType} from "@ord-components/forms/select/selectDataSource/useSelectMoveType";

export const StockMoveTypeDisplay = (props: {
    value: any
}) => {
    return <>
        <DisplayTextFormSelectDataSource value={props.value}
                                         datasource={useSelectMoveType()}></DisplayTextFormSelectDataSource>
    </>
}
