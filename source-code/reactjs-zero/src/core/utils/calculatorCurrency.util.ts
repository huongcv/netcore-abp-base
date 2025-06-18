import _ from 'lodash';
import {DiscountTypeEnum, isValidDiscountType, parseDiscountType} from "@ord-core/enum/discountTypeEnum.enum";

export interface CalculatorCurrencyDiscountDto {
    discountType: DiscountTypeEnum;
    discountPercent?: number;
    discountAmount?: number;
}

export interface CalculatorDiscountAllocationDto {
    discountAmountAllocation?: number;
    taxDiscountAmountAllocation?: number;
}

export interface CalculatorDiscountAllocationInputDto {
    itemTotalAmountAfterDiscount?: number;
    totalAmountBeforeDiscountSummary?: number;
    totalDiscountAmountSummary?: number;
    totalTaxDiscountAmountSummary?: number;
    totalDiscountAmountAllocation: number;
    totalTaxDiscountAmountAllocation: number;
    isLastItem: boolean;
}

export class CalculatorCurrencyUtil {
    static decimalRound = 0;

    //#region Tính tiền chi tiết sản phẩm
    private static toNumber(value: any): number {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    }

    private static calculateTotalAmountBeforeDiscountRaw(price: any, qty: any): number {
        return this.toNumber(qty) * this.toNumber(price);
    }

    static calculateTotalAmountBeforeDiscount(price: any, qty: any): number {
        return _.round(this.calculateTotalAmountBeforeDiscountRaw(price, qty), this.decimalRound);
    }

    static calculateDiscount(
        discountType: DiscountTypeEnum | unknown,
        discountPer: any,
        discountAmt: any,
        totalAmountBeforeDiscount: any
    ): CalculatorCurrencyDiscountDto {
        const result: CalculatorCurrencyDiscountDto = {
            discountType: DiscountTypeEnum.Percent,
            discountAmount: 0,
            discountPercent: 0
        };

        const parsedDiscountType = parseDiscountType(discountType);

        if (parsedDiscountType === undefined || !isValidDiscountType(discountType) || totalAmountBeforeDiscount === undefined) {
            return result;
        }

        result.discountType = discountType;
        const per = this.toNumber(discountPer);
        const amt = this.toNumber(discountAmt);
        const total = this.toNumber(totalAmountBeforeDiscount);

        if (discountType === DiscountTypeEnum.Percent) {
            result.discountAmount = (per <= 0 || total <= 0) ? 0 : _.round(total * per / 100, this.decimalRound);
            result.discountPercent = per;
        } else {
            result.discountAmount = amt;
            result.discountPercent = undefined;
        }

        return result;
    }

    static calculateTotalAmountAfterDiscount(price: any, qty: any, discountAmount: any): number {
        return _.round(
            this.calculateTotalAmountBeforeDiscountRaw(price, qty) - this.toNumber(discountAmount),
            this.decimalRound
        );
    }

    static calculateSubTaxAmount(price: any, qty: any, discountAmount: any, taxPercent: any): number {
        const tax = this.toNumber(taxPercent);
        const amountAfterDiscount = this.calculateTotalAmountBeforeDiscountRaw(price, qty) - this.toNumber(discountAmount);
        const subTaxAmount =  _.round(amountAfterDiscount * tax / 100, this.decimalRound);
        return subTaxAmount;
    }

    static calculateSubTotalAmount(price: any, qty: any, discountAmount: any, taxPercent: any): number {
        const totalAfterDiscount = this.calculateTotalAmountAfterDiscount(price, qty, discountAmount);
        const subTaxAmount = this.calculateSubTaxAmount(price, qty, discountAmount, taxPercent);
        const subTotalAmount = _.round(totalAfterDiscount + subTaxAmount, 0);
        return subTotalAmount;
    }

    static calculateDiscountAllocation(inputDto: CalculatorDiscountAllocationInputDto): CalculatorDiscountAllocationDto {
        const resDto: CalculatorDiscountAllocationDto = {};

        if (inputDto.isLastItem) {
            resDto.discountAmountAllocation = this.toNumber(inputDto.totalDiscountAmountSummary) - this.toNumber(inputDto.totalDiscountAmountAllocation);
            resDto.taxDiscountAmountAllocation = this.toNumber(inputDto.totalTaxDiscountAmountSummary) - this.toNumber(inputDto.totalTaxDiscountAmountAllocation);
        } else {
            const itemTotalAfterDiscount = this.toNumber(inputDto.itemTotalAmountAfterDiscount);
            const totalBeforeDiscountSummary = this.toNumber(inputDto.totalAmountBeforeDiscountSummary);

            if (itemTotalAfterDiscount === 0) {
                resDto.discountAmountAllocation = 0;
                resDto.taxDiscountAmountAllocation = 0;
            } else {
                const percentAllocation = itemTotalAfterDiscount / (totalBeforeDiscountSummary || 1);
                resDto.discountAmountAllocation = _.round(percentAllocation * this.toNumber(inputDto.totalDiscountAmountSummary), this.decimalRound);
                resDto.taxDiscountAmountAllocation = _.round(percentAllocation * this.toNumber(inputDto.totalTaxDiscountAmountSummary), this.decimalRound);
            }
        }

        return resDto;
    }

