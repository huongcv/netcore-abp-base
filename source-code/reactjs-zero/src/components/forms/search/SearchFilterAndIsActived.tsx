import React from "react";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {SearchIsActived} from "@ord-components/forms/search/SearchIsActived";

export const SearchFilterAndIsActived = (props: {
    placeHolder?: string;
}) => {
    return (<>
        <SearchIsActived/>
        <SearchFilterText placeHolder={props?.placeHolder} span={12}/>
    </>);
}
