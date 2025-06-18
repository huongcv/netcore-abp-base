import React, {memo, useEffect} from 'react';
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {Button, Checkbox, Form} from "antd";
import {useTranslation} from "react-i18next";
import {useSelectChannelType} from "@ord-components/forms/select/selectDataSource/useSelectChannelType";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";
import {PaymentMethodEnum, PaymentMethodForm} from "@pages/SalesInvoice/Form/paymentMethodForm";
import dayjs from "dayjs";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import TextArea from "antd/lib/input/TextArea";
import {DiscountForm} from "@pages/SalesInvoice/Sell/discountForm";
import {useForm} from "antd/lib/form/Form";
import {WalletIcon} from "@ord-components/icon/WalletIcon";
import {
    CreateSaleOrderDetailDto,
    CreateSaleOrderDto,
    PaymentOrderDetailInformationDto,
    PaymentOrderDto,
    UpdateOrderDetailDto
} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {OrderRestaurantService} from "@api/OrderRestaurantService";
import {orderStateStore} from "@ord-store/Restaurant/Order/OrderStateStore";
import {orderFilterStore} from "@ord-store/Restaurant/Order/OrderFilterStore";
import {observer} from "mobx-react-lite";

const flexCenter = 'flex items-center justify-between my-1 h-8';

const getTotalAmountBeforeDiscount = (details: any) => {
    return details?.reduce((total: number, item: any) => total +
        CalculatorCurrencyUtil.calculateTotalAmountAfterDiscount(item.productPrice, item.qty, item.discountAmount), 0);
}

const getTotalAmountBeforeTax = (details: any, discountAmount?: number) => {
    const totalAmountAfterDiscount = details?.reduce((total: number, item: any) => total +
        CalculatorCurrencyUtil.calculateTotalAmountAfterDiscount(item.productPrice, item.qty, item.discountAmount), 0);
    return totalAmountAfterDiscount - (discountAmount || 0);
}

const getTaxAmount = (details: any, taxDiscountAmount?: number) => {
    const totalSubTaxAmount = details?.reduce((total: number, item: any) => total +
        CalculatorCurrencyUtil.calculateSubTaxAmount(item.productPrice, item.qty, item.discountAmount, item.taxPercent), 0);
    return totalSubTaxAmount - (taxDiscountAmount || 0);
}

const buildOrderDetails = (orderSelected: any) =>
    orderSelected.details?.map((detail: any) => ({
        productId: detail.productId,
        productUnitId: detail.productUnitId,
        qty: detail.qty,
        convertRate: detail.convertRate,
        price: detail.productPrice,
        isPriceIncludeTax: detail.isProductPriceIncludeTax,
        discountType: detail.discountType,
        discountPercent: detail.discountPercent,
        discountAmount: detail.discountAmount,
        taxPercent: detail.taxPercent,
        taxCode: detail.taxCode,
        notes: detail.notes
    })) as PaymentOrderDetailInformationDto[];

const buildOrderDetailsForOrder = (orderSelected: any) =>
    orderSelected.details?.map((detail: any) => ({
        orderId: orderSelected.id,
        productId: detail.productId,
        productUnitId: detail.productUnitId,
        qty: detail.qty,
        convertRate: detail.convertRate,
        price: detail.productPrice,
        discountType: detail.discountType,
        discountPercent: detail.discountPercent,
        discountAmount: detail.discountAmount,
        taxPercent: detail.taxPercent,
        taxCode: detail.taxCode,
        notes: detail.notes
    }));

const buildPaymentOrderInformation = (values: any, orderSelected: any) => ({
    orderChannelTypeId: values.orderChannelTypeId,
    partnerId: orderSelected.partnerId,
    invoiceDate: values.invoiceDate,
    discountType: values.discountType,
    discountPercent: values.discountPercent,
    discountAmount: values.discountAmount,
    taxDiscountPercent: values.taxDiscountPercent,
    taxDiscountCode: values.taxDiscountCode,
    taxDiscountAmount: values.taxDiscountAmount,
    taxPercent: values.taxPercent,
    paymentMethod: values.paymentMethod,
    paymentAmount: values.paymentMethod === PaymentMethodEnum.CentralBilling ? 0 : values.totalAmountRound,
    shopBankAccountId: values.shopBankAccountId,
    isShowInfoExportEInvoice: values.isShowInfoExportEInvoice,
    notes: values.notes,
    details: buildOrderDetails(orderSelected)
});