    static calculateTotalAmountBeforeTax(totalAmountAfterDiscount: any, discountAmountAllocation: any, promotionAmountAllocation: any): number {
        return _.round(
            this.toNumber(totalAmountAfterDiscount)
            - this.toNumber(discountAmountAllocation)
            - this.toNumber(promotionAmountAllocation),
            this.decimalRound
        );
    }

    static calculateTaxAmount(
        price: any, qty: any, discountAmount: any, taxPercent: any,
        taxDiscountAmountAllocation: any, promotionAmountAllocation: any
    ): number {
        return _.round(
            this.calculateSubTaxAmount(price, qty, discountAmount, taxPercent)
            - this.toNumber(taxDiscountAmountAllocation)
            - this.toNumber(promotionAmountAllocation),
            this.decimalRound
        );
    }

    static calculateTotalAmount(totalAmountBeforeTax: any, taxAmount: any): number {
        return _.round(this.toNumber(totalAmountBeforeTax) + this.toNumber(taxAmount), this.decimalRound);
    }

    //#endregion

    //#region Tính tiền của phiếu, hoá đơn, ... -> tính tổng hợp từ chi tiết sản phẩm
    static summaryTotalAmountBeforeDiscount(list?: (any)[]): number {
        if (!list || list.length === 0) return 0;
        return _.round(_.sum(list.map(x => this.toNumber(x))), this.decimalRound);
    }

    static summaryTotalAmountBeforeTax(list?: (any)[]): number {
        if (!list || list.length === 0) return 0;
        return _.round(_.sum(list.map(x => this.toNumber(x))), this.decimalRound);
    }

    static summaryTaxAmount(list?: (any)[]): number {
        if (!list || list.length === 0) return 0;
        return _.round(_.sum(list.map(x => this.toNumber(x))), this.decimalRound);
    }

    static summaryTaxDiscountAmount(discountAmountSummary: any, taxDiscountPercent: any): number {
        return _.round(this.toNumber(discountAmountSummary) * this.toNumber(taxDiscountPercent) / 100, this.decimalRound);
    }

    static summaryTotalAmount(list?: (any)[]): number {
        if (!list || list.length === 0) return 0;
        return _.round(_.sum(list.map(x => this.toNumber(x))), this.decimalRound);
    }

    static summaryTotalAmountRound(totalAmountSummary: any): number {
        return this.toNumber(totalAmountSummary);
    }

    static summaryDebtAmount(totalAmountRoundSummary: any, paymentAmount: any): number {
        return this.toNumber(totalAmountRoundSummary) - this.toNumber(paymentAmount);
    }

    //#endregion

    //#region Tính tiền của phiếu, hoá đơn, ... -> Tính dựa trên chi tiết phiếu
    static summaryTotalAmountBeforeTax2(totalAmountBeforeDiscountSummary: any, discountAmountSummary: any) : number {
       return _.round(this.toNumber(totalAmountBeforeDiscountSummary) - this.toNumber(discountAmountSummary), this.decimalRound);
    }

    static summaryTotalAmount2(totalAmountBeforeTaxSummary: any, taxAmountSummary: any) : number {
        return _.round(this.toNumber(totalAmountBeforeTaxSummary) + this.toNumber(taxAmountSummary), this.decimalRound);
    }
    //#endregion

    //#region Tính giá trước thuế, sau thuế
    //Tính giá sau thuế dựa vào giá trước thuế
    static calculatePriceWithTax(price: any, taxPercent: any, isPriceIncludeTax?: boolean): number {
        const p = this.toNumber(price);
        const tax = this.toNumber(taxPercent);
        return isPriceIncludeTax
            ? _.round(p * (1 + tax / 100), this.decimalRound)
            : _.round(p, this.decimalRound);
    }

    //Tính giá trước thuế dựa vào giá sau thuế
    static calculatePriceFromPriceWithTax(priceWithTax: any, taxPercent: any, isPriceIncludeTax?: boolean): number {
        const p = this.toNumber(priceWithTax);
        const tax = this.toNumber(taxPercent);
        return isPriceIncludeTax ?
            _.round(p / (1 + tax / 100), this.decimalRound) :
            _.round(p, this.decimalRound);
    }

    //#endregion
}
