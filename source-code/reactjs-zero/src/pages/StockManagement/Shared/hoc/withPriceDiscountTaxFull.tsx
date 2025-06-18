import {useEffect} from "react";
import {ProductItemFormProps} from "@pages/StockManagement/Shared/Upsert/Props";
import {Form} from "antd";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import Utils from "@ord-core/utils/utils";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const withPriceDiscountTaxFull = (WrappedComponent: any) => {
    return (props: ProductItemFormProps) => {
        const {field, formMoveTicket} = props;
        const form = Form.useFormInstance();
        const price_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'price'], form);
        const qty_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'qty'], form);

        const discountType_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'discountType'], form);
        const discountAmount_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'discountAmount'], form);
        const discountPercent_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'discountPercent'], form);

        const taxDiscountPercent_w = Form.useWatch('taxDiscountPercent', formMoveTicket);

        useEffect(() => {
            const totalAmountBeforeDiscount = (price_w || 0) * (qty_w || 0);
            form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'totalAmountBeforeDiscount'], Utils.parseFloatWithFixed(totalAmountBeforeDiscount || 0, 2));

            let discountAmount: number = 0;

            switch (discountType_w) {
                case DiscountTypeEnum.Value:
                    discountAmount =
                        UpsertFormUtil.calculatorDiscountAmount(discountType_w, discountAmount_w,
                            totalAmountBeforeDiscount);

                    UpsertFormUtil.inputDiscountAmountChange(form, field)

                    break;
                case DiscountTypeEnum.Percent:
                    discountAmount =
                        UpsertFormUtil.calculatorDiscountAmount(discountType_w, discountPercent_w,
                            totalAmountBeforeDiscount);

                    UpsertFormUtil.inputPercentAmountChange(form, field)
                    break;
            }

            const num = Utils.parseFloatWithFixed(totalAmountBeforeDiscount - (discountAmount || 0), 2);
            form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'totalAmountAfterDiscount'], num);
        }, [price_w, qty_w, taxDiscountPercent_w]);

        return <>
            <WrappedComponent {...props} />
        </>;
    };
};

export default withPriceDiscountTaxFull;
