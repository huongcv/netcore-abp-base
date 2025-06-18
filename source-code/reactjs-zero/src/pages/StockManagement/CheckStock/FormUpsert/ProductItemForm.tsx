import {observer} from "mobx-react-lite";
import React, {useEffect} from "react";
import {Button, Form} from "antd";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import LotNumberWithStockInventoryInput
    from "@pages/StockManagement/Shared/Upsert/grid-product/forms/LotNumberWithStockInventoryInput";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useTranslation} from "react-i18next";
import {IProductFormItemHoc, withProductFormItem} from "@pages/StockManagement/Shared/hoc/withProductFormItem";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import DateUtil from "@ord-core/utils/date.util";
import {StockProductUnitDto} from "@api/index.defs";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";

const CheckProductItemForm: React.FC<IProductFormItemHoc> = (props: IProductFormItemHoc) => {
    const {editData} = useUpsertStockMove();
    const {productItem, costPrice, convertRate, qty, moveInventoryId} = props;
    const {field, remove} = props;
    const form = Form.useFormInstance();
    const [t] = useTranslation('stock');
    const tdClassName = "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";

    useEffect(() => {
        const totalAmount = (qty || 0) * (convertRate || 1) * (costPrice || 0);
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'totalAmount'], totalAmount);
    }, [qty, costPrice, convertRate]);
    const openingInventoryQty_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'openingInventoryQty'], form);
    const qty_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'qty'], form);
    const lotNumber_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'lotNumber']);
    const lotNumbers_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'lotNumbers']);
    const expiryDate_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'expiryDate']);
    const closingInventoryQty_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'closingInventoryQty']);
    const moveLineDetailId_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'moveLineDetailId']);

    useEffect(() => {
        const qty = (closingInventoryQty_w ?? 0) - (openingInventoryQty_w ?? 0);
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'qty'], qty);
    }, [closingInventoryQty_w]);

    const changeLotNumber = (lotNumber: StockProductUnitDto) => {
        const find = lotNumbers_w?.find((x: any) => x.inventoryLineDetailsId == lotNumber.inventoryLineDetailsId);
        if (find) {
            form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'openingInventoryQty'], find.qty);
        }
    }

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
                        {
                            !editData || (!!editData && !(moveLineDetailId_w > 0)) ?
                                <LotNumberWithStockInventoryInput changeLotNumber={changeLotNumber}
                                                                  productItem={productItem} field={field}
                                                                  inventoryId={moveInventoryId}/>
                                :
                                <div>
                                    {
                                        !!lotNumber_w &&
                                        <span className={'font-semibold text-[14px]'}>Số lô: {lotNumber_w} </span>
                                    }
                                    {
                                        !!expiryDate_w &&
                                       <span className={'ms-1 italic text-[14px]'}>
                                           - HSD: {DateUtil.showWithFormat(expiryDate_w)}
                                        </span>
                                    }
                                </div>
                        }

                    </td>
                    <td className={tdClassName + ' text-center italic'}>
                        {productItem.unitName}
                    </td>

                </>
            }
            <td
                className={tdClassName + ' text-end'}>
                {
                    <PriceCell value={openingInventoryQty_w} fixed={0}></PriceCell>
                }
            </td>
            <td
                className={tdClassName + ' text-end'}>
                {productItem &&
                    <Form.Item name={[field.name, 'closingInventoryQty']}
                               className='ord-input-bottom-line'
                               rules={[ValidateUtils.mustGreaterThanZeroWithText(t('closingInventoryQty'))]}>
                        <PriceNumberInput decimalLimit={0} isOnlyNumberInput min={0}
                                          className={'not-handler-wrap text-right'}/>
                    </Form.Item>
                }

            </td>
            <td className={tdClassName + ' text-right font-bold'}>
                {
                    qty_w != 0 ?
                        <span className={qty_w < 0 ? 'giam-kho' : 'tang-kho'}>
                         <PriceCell value={qty_w} fixed={0}></PriceCell>
                    </span> :
                        <span>0</span>
                }

            </td>
            <td className='align-top py-3 text-right '>
                <Button type="text" danger onClick={() => {
                    remove(field.name);
                }} icon={<Delete2Icon/>}/>

                <span hidden>
                    <Form.Item noStyle name={[field.name, 'openingInventoryQty']}></Form.Item>
                    <Form.Item noStyle name={[field.name, 'closingInventoryQty']}></Form.Item>
                    <Form.Item noStyle name={[field.name, 'qty']}></Form.Item>
                    <Form.Item noStyle name={[field.name, 'moveLineDetailId']}></Form.Item>
                </span>
            </td>

        </>
    );
}
export default observer(withProductFormItem(CheckProductItemForm));
