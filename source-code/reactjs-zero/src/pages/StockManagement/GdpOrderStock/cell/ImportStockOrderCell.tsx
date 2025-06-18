import {OrderStockMoveDto} from "@api/index.defs";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import React from "react";
import {useSelectShopUsingIsStock} from "@ord-components/forms/select/selectDataSource/useSelectShopUsingIsStock";
import {useSelectShop} from "@ord-components/forms/select/selectDataSource/useSelectShop";

export const ImportStockOrderCell = (props: {
    moveDto?: OrderStockMoveDto | null,
}) => {
    const {moveDto} = props;
    return (
        <>
            <span className={'mx-1'}>
            <DisplayTextFormSelectDataSource value={moveDto?.shopId}
                                             datasource={useSelectShop(true)}></DisplayTextFormSelectDataSource>
                </span>
        </>
    );
}
