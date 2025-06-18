import type {FormInstance} from "antd/es/form/hooks/useForm";
import {ProductSearchWithUnitDto, StockProductSelectDto} from "@api/index.defs";
import {MoveType, StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import * as _ from "lodash";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {FormListFieldData} from "antd";
import Utils from "@ord-core/utils/utils";
import {CalculatorCurrencyUtil, CalculatorDiscountAllocationInputDto} from "@ord-core/utils/calculatorCurrency.util";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

export interface IFormProductShopOrder {
    shopId: number,
    shopName: string,
    [StockMoveFormName.ProductItems]: any[]
}

class UpsertFormUtil {
    //Sửa hàm addMultiProductIntoForm thì sua ca ham addMultiProductIntoTable
    addMultiProductIntoForm(form: FormInstance, products: StockProductSelectDto[], moveType: any) {
        if (!!products?.length) {
            const values: any[] = form.getFieldValue(StockMoveFormName.ProductItems) || [];
            const productsNotPush: any[] = [];

            products.forEach(product => {
                //Khi chọn sản phẩm, nếu sản phẩm đó đã có trong danh sách và
                // không quản lý lô thì số lượng +1 chứ không insert thêm 1 dòng nữa
                const findItem = values?.find(x => x.productId == product?.productId &&
                    x.productUnitId == product.productUnitId && !product.isProductUseLotNumber)
                if (!!findItem) {
                    const index = values.findIndex((x: any) => x.productId == product?.productId &&
                        x.productUnitId == product.productUnitId && !product.isProductUseLotNumber);

                    form.setFieldsValue({
                        [StockMoveFormName.ProductItems]: {
                            [index]: {
                                ...findItem,
                                qty: (findItem.qty || 0) + 1
                            },
                        },
                    });

                    productsNotPush.push(
                        {
                            productId: product?.productId,
                            productUnitId: product.productUnitId,
                        }
                    );
                } else {
                    product.qty = 1;
                    if (moveType === MoveType.PhieuNhapNhaCungCap ||
                        moveType === MoveType.PhieuNhapTon ||
                        moveType === MoveType.PhieuXuatTraNhaCungCap) {
                        product.price = product.latestImportPrice ?? product.costPrice
                    }

                    //set ton he thong cho phieu kiem kho
                    if (moveType === MoveType.PhieuKiemKho && product.lotNumbers?.length === 1 && !product.isProductUseLotNumber) {
                        product = {
                            ...product,
                            openingInventoryQty: product.lotNumbers[0].qty!
                        } as any
                    }

                    //lay gia = gia von o dieu chuyen
                    if (moveType === MoveType.PhieuDieuChuyen) {
                        product = {
                            ...product,
                            price: product.costPrice!
                        }
                    }

                    //tinh lai gia theo don vi quy doi cua don vi
                    //nhap ncc, nhap ton thi lay theo gia nhap gan nhat nen khong can tinh lai
                    const unit = product.units?.find(x => x.productUnitId == product.productUnitId);
                    if (unit && moveType !== MoveType.PhieuNhapNhaCungCap && moveType !== MoveType.PhieuNhapTon) {
                        product = {
                            ...product,
                            price: (product.price || 0) * (unit.convertRate || 0)
                        }
                    }
                }
            })

            const productsNew = products.filter(x =>
                x.isProductUseLotNumber == true ||
                productsNotPush.every(y => x.productId !== y.productId && x.productUnitId !== y.productUnitId));

            const newValue = [...values, ...productsNew];
            form.setFieldValue(StockMoveFormName.ProductItems, newValue);
        }
    }

    //Sửa hàm addMultiProductIntoTable thì sua ca ham addMultiProductIntoTable
    addMultiProductIntoTable(items: any[], products: StockProductSelectDto[], moveType: any) {
        if (!!products?.length) {
            const productsNotPush: any[] = [];

            products.forEach(product => {
                //Khi chọn sản phẩm, nếu sản phẩm đó đã có trong danh sách và
                // không quản lý lô thì số lượng +1 chứ không insert thêm 1 dòng nữa
                const findItem = items?.find(x => x.productId == product?.productId &&
                    x.productUnitId == product.productUnitId && !product.isProductUseLotNumber)
                if (!!findItem) {
                    const index = items.findIndex((x: any) => x.productId == product?.productId &&
                        x.productUnitId == product.productUnitId && !product.isProductUseLotNumber);

                    const newQty = (findItem.qty || 0) + 1;
                    items[index].qty = newQty;
                    items[index].totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(findItem.price, newQty);
                    items[index].totalAmountAfterDiscount = CalculatorCurrencyUtil.calculateTotalAmountAfterDiscount(findItem.price, newQty, findItem?.discountAmount || 0);
                    items[index].subTaxAmount = CalculatorCurrencyUtil.calculateSubTaxAmount(findItem.price, newQty, findItem?.discountAmount || 0, findItem?.taxPercent || 0);

                    productsNotPush.push({
                        productId: product?.productId,
                        productUnitId: product.productUnitId,
                    });
                } else {
                    product.qty = 1;
                    if (moveType === MoveType.PhieuNhapNhaCungCap ||
                        moveType === MoveType.PhieuNhapTon ||
                        moveType === MoveType.PhieuXuatTraNhaCungCap) {
                        product.price = product.latestImportPrice ?? product.costPrice
                    }

                    //set ton he thong cho phieu kiem kho
                    if (moveType === MoveType.PhieuKiemKho && product.lotNumbers?.length === 1 && !product.isProductUseLotNumber) {
                        product = {
                            ...product,
                            openingInventoryQty: product.lotNumbers[0].qty!
                        } as any
                    }

                    //lay gia = gia von o dieu chuyen
                    if (moveType === MoveType.PhieuDieuChuyen) {
                        product = {
                            ...product,
                            price: product.costPrice!
                        }
                    }

                    //tinh lai gia theo don vi quy doi cua don vi
                    //nhap ncc, nhap ton thi lay theo gia nhap gan nhat nen khong can tinh lai
                    const unit = product.units?.find(x => x.productUnitId == product.productUnitId);
                    if (unit && moveType !== MoveType.PhieuNhapNhaCungCap && moveType !== MoveType.PhieuNhapTon) {
                        product = {
                            ...product,
                            price: (product.price || 0) * (unit.convertRate || 0)
                        }
                    }

                    product.totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(product.price, product.qty);
                    product.totalAmountAfterDiscount = product.totalAmountBeforeDiscount; //vì là thêm mới (discountAmount = 0) nên gán bằng
                    product.subTaxAmount = CalculatorCurrencyUtil.calculateSubTaxAmount(product.price, product.qty, 0, product?.taxPercent || 0);
                }
            })

            const productsNew = products.filter(x =>
                x.isProductUseLotNumber == true ||
                productsNotPush.every(y => x.productId !== y.productId && x.productUnitId !== y.productUnitId));

            const newValue = [...items, ...productsNew];
            items = newValue;
        }

        return items;
    }

    //Sửa hàm addProductIntoForm thì sua ca ham addProductIntoTable
    addProductIntoForm(form: FormInstance, product: StockProductSelectDto, moveType: any) {
        if (!!product?.productId) {
            const values = form.getFieldValue(StockMoveFormName.ProductItems) || [];

            //Khi chọn sản phẩm, nếu sản phẩm đó đã có trong danh sách và
            // không quản lý lô thì số lượng +1 chứ không insert thêm 1 dòng nữa
            const findItem = values?.find((x: any) => x.productId == product?.productId &&
                x.productUnitId == product.productUnitId && !product.isProductUseLotNumber)
            if (!!findItem) {
                const index = values.findIndex((x: any) => x.productId == product?.productId &&
                    x.productUnitId == product.productUnitId && !product.isProductUseLotNumber);

                form.setFieldsValue({
                    [StockMoveFormName.ProductItems]: {
                        [index]: {
                            ...findItem,
                            qty: (findItem.qty || 0) + 1
                        },
                    },
                });
                return;
            }

            product.qty = 1;
            if (moveType === MoveType.PhieuNhapNhaCungCap ||
                moveType === MoveType.PhieuNhapTon ||
                moveType === MoveType.PhieuXuatTraNhaCungCap) {
                product.price = product.latestImportPrice ?? product.costPrice
            }

            //set ton he thong cho phieu kiem kho
            if (moveType === MoveType.PhieuKiemKho && product.lotNumbers?.length === 1 && !product.isProductUseLotNumber) {
                product = {
                    ...product,
                    openingInventoryQty: product.lotNumbers[0].qty!
                } as any
            }

            //lay gia = gia von o dieu chuyen
            if (moveType === MoveType.PhieuDieuChuyen) {
                product = {
                    ...product,
                    price: product.costPrice || 0
                }
            }

            //tinh lai gia theo don vi quy doi cua don vi
            //nhap ncc, nhap ton thi lay theo gia nhap gan nhat nen khong can tinh lai
            const unit = product.units?.find(x => x.productUnitId == product.productUnitId);
            if (unit && moveType !== MoveType.PhieuNhapNhaCungCap && moveType !== MoveType.PhieuNhapTon) {
                product = {
                    ...product,
                    price: (product.price || 0) * (unit.convertRate || 0)
                }
            }

            const newValue = [...values, product];
            form.setFieldValue(StockMoveFormName.ProductItems, newValue);
        }
    }

    //Sửa hàm addProductIntoTable thì sua ca ham addProductIntoForm
    addProductIntoTable(items: any[], product: StockProductSelectDto, moveType: any) {
        if (!!product?.productId) {
            //Khi chọn sản phẩm, nếu sản phẩm đó đã có trong danh sách và
            // không quản lý lô thì số lượng +1 chứ không insert thêm 1 dòng nữa
            const findItem = items?.find((x: any) => x.productId == product?.productId &&
                x.productUnitId == product.productUnitId && !product.isProductUseLotNumber)

            if (!!findItem) {
                const index = items.findIndex((x: any) => x.productId == product?.productId &&
                    x.productUnitId == product.productUnitId && !product.isProductUseLotNumber);

                const newQty = (findItem.qty || 0) + 1;
                items[index].qty = newQty;
                items[index].totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(findItem.price, newQty);
                items[index].totalAmountAfterDiscount = CalculatorCurrencyUtil.calculateTotalAmountAfterDiscount(findItem.price, newQty, findItem?.discountAmount || 0);
                items[index].subTaxAmount = CalculatorCurrencyUtil.calculateSubTaxAmount(findItem.price, newQty, findItem?.discountAmount || 0, findItem?.taxPercent || 0);
                return [...items];
            }

            product.qty = 1;
            if (moveType === MoveType.PhieuNhapNhaCungCap ||
                moveType === MoveType.PhieuNhapTon ||
                moveType === MoveType.PhieuXuatTraNhaCungCap) {
                product.price = product.latestImportPrice ?? product.costPrice
            }

            //set ton he thong cho phieu kiem kho
            if (moveType === MoveType.PhieuKiemKho && product.lotNumbers?.length === 1 && !product.isProductUseLotNumber) {
                product = {
                    ...product,
                    openingInventoryQty: product.lotNumbers[0].qty!
                } as any
            }

            //lay gia = gia von o dieu chuyen
            if (moveType === MoveType.PhieuDieuChuyen) {
                product = {
                    ...product,
                    price: product.costPrice || 0
                }
            }

            //tinh lai gia theo don vi quy doi cua don vi
            //nhap ncc, nhap ton thi lay theo gia nhap gan nhat nen khong can tinh lai
            const unit = product.units?.find(x => x.productUnitId == product.productUnitId);
            if (unit && moveType !== MoveType.PhieuNhapNhaCungCap && moveType !== MoveType.PhieuNhapTon) {
                product = {
                    ...product,
                    price: (product.price || 0) * (unit.convertRate || 0)
                }
            }

            product.totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(product.price, product.qty);
            product.totalAmountAfterDiscount = product.totalAmountBeforeDiscount; //vì là thêm mới(discountAmount = 0) nên gán bằng
            product.subTaxAmount = CalculatorCurrencyUtil.calculateSubTaxAmount(product.price, product.qty, 0, product?.taxPercent || 0);

            const newValue = [...items, product];
            items = newValue;
        }

        return items;
    }

    //Tính lại toàn bộ sản phẩm và phiếu
    calculatorAllProduct(products: any[], move: any) {
        if (!products?.length) { //Nếu không có sản phẩm thì vẫn phải tính lại thông tin phiếu
            move.totalAmountBeforeDiscount = 0;
            move.discountAmount = 0;
            move.totalAmountBeforeTax = 0;
            move.taxAmount = 0;
            move.totalAmount = 0;
            move.totalAmountRound = 0;
            move.paymentAmount = 0;
            move.debtAmount = 0
        } else {
            products.forEach((product: any) => {
                product.totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(product.price, product.qty);

                const discountItem = CalculatorCurrencyUtil.calculateDiscount(product.discountType, product.discountPercent,
                    product.discountAmount, product.totalAmountBeforeDiscount);
                product.discountAmount = discountItem.discountAmount;
                discountItem.discountPercent = discountItem.discountPercent;

                product.totalAmountAfterDiscount = CalculatorCurrencyUtil.calculateTotalAmountAfterDiscount(product.price, product.qty, product.discountAmount);

                product.subTaxAmount = CalculatorCurrencyUtil.calculateSubTaxAmount(product.price, product.qty, product.discountAmount, product.taxPercent);
                product.subTotalAmount = CalculatorCurrencyUtil.calculateSubTotalAmount(product.price, product.qty, product.discountAmount, product.taxPercent);
            })

            move.totalAmountBeforeDiscount = CalculatorCurrencyUtil.summaryTotalAmountBeforeDiscount(products.map(x => x.totalAmountAfterDiscount));
            const discount = CalculatorCurrencyUtil.calculateDiscount(move.discountType, move.discountPercent,
                move.discountAmount, move.totalAmountBeforeDiscount);
            move.discountAmount = discount.discountAmount;
            move.discountPercent = discount.discountPercent;
            move.taxDiscountAmount = CalculatorCurrencyUtil.summaryTaxDiscountAmount(move.discountAmount, move.taxDiscountPercent);

            let totalDiscountAmountAllocation = 0;
            let totalTaxDiscountAmountAllocation = 0;
            const itemTotalCount = products.length;

            products.forEach((product: any, index: number) => {
                if (product.discountAmount > 0 && product.totalAmountBeforeDiscount > 0) {
                    //tinh giam gia phan bo
                    const discountParams: CalculatorDiscountAllocationInputDto = {
                        itemTotalAmountAfterDiscount: product.totalAmountAfterDiscount,
                        totalAmountBeforeDiscountSummary: move.totalAmountBeforeDiscount,
                        totalDiscountAmountSummary: move.discountAmount,
                        totalTaxDiscountAmountSummary: move.taxDiscountAmount,
                        totalDiscountAmountAllocation: totalDiscountAmountAllocation,
                        totalTaxDiscountAmountAllocation: totalTaxDiscountAmountAllocation,
                        isLastItem: index === itemTotalCount - 1
                    };
                    const calculatorDiscountAllocation =
                        CalculatorCurrencyUtil.calculateDiscountAllocation(discountParams);

                    product.discountAmountAllocation = calculatorDiscountAllocation.discountAmountAllocation;
                    product.taxDiscountAmountAllocation = calculatorDiscountAllocation.taxDiscountAmountAllocation;

                    totalDiscountAmountAllocation += product.DiscountAmountAllocation || 0;
                    totalTaxDiscountAmountAllocation += product.TaxDiscountAmountAllocation || 0;
                }

                product.promotionAmountAllocation = 0;
                product.taxPromotionAmountAllocation = 0;

                product.totalAmountBeforeTax = CalculatorCurrencyUtil.calculateTotalAmountBeforeTax(
                    product.totalAmountAfterDiscount, product.discountAmountAllocation, product.promotionAmountAllocation);
                product.taxAmount = CalculatorCurrencyUtil.calculateTaxAmount(
                    product.price, product.qty, product.discountAmount, product.taxPercent,
                    product.taxDiscountAmountAllocation, product.taxPromotionAmountAllocation);
                product.totalAmount = CalculatorCurrencyUtil.calculateTotalAmount(product.totalAmountBeforeTax, product.taxAmount);
            })

            move.totalAmountBeforeTax = CalculatorCurrencyUtil.summaryTotalAmountBeforeTax(products.map(x => x.totalAmountBeforeTax));
            move.taxAmount = CalculatorCurrencyUtil.summaryTaxAmount(products.map(x => x.taxAmount));
            move.totalAmount = CalculatorCurrencyUtil.summaryTotalAmount(products.map(x => x.totalAmount));

            const totalAmountRound = CalculatorCurrencyUtil.summaryTotalAmountRound(move.totalAmount);
            move.totalAmountRound = totalAmountRound;
            move.debtAmount = CalculatorCurrencyUtil.summaryDebtAmount(totalAmountRound, move.paymentAmount);
        }

        return {
            products: products || [],
            move: move || {}
        }
    }

    addMultiProductShopIntoForm(form: FormInstance, products: ProductSearchWithUnitDto[], supplierList: IOrdSelectOption[]) {
        if (products && products.length > 0) {
            const dataGroup = _.groupBy(products, x => x.shopId);
            const result = Object.entries(dataGroup).map(([shopId, items]) => {
                return {
                    shopId: parseInt(shopId),
                    shopName: supplierList.find(x => x.value == shopId)?.label,
                    [StockMoveFormName.ProductItems]: items
                } as IFormProductShopOrder
            });
            form.setFieldValue(StockMoveFormName.ProductItemsFromShop, result);
        }
    }

    inputDiscountAmountChange = (form: FormInstance, field: FormListFieldData) => {
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'discountType'], DiscountTypeEnum.Value);
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'discountPercent'], 0);
    }

    inputPercentAmountChange = (form: FormInstance, field: FormListFieldData) => {
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'discountType'], DiscountTypeEnum.Percent);
        // form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'discountAmount'], 0);
    }

    calculatorDiscountAmount(type: DiscountTypeEnum, value?: number, totalAmountBeforeDiscount?: number) {
        if (type === DiscountTypeEnum.Percent) {
            return Utils.parseFloatWithFixed((value || 0) * (totalAmountBeforeDiscount || 0) / 100, 2) || 0;
        }

        return value || 0;
    }
}

export default new UpsertFormUtil();
