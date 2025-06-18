import NumberUtil from "@ord-core/utils/number.util";
import Utils from "@ord-core/utils/utils";
import {MoveType, StockMoveFormName,} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {IRightBoxProp} from "@pages/StockManagement/Shared/Upsert/Props";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import {Form} from "antd";
import {useEffect, useRef} from "react";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

export interface IStockInventoryPriceAmountDto {
    price?: number;
    qty?: number;
    totalAmountBeforeDiscount?: number;
    discountAmount?: number;
    totalAmountAfterDiscount?: number;
    discountAmountAllocation?: number;
    totalAmountBeforeTax?: number;
    taxAmount?: number;
    subTaxAmount?: number;
    taxDiscountAmountAllocation?: number;
    discountPercent?: number;
    discountType?: DiscountTypeEnum;
    taxPercent?: number;
}

declare var ord: any;

const withPriceMoveBoxRightFull = (WrappedComponent: any) => {
    return (props: IRightBoxProp) => {
        const {formProductItems} = props;
        const formMoveTicket = Form.useFormInstance();

        const isImportFromExcel_w = Form.useWatch("isImportFromExcel", formMoveTicket);
        const items_w = Form.useWatch(
            StockMoveFormName.ProductItems,
            formProductItems
        );
        const totalAmountBeforeDiscount_w = Form.useWatch(
            "totalAmountBeforeDiscount",
            formMoveTicket
        );
        const discountAmountMove_w = Form.useWatch(
            "discountAmount",
            formMoveTicket
        );
        const totalAmountBeforeTax_w = Form.useWatch(
            "totalAmountBeforeTax",
            formMoveTicket
        );
        const taxAmount_w = Form.useWatch("taxAmount", formMoveTicket);
        const taxDiscountPercent_w = Form.useWatch(
            "taxDiscountPercent",
            formMoveTicket
        );
        const totalAmount_w = Form.useWatch("totalAmount", formMoveTicket);
        const totalAmountRound_w = Form.useWatch(
            "totalAmountRound",
            formMoveTicket
        );
        const paymentAmount_w = Form.useWatch("paymentAmount", formMoveTicket);
        const discountValue_w = Form.useWatch("discountValue", formMoveTicket);
        const discountType_w = Form.useWatch("discountType", formMoveTicket);
        const moveType_w = Form.useWatch("moveType", formMoveTicket);
        const dirtyRef = useRef<boolean>(false);

        ord.event.on("event@dirty.stock", (value: boolean) => {
            dirtyRef.current = value;
        });

        //Tính giảm giá phân bổ cho sản phẩm
        useEffect(() => {
            //Tam thoi
            //Neu import bang excel thi khong xu ly o day
            if (isImportFromExcel_w == true) {
                return;
            }

            const discountAmountMove = UpsertFormUtil.calculatorDiscountAmount(
                discountType_w,
                discountValue_w,
                totalAmountBeforeDiscount_w
            );
            const productItems: IStockInventoryPriceAmountDto[] =
                formProductItems!.getFieldValue(StockMoveFormName.ProductItems) || [];
            if (productItems && productItems.length > 0) {
                let idx = 0;
                let totalAfterDiscountItems = 0;
                productItems.forEach((it) => {
                    totalAfterDiscountItems += it.totalAmountAfterDiscount || 0;
                });
                let amountAllocation = 0;
                productItems.forEach((it) => {
                    if (idx + 1 === productItems.length) {
                        const amountAllocationFinal =
                            discountAmountMove - amountAllocation || 0;
                        formProductItems!.setFieldValue(
                            [
                                StockMoveFormName.ProductItems,
                                "" + idx,
                                "discountAmountAllocation",
                            ],
                            amountAllocationFinal
                        );

                        const totalAmountBeforeTax =
                            (it.totalAmountAfterDiscount || 0) - amountAllocationFinal;
                        formProductItems!.setFieldValue(
                            [
                                StockMoveFormName.ProductItems,
                                "" + idx,
                                "totalAmountBeforeTax",
                            ],
                            totalAmountBeforeTax
                        );
                        return;
                    }
                    if (discountAmountMove == 0 || totalAfterDiscountItems == 0) {
                        formProductItems!.setFieldValue(
                            [
                                StockMoveFormName.ProductItems,
                                "" + idx,
                                "discountAmountAllocation",
                            ],
                            0
                        );
                    } else {
                        const percentAllocation =
                            (it.totalAmountAfterDiscount || 0) / totalAfterDiscountItems;
                        const discountAmountAllocation =
                            Utils.parseFloatWithFixed(
                                percentAllocation * discountAmountMove,
                                2
                            ) || 0;
                        formProductItems!.setFieldValue(
                            [
                                StockMoveFormName.ProductItems,
                                "" + idx,
                                "discountAmountAllocation",
                            ],
                            discountAmountAllocation
                        );

                        const totalAmountBeforeTax =
                            (it.totalAmountAfterDiscount || 0) - discountAmountAllocation;
                        formProductItems!.setFieldValue(
                            [
                                StockMoveFormName.ProductItems,
                                "" + idx,
                                "totalAmountBeforeTax",
                            ],
                            totalAmountBeforeTax
                        );

                        amountAllocation =
                            amountAllocation + (discountAmountAllocation || 0);
                    }

                    idx++;
                });
            }
        }, [discountAmountMove_w, totalAmountBeforeDiscount_w, discountValue_w]);

        useEffect(() => {
            //Tam thoi
            //Neu import bang excel thi khong xu ly o day
            if (isImportFromExcel_w == true) {
                return;
            }

            //tong chiet khau cua phieu
            const discountAmountMove = UpsertFormUtil.calculatorDiscountAmount(
                discountType_w,
                discountValue_w,
                totalAmountBeforeDiscount_w
            );
            //thue chiet khau cua phieu
            const taxDiscountAmount =
                Utils.parseFloatWithFixed(
                    ((discountAmountMove || 0) * (taxDiscountPercent_w || 0)) / 100,
                    2
                ) || 0;

            const items: IStockInventoryPriceAmountDto[] =
                formProductItems!.getFieldValue(StockMoveFormName.ProductItems) || [];
            let totalAmountBeforeDiscount = 0;
            let taxAmount = 0;
            let amountAllocation = 0;

            items.forEach((it, index) => {
                //tinh lai giam gia khi so luong, tien thay doi
                if (it.discountType === DiscountTypeEnum.Percent) {
                    it.discountAmount = UpsertFormUtil.calculatorDiscountAmount(
                        it.discountType,
                        it.discountPercent,
                        it.totalAmountBeforeDiscount
                    );
                    formProductItems!.setFieldValue(
                        [StockMoveFormName.ProductItems, index + "", "discountAmount"],
                        it.discountAmount
                    );
                }
                //neu giam gia > tien truoc chiet khau => gia gia = tien truoc chiet khau
                else if (
                    (it.discountAmount || 0) > (it.totalAmountBeforeDiscount || 0)
                ) {
                    it.discountAmount = it.totalAmountBeforeDiscount;
                    formProductItems!.setFieldValue(
                        [StockMoveFormName.ProductItems, index + "", "discountAmount"],
                        it.discountAmount
                    );
                }

                //Tính thuế chiết khấu phân bổ
                if (items.length === index + 1) {
                    it.taxDiscountAmountAllocation =
                        taxDiscountAmount - amountAllocation || 0;
                    formProductItems!.setFieldValue(
                        [
                            StockMoveFormName.ProductItems,
                            index + "",
                            "taxDiscountAmountAllocation",
                        ],
                        it.taxDiscountAmountAllocation
                    );
                } else {
                    it.taxDiscountAmountAllocation =
                        Utils.parseFloatWithFixed(
                            ((it.totalAmountAfterDiscount || 0) /
                                totalAmountBeforeDiscount_w) *
                            (taxDiscountAmount || 0),
                            2
                        ) || 0;
                    formProductItems!.setFieldValue(
                        [
                            StockMoveFormName.ProductItems,
                            index + "",
                            "taxDiscountAmountAllocation",
                        ],
                        it.taxDiscountAmountAllocation
                    );
                    amountAllocation += it.taxDiscountAmountAllocation;
                }

                const totalAmountBeforeDiscountRaw = (it.price || 0) * (it.qty || 0);
                const totalAmountAfterDiscountRaw =
                    totalAmountBeforeDiscountRaw - (it.discountAmount || 0);
                formProductItems!.setFieldValue(
                    [
                        StockMoveFormName.ProductItems,
                        index + "",
                        "totalAmountAfterDiscount",
                    ],
                    Utils.parseFloatWithFixed(totalAmountAfterDiscountRaw, 2)
                );

                it.subTaxAmount =
                    Utils.parseFloatWithFixed(
                        (totalAmountAfterDiscountRaw * (it.taxPercent || 0)) / 100,
                        2
                    ) || 0;
                formProductItems!.setFieldValue(
                    [StockMoveFormName.ProductItems, index + "", "subTaxAmount"],
                    it.subTaxAmount
                );
                formProductItems!.setFieldValue(
                    [StockMoveFormName.ProductItems, index + "", "subTotalAmount"],
                    Utils.setPriceWithFixed(
                        (it.subTaxAmount || 0) + (it.totalAmountAfterDiscount || 0)
                    )
                );

                const taxAmountItem =
                    Utils.parseFloatWithFixed(
                        (it.subTaxAmount || 0) - (it.taxDiscountAmountAllocation || 0),
                        2
                    ) || 0;
                formProductItems!.setFieldValue(
                    [StockMoveFormName.ProductItems, index + "", "taxAmount"],
                    taxAmountItem
                );

                const totalAmount = (it.totalAmountBeforeTax || 0) + taxAmountItem;
                formProductItems!.setFieldValue(
                    [StockMoveFormName.ProductItems, index + "", "totalAmount"],
                    Utils.parseFloatWithFixed(totalAmount > 0 ? totalAmount : 0, 2)
                );

                if (it.totalAmountAfterDiscount && it.totalAmountAfterDiscount > 0) {
                    totalAmountBeforeDiscount += it.totalAmountAfterDiscount;
                }

                taxAmount += (it.taxAmount || 0);
            });

            if (taxAmount < 0) {
                taxAmount = 0;
            }

            if (
                totalAmountBeforeDiscount !=
                formMoveTicket.getFieldValue("totalAmountBeforeDiscount")
            ) {
                formMoveTicket.setFieldValue(
                    "totalAmountBeforeDiscount",
                    Utils.parseFloatWithFixed(totalAmountBeforeDiscount, 2)
                );
            }

            if (taxAmount != formMoveTicket.getFieldValue("taxAmount")) {
                formMoveTicket.setFieldValue(
                    "taxAmount",
                    Utils.parseFloatWithFixed(taxAmount, 2)
                );
            }
        }, [items_w, taxDiscountPercent_w, discountValue_w]);

        useEffect(() => {
            //Tam thoi
            //Neu import bang excel thi khong xu ly o day
            if (isImportFromExcel_w == true) {
                return;
            }

            const items =
                formProductItems!.getFieldValue(StockMoveFormName.ProductItems) || [];
            const totalAmount =
                items?.reduce(
                    (total: number, x: any) => total + x.totalAmount || 0,
                    0
                ) || 0;
            formMoveTicket.setFieldValue(
                "totalAmount",
                Utils.parseFloatWithFixed(totalAmount, 2)
            );

            const totalAmountRound = NumberUtil.ceil(totalAmount);
            formMoveTicket.setFieldValue("totalAmountRound", totalAmountRound);

            //tong tien thay doi thi so tien thanh toan thay doi theo
            if (
                dirtyRef.current &&
                (moveType_w == MoveType.PhieuNhapNhaCungCap ||
                    moveType_w == MoveType.PhieuXuatTraNhaCungCap)
            ) {
                formMoveTicket.setFieldValue("paymentAmount", totalAmountRound);
                formMoveTicket.setFieldValue("debtAmount", 0);
            }
        }, [
            totalAmountBeforeTax_w,
            taxAmount_w,
            taxDiscountPercent_w,
            discountValue_w,
        ]);

        useEffect(() => {
            //Tam thoi
            //Neu import bang excel thi khong xu ly o day
            if (isImportFromExcel_w == true) {
                return;
            }

            if (dirtyRef.current) {
                const paymentAmount = paymentAmount_w ?? 0;
                const totalAmountRound = totalAmountRound_w ?? 0;
                let debtAmount = totalAmountRound - paymentAmount;
                debtAmount = debtAmount < 0 ? 0 : debtAmount;
                formMoveTicket.setFieldValue("debtAmount", debtAmount ?? 0);
            }
        }, [totalAmount_w, paymentAmount_w]);

        return <WrappedComponent {...props} />;
    };
};

export default withPriceMoveBoxRightFull;
