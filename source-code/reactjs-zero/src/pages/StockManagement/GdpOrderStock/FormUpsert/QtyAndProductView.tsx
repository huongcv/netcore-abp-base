import {Form} from "antd";
import React from "react";
import {useSelectProductUnit} from "@ord-components/forms/select/selectDataSource/useSelectProductUnit";
import {OrderStockMoveDetailDto} from "@api/index.defs";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";

const QtyAndProductView = (props: {
    productItem: OrderStockMoveDetailDto
}) => {
    const {productItem} = props;
    const shopId_w = Form.useWatch(["shopId"]);
    const productUnitSelectOption = useSelectProductUnit(productItem?.productId, shopId_w);
    return (<>
        {productItem.qty} <DisplayTextFormSelectDataSource value={productItem?.productUnitId}
                                         datasource={productUnitSelectOption}></DisplayTextFormSelectDataSource>
    </>)
}
export default QtyAndProductView;