const buildPaymentOrderBody = (values: any, orderSelected: any): PaymentOrderDto => {
    const isPaymentExistOrder = !!orderSelected.id;

    const baseBody: PaymentOrderDto = {
        isPaymentExistOrder,
        paymentOrderInformation: buildPaymentOrderInformation(values, orderSelected)
    };

    const orderDetails = buildOrderDetailsForOrder(orderSelected);

    if (isPaymentExistOrder) {
        return {
            ...baseBody,
            orderUpdateInformation: {
                id: orderSelected.id,
                partnerId: orderSelected.partnerId,
                tableId: orderSelected.tableId,
                notes: values.notes,
                details: orderDetails as UpdateOrderDetailDto[]
            }
        };
    }

    return {
        ...baseBody,
        orderCreateInformation: {
            partnerId: orderSelected.partnerId,
            tableId: orderSelected.tableId,
            notes: values.notes,
            numberOfCustomer: orderSelected.numberOfCustomer,
            reservationId: orderSelected.reservationId,
            details: orderDetails as CreateSaleOrderDetailDto[]
        } as CreateSaleOrderDto
    };
};

type PaymentOrderProps = {
    onClosePayment: () => void
}

const PaymentOrder = (props: PaymentOrderProps) => {
    const {onClosePayment} = props;
    const {t} = useTranslation('order');
    const [form] = useForm();
    const details = orderStateStore.orderSelected?.details || [];

    const disCountAmount_w = Form.useWatch('discountAmount', form);
    const taxDiscountAmount_w = Form.useWatch('taxDiscountAmount', form);
    const totalAmountBeforeDiscount_w = Form.useWatch('totalAmountBeforeDiscount', form);
    const totalAmountBeforeTax_w = Form.useWatch('totalAmountBeforeTax', form);
    const taxAmount_w = Form.useWatch('taxAmount', form);
    const totalAmountRound_w = Form.useWatch('totalAmountRound', form);

    useEffect(() => {
        calculator();
    }, [disCountAmount_w, taxDiscountAmount_w, orderStateStore.orderSelected]);

    const calculator = () => {
        const formValues = form.getFieldsValue();
        const totalAmountBeforeDiscount = getTotalAmountBeforeDiscount(details);
        const totalAmountBeforeTax = getTotalAmountBeforeTax(details, formValues.discountAmount);
        const taxAmount = getTaxAmount(details, formValues.taxDiscountAmount);
        const totalAmount = totalAmountBeforeTax + taxAmount;
        const totalAmountRound = CalculatorCurrencyUtil.summaryTotalAmountRound(totalAmount);

        const values = {
            ...orderStateStore.orderSelected,
            totalAmountBeforeDiscount: totalAmountBeforeDiscount,
            totalAmountBeforeTax: totalAmountBeforeTax,
            taxAmount: taxAmount,
            totalAmountRound: totalAmountRound
        }
        form.setFieldsValue(values);
    }

    const onFinish = async (values: any) => {
        try {
            UiUtils.setBusy();
            const body = buildPaymentOrderBody(values, orderStateStore.orderSelected);
            const result = await OrderRestaurantService.paymentOrder({body});

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            UiUtils.showSuccess('Thanh toán thành công');
            orderStateStore.deleteOrder(orderStateStore.orderSelected.tableId);
            orderFilterStore.setTimeStampTableFilter(new Date().getMilliseconds());
            orderFilterStore.setTimeStampOrderListFilter(new Date().getMilliseconds());
            onClosePayment && onClosePayment();
        } catch (ex) {
            console.error(ex);
            UiUtils.showError('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            UiUtils.clearBusy();
        }
    }

    return (
        <div className='flex flex-col' style={{height: 'calc(100vh - 110px)'}}>
            <div style={{maxHeight: 'calc(100vh - 570px)'}}>
                <div className='overflow-y-scroll scrollbar-hide' style={{maxHeight: 'inherit'}}>
                    {
                        !!details && details?.map((detail: any) => <div
                                className='flex items-start justify-between py-2 border-b border-dashed border-[#e9e9e9]'
                                key={detail.productId}>
                                <div className='w-14 h-14 flex-shrink-0 overflow-hidden rounded-[6px] mr-[6px] self-center'>
                                    <img loading='lazy' alt={detail.productName}
                                         src={detail.imageUrl ? GetFileUrl(detail.imageUrl) : "/images/product-placeholder.png"}
                                         className='object-cover w-full h-full'/>
                                </div>
                                <div className='flex-grow ml-3 mb-[6px] ord-input-bottom-line min-w-[200px] '>
                                    <TextLineClampDisplay rows={1}
                                                          className='text-[#44494D] h-[24px] !text-base text-black font-semibold'
                                                          content={detail.productName}/>
                                    <TextLineClampDisplay rows={1}
                                                          content={detail.notes}/>
                                </div>
                                <p className='font-semibold text-base text-black w-20 ml-5 self-center border-l border-solid border-[#cecece] pl-3'>SL: {detail.qty} </p>
                                <div className='ml-4 w-32 text-right ml-3 self-center border-l border-solid border-[#cecece]'>
                                    <PriceCell className='font-semibold text-base text-black '
                                               value={detail.subTotalAmount}/>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="flex flex-col mt-auto border-t border-solid border-[#e1e1e1]">
                <Form form={form} onFinish={onFinish}>
                    <div className='overflow-y-auto scrollbar-hide relative' style={{maxHeight: 'inherit'}}>
                        <h3 className='my-3 text-black text-base font-semibold'>{t('Chi tiết thanh toán')}</h3>

                        <div className={flexCenter}>
                            <div> {t('Kênh bán')} </div>
                            <div>
                                <Form.Item noStyle name="orderChannelTypeId" initialValue={0}>
                                    <OrdSelect placeholder={t('Kênh bán')} datasource={useSelectChannelType()}/>
                                </Form.Item>
                            </div>
                        </div>

                        <div className={flexCenter}>
                            <div> {t('Tạm tính')} <span className='font-bold'>{details?.length || 0} </span> món
                            </div>
                            <div>
                                <Form.Item noStyle hidden name='totalAmountBeforeDiscount'/>
                                <PriceCell className='font-bold' value={totalAmountBeforeDiscount_w}/>
                            </div>
                        </div>

                        <DiscountForm form={form}/>

                        <div className={flexCenter}>
                            <div> {t('Tổng tiền trước thuế')} </div>
                            <div>
                                <Form.Item noStyle hidden name='totalAmountBeforeTax'/>
                                <PriceCell className='font-bold' value={totalAmountBeforeTax_w}/>
                            </div>
                        </div>

                        <div className={flexCenter}>
                            <div> {t('Tổng tiền thuế')} </div>
                            <div>
                                <Form.Item noStyle hidden name='taxAmount'/>
                                <PriceCell value={taxAmount_w}/>
                            </div>
                        </div>

                        <div className={flexCenter}>
                            <div className='font-bold text-xl'> {t('Thành tiền')} </div>
                            <div>
                                <Form.Item noStyle hidden name='totalAmountRound'/>
                                <PriceCell className='font-bold' value={totalAmountRound_w}/>
                            </div>
                        </div>

                        <div className={flexCenter + ' flex-wrap'}>
                            <div> {t('Phương thức TT')} </div>
                            <PaymentMethodForm/>
                        </div>

                        <div className={flexCenter}>
                            <div> {t('Ngày đơn hàng')} </div>
                            <div>
                                <Form.Item noStyle name='invoiceDate'>
                                    <OrdDateTimeInput
                                        disabledDate={(current) => {
                                            return current && current.isAfter(dayjs(), "minutes");
                                        }}
                                        variant="borderless"
                                    ></OrdDateTimeInput>
                                </Form.Item>
                            </div>
                        </div>

                        <div className={flexCenter}>
                            <div> {t('Ghi chú')} </div>
                            <div>
                                <Form.Item noStyle name="notes">
                                    <TextArea variant="borderless" rows={1} maxLength={200}/>
                                </Form.Item>
                            </div>
                        </div>

                        <div className={flexCenter}>
                            <Form.Item
                                noStyle
                                name="isShowInfoExportEInvoice"
                                valuePropName="checked"
                                initialValue={false}
                            >
                                <Checkbox>{t('Xuất hóa đơn điện tử')}</Checkbox>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </div>
            <Button icon={<WalletIcon/>} onClick={form.submit}
                    className='w-full px-4 text-base font-semibold mt-4 rounded-[6px] text-white bg-[#15713A]'>
                Thanh toán
            </Button>
        </div>
    );
};

export default memo(observer(PaymentOrder));