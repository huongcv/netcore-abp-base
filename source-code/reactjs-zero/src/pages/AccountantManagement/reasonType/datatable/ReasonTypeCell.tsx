import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import React from "react";
import {useSelectReasonTypeEnum} from "@ord-components/forms/select/selectDataSource/useSelectReasonTypeEnum";

export const ReasonTypeCell = (props: {
    value: number
}) => {
    const selectReasonTypeEnum = useSelectReasonTypeEnum();
    return <DisplayTextFormSelectDataSource
        datasource={selectReasonTypeEnum}
        value={props.value}/>
}
