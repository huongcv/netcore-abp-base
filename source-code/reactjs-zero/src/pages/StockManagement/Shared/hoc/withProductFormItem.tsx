import React, {ComponentType, useEffect, useState} from 'react';
import {Form} from 'antd';
import {ProductItemFormProps} from "@pages/StockManagement/Shared/Upsert/Props";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {ProductSearchWithUnitDto} from "@api/index.defs";

export interface IProductFormItemHoc extends ProductItemFormProps {
    productItem?: ProductSearchWithUnitDto,
    totalAmount: number,
    price: number,
    costPrice: number,
    convertRate: number,
    qty: number,
    totalAmountBeforeDiscount: number,
    totalAmountAfterDiscount: number,
    taxPercent: number,
    taxCode: string | undefined | null,
    isNotEnoughInventoryStock?: boolean,
    moveInventoryId: string,
    moveHashId: string,
}

// Higher Order Component để theo dõi các giá trị trong form và truyền ra ngoài qua props
export const withProductFormItem = (WrappedComponent: ComponentType<any>) => {
    return (props: ProductItemFormProps) => {
        const [productItem, setProductItem] = useState<ProductSearchWithUnitDto | null>(null);
        const {field, remove, formMoveTicket} = props;
        const form = Form.useFormInstance();
        // Theo dõi các giá trị trong form
        const itemValue_w = Form.useWatch([StockMoveFormName.ProductItems, field.name], form);
        const totalAmount_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'totalAmount'], form);
        const price_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'price'], form);
        const costPrice_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'costPrice'], form);
        const convertRate_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'convertRate'], form);
        const qty_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'qty'], form);
        const taxPercent_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'taxPercent'], form);
        const taxCode_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'taxCode'], form);
        const totalAmountBeforeDiscount_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'totalAmountBeforeDiscount'], form);
        const totalAmountAfterDiscount_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'totalAmountAfterDiscount'], form);
        const isNotEnoughInventoryStock_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'isNotEnoughInventoryStock'], form);
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
                totalAmountAfterDiscount={totalAmountAfterDiscount_w || 0}
                taxPercent={taxPercent_w || 0}
            />
        );
    };
};
