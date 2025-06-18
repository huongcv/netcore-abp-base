import {observer} from "mobx-react-lite";
import React, {useEffect} from "react";
import {Button, Form} from "antd";
import QtyAndUnitProduct from "@pages/StockManagement/Shared/Upsert/grid-product/forms/QtyAndUnitProduct";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import LotNumberWithStockInventoryInput
    from "@pages/StockManagement/Shared/Upsert/grid-product/forms/LotNumberWithStockInventoryInput";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {IProductFormItemHoc, withProductFormItem} from "@pages/StockManagement/Shared/hoc/withProductFormItem";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";

const TransferProductItemForm: React.FC<IProductFormItemHoc> = (props: IProductFormItemHoc) => {
    const {
        productItem,
        totalAmount,
        qty,
        moveInventoryId,
        price
    } = props;
    const {field, remove} = props;
    const form = Form.useFormInstance();
    const tdClassName = "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";

    useEffect(() => {
        const totalAmount = (qty || 0) * (price || 0);
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'totalAmount'], totalAmount);
    }, [qty, price]);

    return (
        <>
            <td className={tdClassName + ' text-center'}>
                {1 + field.name}
            </td>
            {
                productItem &&
                <>
                    <td className={tdClassName}>
                        <TextLineClampDisplay className='!text-[#505050] !font-medium !text-[15px]'
                                              content={productItem.productName!}/>
                        <LotNumberWithStockInventoryInput productItem={productItem} field={field}
                                                          inventoryId={moveInventoryId}/>
                    </td>
                    {productItem &&
                        <QtyAndUnitProduct tdClassName={tdClassName} productItem={productItem}
                                           field={field}/>
                    }
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
                <Button type="text" danger onClick={() => {
                    remove(field.name);
                }} icon={<Delete2Icon/>}/>
            </td>

        </>
    );
}
export default observer(withProductFormItem(TransferProductItemForm));
