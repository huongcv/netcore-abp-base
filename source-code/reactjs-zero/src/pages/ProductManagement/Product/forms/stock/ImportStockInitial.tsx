import {Form, InputNumber} from "antd";
import React from "react";
import {useTranslation} from "react-i18next";
import ImportStockWhenCreateProductNotUsingLot
    from "@pages/ProductManagement/Product/forms/stock/import-stock-create-product/ProductNotUsingLotNumber";
import ImportStockWhenCreateProductUsingLot
    from "@pages/ProductManagement/Product/forms/stock/import-stock-create-product/ProductUsingLotNumber";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";

interface Props {
    mode: 'add' | 'edit' | 'detail';
}

export const ImportStockInitial = (props: Props) => {
    const {mode} = props;
    const {t} = useTranslation('product');
    const {t: tCommon} = useTranslation('common');
    const form = Form.useFormInstance();
    const isProductUseInventory_w = Form.useWatch('isProductUseInventory', form);
    const isProductUseLotNumber_w = Form.useWatch('isProductUseLotNumber', form);
    const QtyMinMax = () => {
        return <>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t("inventoryQtyMin")}>
                    <Form.Item name="inventoryQtyMin">
                        <InputNumber
                            style={{width: "100%"}}
                            min={0}
                            onKeyDown={(e) => {
                                if (
                                    !/[\d]/.test(e.key) &&
                                    e.key !== "Backspace" &&
                                    e.key !== "ArrowLeft" &&
                                    e.key !== "ArrowRight"
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t("inventoryQtyMax")}>
                    <Form.Item name="inventoryQtyMax">
                        <InputNumber
                            style={{width: "100%"}}
                            min={0}
                            onKeyDown={(e) => {
                                if (
                                    !/[\d]/.test(e.key) &&
                                    e.key !== "Backspace" &&
                                    e.key !== "ArrowLeft" &&
                                    e.key !== "ArrowRight"
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
        </>
    }
    return (
        <>
            {
                mode == 'add' && isProductUseInventory_w && !isProductUseLotNumber_w &&
                <>
                    <ImportStockWhenCreateProductNotUsingLot/>
                    <QtyMinMax></QtyMinMax>
                </>
            }
            {
                mode == 'add' && isProductUseInventory_w && isProductUseLotNumber_w &&
                <>
                    <QtyMinMax></QtyMinMax>
                    <ImportStockWhenCreateProductUsingLot/>
                </>
            }
        </>

    )
        ;
}
