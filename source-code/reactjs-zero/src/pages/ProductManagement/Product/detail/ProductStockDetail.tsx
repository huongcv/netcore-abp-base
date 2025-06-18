import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {Card} from "antd";
import React from "react";
import ProductInventoryStockList from "@pages/ProductManagement/Product/stock-detail/inventoryStock";
import ProductInventoryStockMoveList from "@pages/ProductManagement/Product/stock-detail/inventoryStockMove";


const ProductDetail_StockInformation = () => {
    const [t] = useTranslation('product');
    const {productStockDetailStore: mainStore} = useStore();
    const {productDto} = mainStore;
    return (<div className={'product-detail-stock-information'}>
        <Card title={t('inventoryStock')} className={'mt-5'}>
            <ProductInventoryStockList productDto={productDto}/>
        </Card>
        <Card title={t('inventoryStockMove')} className={'mt-5'}>
            <ProductInventoryStockMoveList productDto={productDto}/>
        </Card>


    </div>);
}
export default observer(ProductDetail_StockInformation);
