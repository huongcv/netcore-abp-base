import React from "react";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {SearchIsActived} from "@ord-components/forms/search/SearchIsActived";

export const SearchFilterAndIsActived = () => {
    return (<>
        <SearchIsActived />
        <SearchFilterText placeHolder='Mã thuê bao, mã của hàng, tên cửa hàng để tìm kiếm' span={12}/>
    </>);
}
