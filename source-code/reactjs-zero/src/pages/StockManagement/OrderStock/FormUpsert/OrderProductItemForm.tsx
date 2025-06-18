import {observer} from "mobx-react-lite";
import React, {useEffect} from "react";
import {Form} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {
    ProductInMoveStockDisplay
} from "@pages/StockManagement/Shared/Upsert/grid-product/cells/ProductInMoveStockDisplay";
import {
    IProductTenantFormItemHoc,
    withOrderProductFormItem
} from "@pages/StockManagement/OrderStock/FormUpsert/withOrderProductFormItem";
import QtyAndUnitProductShop from "@pages/StockManagement/Shared/Upsert/grid-product/forms/QtyAndUnitProductShop";
import {fetchSyncDataProducts} from "@ord-core/db/services/syncDataProducts";

const OrderProductItemForm: React.FC<IProductTenantFormItemHoc> = (props: IProductTenantFormItemHoc) => {
    const {
        productItem,
        totalAmount,
        costPrice,
        convertRate,
        qty,
        isNotEnoughInventoryStock,
        moveInventoryId,
        price
    } = props;
    const {editData} = useUpsertStockMove();
    const {field, fieldShop, remove, formMoveTicket} = props;
    const form = Form.useFormInstance();
    const [t] = useTranslation('orderStock');
    const tdClassName = "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";

    useEffect(() => {
        const totalAmount = (qty || 0) * (price || 0);
        form.setFieldValue([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'totalAmount'], totalAmount);
    }, [qty, price]);
    useEffect(() => {
        console.log("productItem", productItem)
    }, [productItem]);

    //
    //
    // const isErrorEnoughStock_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'isErrorEnoughStock']);
    // useEffect(() => {
    //     if (isErrorEnoughStock_w == true) {
    //         UiUtils.showError(t('notEnoughInventoryStock', {
    //             ...productItem
    //         }));
    //         if (!editData) {
    //             remove(field.name);
    //         }
    //     }
    // }, [isErrorEnoughStock_w]);


    return (
        <>
            <td className={tdClassName + ' text-center'}>
                {1 + field.name}
            </td>
            {
                productItem &&
                <>
                    <td className={tdClassName}>
                        <ProductInMoveStockDisplay productItem={productItem}></ProductInMoveStockDisplay>
                    </td>
                    <td
                        className={tdClassName}>

                        {productItem &&
                            <QtyAndUnitProductShop productItem={productItem}
                                                   fieldShop={fieldShop}
                                                   field={field}/>
                        }

                    </td>
                    <td className={tdClassName + ' text-right '}>
                        <Form.Item noStyle hidden name={[field.name, 'costPrice']}></Form.Item>
                        <Form.Item name={[field.name, 'price']}
                                   className='ord-input-bottom-line'
                                   rules={[ValidateUtils.requiredShortMess]}>
                            <PriceNumberInput min={0} step={1000} className={'not-handler-wrap text-right'}/>
                        </Form.Item>

                    </td>
                    <td className={tdClassName + ' text-right '}>
                        {
                            totalAmount > 0 ? <PriceCell fixed={2}
                                                         value={totalAmount}/> : (0)
                        }
                    </td>
                </>

            }
            <td className='align-top py-3 text-right '>
                <DeleteOutlined className='text-red block'

                                onClick={() => {
                                    remove(field.name);
                                }}
                />
            </td>

        </>
    );
}

export default observer(withOrderProductFormItem(OrderProductItemForm));
