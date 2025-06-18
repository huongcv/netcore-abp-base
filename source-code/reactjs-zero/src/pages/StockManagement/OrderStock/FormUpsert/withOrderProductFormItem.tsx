import React, {ComponentType, useEffect, useState} from 'react';
import {Form} from 'antd';
import {ProductShopItemFormProps} from "@pages/StockManagement/Shared/Upsert/Props";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {GdpOrderStockMoveDetailDto, OrderStockMoveDetailDto} from "@api/index.defs";

export interface IProductTenantFormItemHoc extends ProductShopItemFormProps {
    productItem?: OrderStockMoveDetailDto | GdpOrderStockMoveDetailDto,
    totalAmount: number,
    price: number,
    costPrice: number,
    convertRate: number,
    qty: number,
    totalAmountBeforeDiscount: number,
    taxPercent: number,
    isNotEnoughInventoryStock?: boolean,
    moveInventoryId: string,
    moveHashId: string,
}


// Higher Order Component để theo dõi các giá trị trong form và truyền ra ngoài qua props
export const withOrderProductFormItem = (WrappedComponent: ComponentType<any>) => {
    return (props: ProductShopItemFormProps) => {
        const [productItem, setProductItem] = useState<OrderStockMoveDetailDto | GdpOrderStockMoveDetailDto | null>(null);
        const {field, remove, formMoveTicket, fieldShop} = props;
        const form = Form.useFormInstance();
        // Theo dõi các giá trị trong form
        const itemValue_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name], form);
        const totalAmount_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'totalAmount'], form);
        const price_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'price'], form);
        const costPrice_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'costPrice'], form);
        const convertRate_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'convertRate'], form);
        const qty_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'qty'], form);
        const taxPercent_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'taxPercent'], form);
        const totalAmountBeforeDiscount_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'totalAmountBeforeDiscount'], form);
        const isNotEnoughInventoryStock_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'isNotEnoughInventoryStock'], form);

        const move_inventoryId_w = Form.useWatch('inventoryId', formMoveTicket);
        const moveId_w = Form.useWatch('moveHashId', formMoveTicket);
        useEffect(() => {
            setProductItem({
                ...itemValue_w
            });
        }, [itemValue_w]);
        // Truyền các giá trị theo dõi vào component con
        return (
            <WrappedComponent
                {...props}
                productItem={productItem}
                totalAmount={totalAmount_w || 0}
                price={price_w || 0}
                costPrice={costPrice_w || 0}
                convertRate={convertRate_w || 1}
                qty={qty_w || 0}
                isNotEnoughInventoryStock={isNotEnoughInventoryStock_w}
                moveInventoryId={move_inventoryId_w || ''}
                moveHashId={moveId_w || ''}
                totalAmountBeforeDiscount={totalAmountBeforeDiscount_w || 0}
                taxPercent={taxPercent_w || 0}
            />
        );
    };
};
