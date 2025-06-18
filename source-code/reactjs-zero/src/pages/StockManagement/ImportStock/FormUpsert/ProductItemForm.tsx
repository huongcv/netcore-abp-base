import {observer} from "mobx-react-lite";
import {Button, Form} from "antd";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import QtyAndUnitProduct from "@pages/StockManagement/Shared/Upsert/grid-product/forms/QtyAndUnitProduct";
import DiscountProduct from "@pages/StockManagement/Shared/Upsert/grid-product/forms/DiscountProduct";
import LotProductInput from "@pages/StockManagement/Shared/Upsert/grid-product/forms/LotProduct";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {SumIcon} from "@ord-components/icon/SumIcon";
import withPriceDiscountTaxFull from "@pages/StockManagement/Shared/hoc/withPriceDiscountTaxFull";
import {IProductFormItemHoc, withProductFormItem,} from "@pages/StockManagement/Shared/hoc/withProductFormItem";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import {useTranslation} from "react-i18next";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";

const ImportProductItemForm = (props: IProductFormItemHoc) => {
    const {
        taxCode,
        productItem,
        totalAmountBeforeDiscount,
        totalAmountAfterDiscount,
    } = props;
    const {field, remove} = props;
    const taxList = useSelectTaxCode();
    const tdClassName =
        "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";
    const form = Form.useFormInstance();
    const {t} = useTranslation('stock');

    const subTaxAmount_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'subTaxAmount'], form);

    return (
        <>
            <td className={tdClassName + " text-center"}>{1 + field.name}</td>
            {productItem && (
                <>
                    <td className={tdClassName}>
                        <TextLineClampDisplay className='!text-[#505050] !font-medium !text-base'
                                              content={productItem.productName!}/>
                        <LotProductInput
                            enableAddNewEntity
                            productItem={productItem}
                            field={field}
                        />
                    </td>

                    <QtyAndUnitProduct productItem={productItem} tdClassName={tdClassName} field={field}/>

                    <td className={tdClassName + " text-right "}>
                        <Form.Item
                            name={[field.name, "price"]}
                            className="ord-input-bottom-line"
                            rules={[ValidateUtils.requiredShortMessWithText(t('priceImportField'))]}
                        >
                            <PriceNumberInput
                                min={0}
                                step={1000}
                                decimalLimit={5}
                                integerLimit={13}
                                className={"not-handler-wrap text-right"}
                            />
                        </Form.Item>
                        {totalAmountBeforeDiscount > 0 && (
                            <>
                                <SumIcon className={"me-1"}/>
                                <PriceCell value={totalAmountBeforeDiscount}/>
                            </>
                        )}
                        <Form.Item hidden name={"totalAmountBeforeDiscount"}/>
                    </td>
                    <td className={tdClassName + " text-right "}>
                        <DiscountProduct field={field} productItem={productItem}/>
                    </td>
                    <td className={tdClassName + " text-right "}>
                        <Form.Item className="ord-input-bottom-line"
                                   name={[field.name, "taxCode"]} initialValue={taxCode}>
                            <OrdSelect className='h-[31px]' allowClear={false} datasource={taxList}
                                       onChange={(data, option: IOrdSelectOption) => {
                                           form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'taxPercent'], option.data?.taxPercent);
                                       }}
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
                    <td className={tdClassName + " text-right "}>
                        {totalAmountAfterDiscount > 0 ? <PriceCell fixed={2} value={totalAmountAfterDiscount}/> : 0}
                        <div hidden>
                            <Form.Item noStyle name={[field.name, "taxAmount"]}/>
                            <Form.Item noStyle name={[field.name, "subTotalAmount"]}/>
                        </div>
                    </td>
                </>
            )}

            <td className="align-top py-3 text-right ">
                <Button type="text" danger onClick={() => {
                    remove(field.name);
                }} icon={<Delete2Icon/>}/>
            </td>
        </>
    );
};
export default observer(
    withProductFormItem(withPriceDiscountTaxFull(ImportProductItemForm))
);
