using Ord.Plugin.Contract.Enums;

namespace Ord.Plugin.Core.Utils
{
    /// <summary>
    /// Tính toán liên quan đến tiền
    /// </summary>
    /// 

    public static class CalculatorCurrencyUtil
    {
        private static int decimalRound = 0;

        #region Tính tiền chi tiết sản phẩm

        public static decimal CalculatePriceWithTax(decimal? price, decimal? taxPercent, bool isPriceIncludeTax)
        {
            return isPriceIncludeTax == true
                        ? Math.Round(((price ?? 0) * (taxPercent ?? 0) / 100) + (price ?? 0), decimalRound)
                        : Math.Round((price ?? 0), decimalRound);
        }

        private static decimal CalculateTotalAmountBeforeDiscountRaw(decimal? price, decimal? qty)
        {
            return (qty ?? 0) * (price ?? 0);
        }

        public static decimal CalculateTotalAmountBeforeDiscount(decimal? price, decimal? qty)
        {
            var value = CalculateTotalAmountBeforeDiscountRaw(price, qty);

            return Math.Round(value, decimalRound, MidpointRounding.AwayFromZero);
        }

        public static CalculatorCurrencyDiscountDto CalculateDiscount(DiscountTypeEnum? discountType, decimal? discountPer, decimal? discountAmt, decimal? totalAmountBeforeDiscount)
        {
            var result = new CalculatorCurrencyDiscountDto();
            if (!discountType.HasValue)
            {
                return result;
            }

            result.DiscountType = discountType.Value;

            if (!totalAmountBeforeDiscount.HasValue)
            {
                return result;
            }

            if (discountType == DiscountTypeEnum.Percent)
            {
                if (!discountPer.HasValue || discountPer <= 0 || !totalAmountBeforeDiscount.HasValue || totalAmountBeforeDiscount <= 0)
                {
                    result.DiscountAmount = 0;
                }
                else
                {
                    result.DiscountAmount = Math.Round((totalAmountBeforeDiscount ?? 0) * (discountPer ?? 0) / 100, decimalRound, MidpointRounding.AwayFromZero);
                }
                result.DiscountPercent = discountPer;
            }
            else
            {
                result.DiscountAmount = discountAmt;
                result.DiscountPercent = null;
            }

            return result;
        }

        public static decimal CalculateTotalAmountAfterDiscount(decimal? price, decimal? qty, decimal? discountAmount)
        {
            return Math.Round(CalculateTotalAmountBeforeDiscountRaw(price, qty) - (discountAmount ?? 0), decimalRound, MidpointRounding.AwayFromZero);
        }

        public static decimal CalculateSubTaxAmount(decimal? price, decimal? qty, decimal? discountAmount, decimal? taxPercent)
        {
            return Math.Round((CalculateTotalAmountBeforeDiscountRaw(price, qty) - (discountAmount ?? 0)) * (taxPercent ?? 0) / 100, decimalRound, MidpointRounding.AwayFromZero);
        }

        public static decimal CalculateSubTotalAmount(decimal? price, decimal? qty, decimal? discountAmount, decimal? taxPercent)
        {
            var totalAmountAfterDiscount = CalculateTotalAmountAfterDiscount(price, qty, discountAmount);
            var subTaxAmount = CalculateSubTaxAmount(price, qty, discountAmount, taxPercent);

            return Math.Round(totalAmountAfterDiscount + subTaxAmount, 0);
        }

        public static CalculatorDiscountAllocationDto CalculateDiscountAllocation(CalculatorDiscountAllocationInputDto inputDto)
        {
            var resDto = new CalculatorDiscountAllocationDto();

            if (inputDto.IsLastItem) //item cuối thì k cần tính mà lấy số tiền còn lại
            {
                resDto.DiscountAmountAllocation = inputDto.TotalDiscountAmountSummary - inputDto.TotalDiscountAmountAllocation;
                resDto.TaxDiscountAmountAllocation = inputDto.TotalTaxDiscountAmountSummary - inputDto.TotalTaxDiscountAmountAllocation;
            }
            else
            {
                //nếu số tiền sau khi giảm giá = 0 hoặc tổng tiền trong phiếu = 0
                if (inputDto.ItemTotalAmountAfterDiscount == 0)
                {
                    resDto.DiscountAmountAllocation = 0;
                    resDto.TaxDiscountAmountAllocation = 0;
                }
                else
                {
                    //tỷ lệ phần trăm để tính phân bổ
                    var percentAllocation = inputDto.ItemTotalAmountAfterDiscount / inputDto.TotalAmountBeforeDiscountSummary;
                    //chiết khấu phần bổ của sản phẩm = phần trăm phân bổ * tổng tiền giảm giá của phiếu
                    resDto.DiscountAmountAllocation = Math.Round((percentAllocation * inputDto.TotalDiscountAmountSummary) ?? 0, decimalRound, MidpointRounding.AwayFromZero);
                    //thuế chiết khấu phân bổ của sản phẩm = phần trăm phân bổ * tổng tiền thuế chiết khấu của phiếu
                    resDto.TaxDiscountAmountAllocation = Math.Round((percentAllocation * inputDto.TotalTaxDiscountAmountSummary) ?? 0, decimalRound, MidpointRounding.AwayFromZero);
                }
            }
            return resDto;
        }

        public static decimal CalculateTotalAmountBeforeTax(decimal? totalAmountAfterDiscount, decimal? discountAmountAllocation, decimal? promotionAmountAllocation)
        {
            return Math.Round((totalAmountAfterDiscount ?? 0) - (discountAmountAllocation ?? 0) - (promotionAmountAllocation ?? 0), decimalRound, MidpointRounding.AwayFromZero);
        }

