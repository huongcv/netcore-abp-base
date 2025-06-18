import {ProductDto} from "@api/index.defs";
import React from "react";
import ProductInventoryStockMoveList_ProductUseInventory
    from "@pages/ProductManagement/Product/stock-detail/inventoryStockProductUseInventory";
import ProductInventoryStockMoveList_ProductNotUseInventory
    from "@pages/ProductManagement/Product/stock-detail/inventoryStockProductNotInventory";

const ProductInventoryStockMoveList = (props: {
    productDto: ProductDto | null | undefined
}) => {
    return (<>
        {
            // props.productDto?.isProductUseInventory == true ?
            //     <ProductInventoryStockMoveList_ProductUseInventory {...props}/> :
            //     <ProductInventoryStockMoveList_ProductNotUseInventory {...props}/>
            <ProductInventoryStockMoveList_ProductUseInventory {...props}/>
        }
    </>);
}
export default ProductInventoryStockMoveList;
