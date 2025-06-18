import {observer} from "mobx-react-lite";
import React, {useEffect, useState} from "react";
import {Form, Input} from "antd";
import {CloseOutlined, DeleteOutlined} from "@ant-design/icons";
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
import {useSelectShop} from "@ord-components/forms/select/selectDataSource/useSelectShop";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import QtyAndProductView from "@pages/StockManagement/GdpOrderStock/FormUpsert/QtyAndProductView";
import ExpQtyAndUnitProduct from "@pages/StockManagement/GdpOrderStock/FormUpsert/ExpQtyAndUnitProduct";
import {GdpOrderStockMoveDetailDto} from "@api/index.defs";
import DiscountProduct from "@pages/StockManagement/Shared/Upsert/grid-product/forms/DiscountProduct";
import DiscountGdpOrderProduct from "@pages/StockManagement/GdpOrderStock/FormUpsert/DiscountGdpOrderProduct";
import {VatCell} from "@ord-components/table/cells/VatCell";
import {SumIcon} from "@ord-components/icon/SumIcon";
import {
    IGdpProductFormItemHoc,
    withGdpOrderProductFormItem
} from "@pages/StockManagement/GdpOrderStock/hoc/withGdpOrderProductFormItem";
import QtyAndUnitProduct from "@pages/StockManagement/Shared/Upsert/grid-product/forms/QtyAndUnitProduct";
import GdpQtyAndUnitProduct from "@pages/StockManagement/GdpOrderStock/FormUpsert/ExpQtyAndUnitProduct";

const GdpOrderProductItemForm: React.FC<IGdpProductFormItemHoc> = (props: IGdpProductFormItemHoc) => {
    const {
        taxPercent,
        productItem,
        totalAmount,
        totalAmountBeforeDiscount,
        costPrice,
        convertRate,
        qty,
        isNotEnoughInventoryStock,
        moveInventoryId,
        price
    } = props;
    const {parentItem} = (productItem ?? {}) as GdpOrderStockMoveDetailDto
    const {editData} = useUpsertStockMove();
    const {field, formMoveTicket} = props;
    const form = Form.useFormInstance();
    const [t] = useTranslation('gdpOrderStock');
    const tdClassName = "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";
    const [orderTotalAmount, setOrderTotalAmount] = useState<number>()
    useEffect(() => {
        const totalAmount = (parentItem?.qty || 0) * (parentItem?.price || 0);
        setOrderTotalAmount(totalAmount);
    }, [parentItem?.qty, parentItem?.price]);
    useEffect(() => {
        const totalAmount = (qty || 0) * (price || 0);
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'totalAmount'], totalAmount);
    }, [qty, price]);
    const setQty0 = () => {
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'qty'],
            0);
    }
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
            <tr className="even:bg-gray-50 grid-form" key={field.key}>
                <td className={tdClassName + ' text-center'}>
                    {1 + field.name}
                </td>
                {
                    productItem &&
                    <>
                        <td className={tdClassName + (qty > 0 ? '' : ' line-through')}>
                            <ProductInMoveStockDisplay productItem={productItem}></ProductInMoveStockDisplay>
                        </td>

                        <td className={tdClassName + ' text-center ' + (qty > 0 ? '' : ' line-through')}>
                            {parentItem &&
                                <>
                                    <QtyAndProductView productItem={parentItem}></QtyAndProductView>
                                    <div>
                                        x <PriceCell fixed={2}
                                                     value={parentItem.price}/>
                                    </div>
                                    <div>
                                        = <PriceCell fixed={2}
                                                     value={orderTotalAmount}/>
                                    </div>

                                </>
                            }
                        </td>
                        <td className={tdClassName + ' text-center '}>
                            <GdpQtyAndUnitProduct productItem={productItem}
                                                  field={field}></GdpQtyAndUnitProduct>
                        </td>
                        <td className={tdClassName + ' text-right '}>
                            {/*<Form.Item noStyle hidden name={[field.name, 'costPrice']}></Form.Item>*/}
                            <Form.Item name={[field.name, 'price']}
                                       className='ord-input-bottom-line'
                                       rules={[ValidateUtils.requiredShortMess]}>
                                <PriceNumberInput min={0} step={1000} className={'not-handler-wrap text-right'}/>
                            </Form.Item>
                            {
                                totalAmountBeforeDiscount > 0 && <>
                                    <SumIcon className={'me-1'}/>
                                    <PriceCell value={totalAmountBeforeDiscount}/>
                                </>
                            }
                            <Form.Item hidden name={'totalAmountBeforeDiscount'}>
                                <Input/>
                            </Form.Item>

                        </td>
                        <td className={tdClassName + ' text-right '}>

                            <DiscountGdpOrderProduct field={field} productItem={productItem}/>

                        </td>
                        <td className={tdClassName + ' text-right '}>
                            {
                                totalAmount > 0 ? <PriceCell fixed={2}
                                                             value={totalAmount}/> : (0)
                            }
                            <p>
                                {
                                    taxPercent > 0 && <VatCell taxPercent={taxPercent}/>
                                }

                            </p>
                            <span hidden>
                                        <Form.Item noStyle hidden name={[field.name, 'taxPercent']}/>
                                        <Form.Item noStyle hidden name={[field.name, 'taxAmount']}/>
                                    </span>
                        </td>
                    </>

                }
                <td className='align-top py-3 text-right '>
                    <CloseOutlined className='text-red block'
                                   onClick={() => {
                                       setQty0();
                                   }}
                    />
                </td>
            </tr>

        </>
    );
}
export default observer(withGdpOrderProductFormItem(GdpOrderProductItemForm));