        public static decimal CalculateTaxAmount(decimal? price, decimal? qty,
            decimal? discountAmount, decimal? taxPercent, decimal? taxDiscountAmountAllocation, decimal? promotionAmountAllocation)
        {
            return Math.Round(CalculateSubTaxAmount(price, qty, discountAmount, taxPercent) - (taxDiscountAmountAllocation ?? 0) - (promotionAmountAllocation ?? 0), decimalRound, MidpointRounding.AwayFromZero);
        }

        public static decimal CalculateTotalAmount(decimal? totalAmountBeforeTax, decimal? taxAmount)
        {
            return Math.Round((totalAmountBeforeTax ?? 0) + (taxAmount ?? 0), decimalRound, MidpointRounding.AwayFromZero);
        }

        #endregion


        #region Tính tiền của phiếu, hoá đơn, ...
        public static decimal SummaryTotalAmountBeforeDiscount(IEnumerable<decimal?>? listTotalAmountAfterDiscountItem)
        {
            if (listTotalAmountAfterDiscountItem?.Any() != true)
            {
                return 0;
            }

            return Math.Round(listTotalAmountAfterDiscountItem.Sum(x => x ?? 0), decimalRound, MidpointRounding.AwayFromZero);
        }

        public static decimal SummaryTotalAmountBeforeTax(IEnumerable<decimal?>? listTotalAmountBeforeTaxItem)
        {
            if (listTotalAmountBeforeTaxItem?.Any() != true)
            {
                return 0;
            }

            return Math.Round(listTotalAmountBeforeTaxItem.Sum(x => x ?? 0), decimalRound, MidpointRounding.AwayFromZero);
        }

        public static decimal SummaryTaxAmount(IEnumerable<decimal?>? taxAmountItem)
        {
            if (taxAmountItem?.Any() != true)
            {
                return 0;
            }

            return Math.Round(taxAmountItem.Sum(x => x ?? 0), decimalRound, MidpointRounding.AwayFromZero);
        }

        public static decimal SummaryTaxDiscountAmount(decimal? discountAmountSummary, decimal? taxDiscountPercent)
        {
            return Math.Round((discountAmountSummary ?? 0) * (taxDiscountPercent ?? 0) / 100, decimalRound, MidpointRounding.AwayFromZero);
        }

        public static decimal SummaryTotalAmount(IEnumerable<decimal?>? listTotalAmountItem)
        {
            if (listTotalAmountItem?.Any() != true)
            {
                return 0;
            }

            return Math.Round(listTotalAmountItem.Sum(x => x ?? 0), decimalRound, MidpointRounding.AwayFromZero);
        }

        public static decimal SummaryTotalAmountRound(decimal? totalAmountSummary)
        {
            return totalAmountSummary ?? 0;
            //return NumberUtil.Ceiling(totalAmountSummary ?? 0);
        }

        public static decimal SummaryDebtAmount(decimal? totalAmountRoundSummary, decimal? paymentAmount)
        {
            return (totalAmountRoundSummary ?? 0) - (paymentAmount ?? 0);
        }

        #endregion

        #region Tính giá trước thuế, sau thuế
        //Tính giá sau thuế dựa vào giá trước thuế
        public static decimal CalculatePriceWithTax(decimal? price, decimal? taxPercent, bool? isPriceIncludeTax)
        {
            var priceConvert = price ?? 0;
            var taxPercentConvert = taxPercent ?? 0;

            return isPriceIncludeTax == true ?
                    Math.Round(priceConvert * (1 + taxPercentConvert / 100), decimalRound, MidpointRounding.AwayFromZero) :
                    Math.Round(priceConvert, decimalRound, MidpointRounding.AwayFromZero);
        }

        //Tính giá trước thuế dựa vào giá sau thuế
        public static decimal CalculatePriceFromPriceWithTax(decimal? priceWithTax, decimal? taxPercent, bool? isPriceIncludeTax)
        {
            var priceWithTaxConvert = priceWithTax ?? 0;
            var taxPercentConvert = taxPercent ?? 0;

            return isPriceIncludeTax == true ?
                Math.Round(priceWithTaxConvert / (1 + taxPercentConvert / 100), decimalRound, MidpointRounding.AwayFromZero) :
                Math.Round(priceWithTaxConvert, decimalRound, MidpointRounding.AwayFromZero);
        }
        #endregion
    }

    public class CalculatorCurrencyDiscountDto
    {
        public DiscountTypeEnum DiscountType { get; set; } = DiscountTypeEnum.Percent;
        public decimal? DiscountPercent { get; set; } = 0;
        public decimal? DiscountAmount { get; set; } = 0;
    }

    public class CalculatorDiscountAllocationDto
    {
        public decimal? DiscountAmountAllocation { get; set; } = 0;
        public decimal? TaxDiscountAmountAllocation { get; set; } = 0;
    }

    public class CalculatorDiscountAllocationInputDto
    {
        public decimal? ItemTotalAmountAfterDiscount { get; set; } // Tổng tiền Sau giảm giá của item
        public decimal? TotalAmountBeforeDiscountSummary { get; set; } // Tổng tiền trước chiết khấu của phiếu
        public decimal? TotalDiscountAmountSummary { get; set; } // Tổng chiết khấu của phiếu
        public decimal? TotalTaxDiscountAmountSummary { get; set; } //Tổng Thuế chiết khấu của phiếu
        public decimal TotalDiscountAmountAllocation { get; set; } // Tổng chiết khấu đã phân bổ
        public decimal TotalTaxDiscountAmountAllocation { get; set; } // Tổng thuế chiết khấu đã phân bổ
        public bool IsLastItem { get; set; }
    }
}
