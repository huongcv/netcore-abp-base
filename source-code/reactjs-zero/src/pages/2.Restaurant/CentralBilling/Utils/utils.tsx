import type {FormInstance} from "antd/es/form/hooks/useForm";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {FormListFieldData} from "antd";
import Utils from "@ord-core/utils/utils";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

export interface IFormProductShopOrder {
    shopId: number,
    shopName: string,
    [StockMoveFormName.ProductItems]: any[]
}

export class UpsertFormUtil {

    static calculatorDiscountAmount(type: DiscountTypeEnum, amount?: number, percent?: number, totalAmountBeforeDiscount?: number) {
        if (type === DiscountTypeEnum.Percent) {
            return Utils.parseFloatWithFixed((percent || 0) * (totalAmountBeforeDiscount || 0) / 100, 2) || 0;
        }
        return amount || 0;
    }

    static inputPercentAmountChange = (form: FormInstance, field: FormListFieldData) => {
        form.setFieldValue(['saleInvoiceDetails', field.name, 'discountType'], DiscountTypeEnum.Percent);
    }

    static inputDiscountAmountChange = (form: FormInstance, field: FormListFieldData) => {
        form.setFieldValue(['saleInvoiceDetails', field.name, 'discountType'], DiscountTypeEnum.Value);
        form.setFieldValue(['saleInvoiceDetails', field.name, 'discountPercent'], 0);
    }
}


