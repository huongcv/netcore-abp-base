import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { Delete2Icon } from "@ord-components/icon/DeleteIcon";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { Button, Form } from "antd";
import { observer } from "mobx-react-lite/src/observer";

import "@pages/Order/index.scss";
import validateUtils from "@ord-core/utils/validate.utils";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import { SumIcon } from "@ord-components/icon/SumIcon";
import { IProductFormItemHoc, withProductFormItem } from "./WithProductFormItem";
import QtyAndUnitProduct from "./QtyAndUnitProduct";
import DiscountProductInput from "./DiscountProductInput";
import withPriceDiscountTaxFull from "./WithPriceDiscountTaxFull";
import LotProductInput from "./LotProductInput";

const ProductBodyTable = (props: IProductFormItemHoc) => {
    const {
        taxPercent,
        productItem,
        totalAmountBeforeDiscount,
        totalAmountAfterDiscount,
        formInfo,
        shopName
    } = props;
    const { field, remove } = props;
    const tdClassName =
        "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";

    const form = Form.useFormInstance();

    return (
        <>
            <td className={tdClassName + " text-center"}>{1 + field.name}</td>
            {productItem && (
                <>
                    <td className={tdClassName}>
                        <TextLineClampDisplay
                            className="!text-[#505050] !font-medium !text-base"
                            content={productItem.productName ?? ""}
                        />
                       <LotProductInput
                            productItem={productItem}
                            field={field}
                        />
                    </td>
                    <td className={tdClassName}>
                        <TextLineClampDisplay
                            className="!text-[#505050] !font-medium !text-base"
                            content={shopName ?? ""}
                        />
                    </td>
                    <QtyAndUnitProduct
                        productItem={productItem}
                        tdClassName={tdClassName}
                        field={field}
                    />
                    <td className={tdClassName + " text-right "}>
                        <Form.Item
                            name={[field.name, "price"]}
                            className="ord-input-bottom-line"
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
                                <SumIcon className={"me-1"} />
                                <PriceCell value={totalAmountBeforeDiscount} />
                            </>
                        )}
                        <Form.Item hidden name={"totalAmountBeforeDiscount"} />
                    </td>
                    <td className={`${tdClassName} text-right`}>
                        <DiscountProductInput field={field} productItem={productItem} />
                    </td>
                    <td className={`${tdClassName} text-right`}>
                        <PriceCell fixed={2} value={totalAmountAfterDiscount} />
                        <div hidden>
                            <Form.Item noStyle name={[field.name, "taxAmount"]} />
                        </div>
                    </td>
                </>
            )}

            <td className="align-top py-3 text-right ">
                <Button type="text" danger onClick={() => {
                    remove(field.name);
                }} icon={<Delete2Icon />} />
            </td>

            <div hidden>
                <Form.Item hidden name={"subTaxAmount"}></Form.Item>
                <Form.Item hidden name="subTotalAmount"></Form.Item>
            </div>
        </>
    );
};
export default observer(
    withProductFormItem(withPriceDiscountTaxFull(ProductBodyTable))
);

