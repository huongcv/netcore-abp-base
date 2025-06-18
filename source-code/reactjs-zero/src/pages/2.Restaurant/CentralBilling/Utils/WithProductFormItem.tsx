import { ProductSearchWithUnitDto } from "@api/index.defs";
import { Form } from 'antd';
import { ComponentType, useEffect, useState } from 'react';
import { ProductItemFormProps } from "../types/type";

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
    isNotEnoughInventoryStock?: boolean,
    inventoryId: string,
    shopName?: string,
}

export const withProductFormItem = (WrappedComponent: ComponentType<any>) => {
    return (props: ProductItemFormProps) => {
        const [productItem, setProductItem] = useState<ProductSearchWithUnitDto | null>(null);
        const { field, remove, formInfo } = props;
        const form = Form.useFormInstance();

        const itemValue_w = Form.useWatch(['saleInvoiceDetails', field.name], form);
        const totalAmount_w = Form.useWatch(['saleInvoiceDetails', field.name, 'totalAmount'], form);
        const price_w = Form.useWatch(['saleInvoiceDetails', field.name, 'price'], form);
        const convertRate_w = Form.useWatch(['saleInvoiceDetails', field.name, 'convertRate'], form);
        const qty_w = Form.useWatch(['saleInvoiceDetails', field.name, 'qty'], form);
        const taxPercent_w = Form.useWatch(['saleInvoiceDetails', field.name, 'taxPercent'], form);
        const totalAmountBeforeDiscount_w = Form.useWatch(['saleInvoiceDetails', field.name, 'totalAmountBeforeDiscount'], form);
        const totalAmountAfterDiscount_w = Form.useWatch(['saleInvoiceDetails', field.name, 'totalAmountAfterDiscount'], form);
        const isNotEnoughInventoryStock_w = Form.useWatch(['saleInvoiceDetails', field.name, 'isNotEnoughInventoryStock'], form);
        const shopName_w = Form.useWatch(['saleInvoiceDetails', field.name, 'shopName'], form);

        useEffect(() => {
            setProductItem({
                ...itemValue_w
            });
        }, [itemValue_w]);

        return (
            <WrappedComponent
                {...props}
                productItem={productItem}
                totalAmount={totalAmount_w || 0}
                price={price_w || 0}
                convertRate={convertRate_w || 1}
                qty={qty_w || 0}
                isNotEnoughInventoryStock={isNotEnoughInventoryStock_w}
                totalAmountBeforeDiscount={totalAmountBeforeDiscount_w || 0}
                totalAmountAfterDiscount={totalAmountAfterDiscount_w || 0}
                taxPercent={taxPercent_w || 0}
                shopName={shopName_w || ""}
            />
        );
    };
};
