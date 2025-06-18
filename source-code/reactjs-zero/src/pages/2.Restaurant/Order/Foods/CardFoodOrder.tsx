import React, {memo} from 'react';
import {ComboOptionDto, FoodGridDto} from "@api/index.defs";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import UiUtils from "@ord-core/utils/ui.utils";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";
import {orderStateStore} from "@ord-store/Restaurant/Order/OrderStateStore";
import {observer} from "mobx-react-lite";

type CardFoodOrderProps = {
    data: FoodGridDto
}

export interface IProductOrderListItem {
    productId: string | number;
    productName: string | null;
    imageUrl: string | null;
    description: string | null;
    qty: number | null;
    inventoryCurrentQty: number | null;
    convertRate: number | null;
    productPriceWithTax: number | null;
    isProductPriceIncludeTax: boolean;
    productPrice: number | null;
    productUnitId: number | null;
    subTotalAmount: number | null;
    taxPercent: number | null;
    taxCode: string;
    discountType: number | null;
    discountPercent: number | null;
    discountAmount: number | null;
    priceListId: number | null;
    notes: string | null;
    units: ComboOptionDto[] | null;
}

const getFood = (data: FoodGridDto) => {
    if (!data) {
        return;
    }

    return {
        productId: data.productId,
        productName: data.productName,
        imageUrl: data.imageUrl,
        description: data.description,
        qty: 1,
        inventoryCurrentQty: data.inventoryCurrentQty,
        convertRate: 1,
        productPriceWithTax: data.productPriceWithTax,
        productPrice: data.productPrice,
        productUnitId: data.productUnitId,
        subTotalAmount: data.subTotalAmount,
        isProductPriceIncludeTax: data.isProductPriceIncludeTax,
        taxPercent: data.taxPercent,
        taxCode: data.taxCode,
        discountType: data.discountType,
        discountPercent: data.discountPercent,
        discountAmount: data.discountAmount,
        priceListId: data.priceListId,
        units: data.units,
    } as unknown as IProductOrderListItem;
}

const CardFoodOrder = (props: CardFoodOrderProps) => {
    const {data} = props;

    const selectFood = () => {
        const orderSelected = orderStateStore.orderSelected;
        if (!orderSelected) {
            UiUtils.showError("Vui lòng chọn bàn");
            return;
        }

        //Nếu đã có sản phẩm đó rồi thì +1
        const findFoodIndex = orderSelected?.details?.findIndex((x: any) => x.productId === data.productId);
        if (findFoodIndex > -1) {
            const newDetails = [...orderSelected.details];
            const existingFood = {...newDetails[findFoodIndex]};
            existingFood.qty += 1;
            existingFood.subTotalAmount = CalculatorCurrencyUtil.calculateSubTotalAmount(
                existingFood.productPrice, existingFood.qty, existingFood.discountAmount, existingFood.taxPercent);
            newDetails[findFoodIndex] = existingFood;

            orderStateStore.updateOrder({
                ...orderSelected,
                details: newDetails
            });
            return;
        }

        //Thêm mới
        const food = getFood(data);

        const update = {
            ...(orderSelected || {}),
            details: [...(orderSelected?.details || []), food]
        };

        orderStateStore.updateOrder(update);
    }

    // console.log('CardFoodOrder render ', data);

    return <>
        {
            !!data &&
            <div onClick={selectFood}
                 className='p-1 rounded-[6px] border-[1px] border-solid border-[#DDD] cursor-pointer'>
                <div className='w-full rounded-[6px] overflow-hidden'>
                    <img width='100%' alt={data.productName} height='100%' className='object-cover object-center'
                         loading='lazy'
                         src={data.imageUrl ? GetFileUrl(data.imageUrl) : "/images/product-placeholder.png"}
                    />
                </div>
                <div className='pt-3 pb-[6px] px-2'>
                    <p className='mb-[2px] '>
                        <TextLineClampDisplay placement='right' className=' !text-[#1C1C1C] !text-base !font-medium'
                                              content={data?.productName || ''} rows={1}/>
                    </p>
                    <p className='mb-2  h-[23px] !text-[#494949] line-clamp-1 text-ellipsis'>
                        {data?.description}

                        {/*<TextLineClampDisplay placement='right' className=' !text-[#494949]'*/}
                        {/*                      content={data?.description || ''} rows={1}/>*/}
                    </p>
                    <p className='text-[#1C1C1C]'>
                        <span className='font-medium text-base mr-1'> <PriceCell
                            value={+(data?.productPriceWithTax || 0)}/> </span>
                        <span className='text-sm'> {data.currencyUnit}</span>
                    </p>
                </div>
            </div>
        }
    </>;
};

export default memo(observer(CardFoodOrder));