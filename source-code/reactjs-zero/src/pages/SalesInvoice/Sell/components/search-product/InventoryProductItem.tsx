import {ProductDto} from "@api/index.defs";
import {useStockMain} from "@ord-components/hooks/useStockMain";
import useFilterProductInventoryAvailable from "@ord-core/db/queries/invetoryLines/useGetInventoryStockProduct";
import * as React from "react";
import {useEffect} from "react";
import {NumericFormat} from "react-number-format";

export const InventoryProductItem = (props: {
    product: ProductDto
}) => {
    // const [mainStockInventoryId] = useStockMain();
    // // @ts-ignore
    // const inventoryCurrent = useFilterProductInventoryAvailable(mainStockInventoryId || 0, props.product?.id || 0);
    // useEffect(() => {
    //     // @ts-ignore
    //     props.product.inventoryCurrentQty = inventoryCurrent || 0;
    // }, [inventoryCurrent]);
    // return (<div>Tồn: {
    //     <NumericFormat value={inventoryCurrent || 0}
    //                    displayType={'text'}
    //                    thousandSeparator={true}/>}
    // </div>)
    return (<div>Tồn: {
        <NumericFormat value={props.product.inventoryCurrentQty || 0}
                       displayType={'text'}
                       thousandSeparator={true}/>}
    </div>)
}
