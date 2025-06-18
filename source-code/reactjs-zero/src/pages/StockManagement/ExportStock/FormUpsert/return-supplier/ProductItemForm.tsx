import {observer} from "mobx-react-lite";
import React from "react";
import {Button, Form} from "antd";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import LotNumberWithStockInventoryInput
    from "@pages/StockManagement/Shared/Upsert/grid-product/forms/LotNumberWithStockInventoryInput";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {SumIcon} from "@ord-components/icon/SumIcon";
import DiscountProduct from "@pages/StockManagement/Shared/Upsert/grid-product/forms/DiscountProduct";
import withPriceDiscountTaxFull from "@pages/StockManagement/Shared/hoc/withPriceDiscountTaxFull";
import {IProductFormItemHoc, withProductFormItem} from "@pages/StockManagement/Shared/hoc/withProductFormItem";
import QtyAndUnitReadOnlyProduct
    from "@pages/StockManagement/Shared/Upsert/grid-product/forms/QtyAndUnitReadOnlyProduct";
import {MoveType, StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";

const ExportReturnSupplierProductItemForm = (props: IProductFormItemHoc) => {
    const {
        taxCode,
        productItem,
        totalAmountBeforeDiscount,
        totalAmountAfterDiscount,
        moveInventoryId
    } = props;
    const {editData} = useUpsertStockMove();
    const {field, remove, formMoveTicket} = props;
    const relatedMoveId_w = Form.useWatch('relatedMoveId', formMoveTicket);
    const tdClassName = "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";
    const taxPercentCombo = useSelectTaxCode();
    const form = Form.useFormInstance();

    const subTaxAmount_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'subTaxAmount'], form);

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
                    <td
                        className={tdClassName}>
                        <QtyAndUnitReadOnlyProduct field={field}></QtyAndUnitReadOnlyProduct>
                    </td>
                    <td className={tdClassName + ' text-right '}>
                        <Form.Item name={[field.name, 'price']}
                                   className='ord-input-bottom-line'
                                   rules={[ValidateUtils.requiredShortMess]}>
                            <PriceNumberInput min={0} step={1000} disabled={true}
                                              className={'not-handler-wrap text-right'}/>
                        </Form.Item>
                        {
                            totalAmountBeforeDiscount > 0 && <>
                                <SumIcon className={'me-1'}/>
                                <PriceCell value={totalAmountBeforeDiscount}/>
                            </>
                        }
                        <Form.Item hidden name={'totalAmountBeforeDiscount'} />
                    </td>
                    <td className={tdClassName + ' text-right '}>
                        <DiscountProduct disabled={true} field={field} productItem={productItem}/>
                    </td>
                    <td className={tdClassName + " text-right "}>
                        <Form.Item className="ord-input-bottom-line"
                                   name={[field.name, "taxCode"]} initialValue={taxCode}>
                            {/*không cho sửa thue khi sửa phiếu xuất trả ncc*/}
                            <OrdSelect allowClear={false}
                                       disabled={true}
                                       className='h-[31px]'
                                       onChange={(data, option: IOrdSelectOption) => {
                                           form.setFieldValue([StockMoveFormName.ProductItems, field.name, "taxPercent"], option.data?.taxPercent);
                                       }}
                                       datasource={taxPercentCombo}
                            />
                        </Form.Item>
                        <Form.Item hidden name={"subTaxAmount"}></Form.Item>
                        <Form.Item hidden name={"taxPercent"}></Form.Item>
                        {subTaxAmount_w > 0 && (
                            <>
                                <SumIcon className={"me-1"}/>
                                <PriceCell value={subTaxAmount_w}/>
                            </>
                        )}
                    </td>
                    <td className={tdClassName + ' text-right '}>
                        {
                            totalAmountAfterDiscount > 0 ? <PriceCell fixed={2}
                                                                      value={totalAmountAfterDiscount}/> : (0)
                        }
                        <span hidden>
                              <Form.Item noStyle hidden name={[field.name, 'taxPercent']}/>
                              <Form.Item noStyle hidden name={[field.name, 'taxAmount']}/>
                        </span>
                    </td>
                </>

            }
            <td className='align-top py-3 text-right '>
                {
                    editData?.moveDto?.moveType !== MoveType.PhieuXuatTraNhaCungCap &&
                    <Button type="text" danger onClick={() => {
                        remove(field.name);
                    }} icon={<Delete2Icon/>}/>
                }
            </td>

        </>
    );
}
export default observer(withProductFormItem(withPriceDiscountTaxFull(ExportReturnSupplierProductItemForm)));
