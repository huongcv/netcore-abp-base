import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import {Checkbox, Divider, Form, Input, Modal} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectProductPriceList} from "@ord-components/forms/select/selectDataSource/useSelectProductPriceList";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {ProductPriceListDetailDto} from "@api/index.defs";
import {currencyDefault, TaxCodeNotUse} from "@ord-core/AppConst";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import Utils from "@ord-core/utils/utils";
import {NumericFormat} from "react-number-format";
import {useSelectDiscountType} from "@pages/SalesInvoice/Sell/productOrderForm";
import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {round} from "lodash";
import {SaleInvoiceService} from "@api/SaleInvoiceService";
import {IProductOrderListItem} from "@pages/2.Restaurant/Order/Foods/CardFoodOrder";
import {orderStateStore} from "@ord-store/Restaurant/Order/OrderStateStore";
import {orderFilterStore} from "@ord-store/Restaurant/Order/OrderFilterStore";
import {observer} from "mobx-react-lite";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const ProductOrderDetailModal = forwardRef((props: any, ref) => {
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState(false);
    const {t} = useTranslation('order');
    const [productUnits, setProductUnits] = useState<SelectDataSource>({data: [], isPending: true})
    const priceListDetailsRef = useRef<ProductPriceListDetailDto[]>([])

    const {
        productPriceWithTax = 0,
        isProductPriceIncludeTax = false,
        taxPercent = 0,
        qty = 0,
        discountType,
        discountAmount = 0,
        productPrice = 0
    } = Form.useWatch([], form) || {};

    const onFinish = (values: any) => {
        try {
            const orderSelected = orderStateStore.orderSelected;
            const updateOrder = orderStateStore.updateOrder;

            const update = {
                ...orderSelected,
                details: (orderSelected?.details || [])?.map((product: any) => {
                    return values.productId === product.productId ? ({
                        ...values,
                        subTotalAmount: subTotalAmount
                    }) : product;
                })
            };

            updateOrder(update);
            setIsOpen(false);
        } catch (ex: any) {
            console.error(ex);
        }
    }

    const changeUnit = (productUnitId: number, option: any) => {
        const unit = priceListDetailsRef.current?.find(x => +(x.productUnitId || 0) === productUnitId);

        const data = option.data;
        const price = unit?.productPrice || data.price || 0;
        const priceWithTax = isProductPriceIncludeTax ? (price * (1 + taxPercent / 100)) : price;

        form.setFieldsValue({
            productUnitName: data.unitName,
            convertRate: data.convertRate,
            productPrice: price,
            productPriceWithTax: priceWithTax
        })
    }

    const discountChange = () => {
        const price = CalculatorCurrencyUtil.calculatePriceFromPriceWithTax(
            productPriceWithTax, taxPercent, isProductPriceIncludeTax);

        const discountInput = form.getFieldValue("discountInput") || 0;
        const productQty = form.getFieldValue("qty") || 0;
        const discountType = form.getFieldValue("discountType");

        const totalAmountBeforeDiscount = round(price * productQty, 2);

        if (discountType === DiscountTypeEnum.Percent) {
            const discountAmount = round(totalAmountBeforeDiscount * (discountInput / 100), 2);
            form.setFieldsValue({
                discountAmount: discountAmount || 0,
                discountPercent: discountInput,
            });
        } else {
            form.setFieldsValue({
                discountAmount: discountInput || 0,
                discountPercent: 0,
            });
        }
    }

    useEffect(() => {
        const price = CalculatorCurrencyUtil.calculatePriceFromPriceWithTax(productPriceWithTax, taxPercent, isProductPriceIncludeTax);

        let discountAmount = 0;
        if (discountType === DiscountTypeEnum.Value) {
            discountAmount = form.getFieldValue("discountAmount") || 0;
            discountAmount = discountAmount > price ? price : discountAmount;
        } else {
            const discountInput = form.getFieldValue("discountInput") || 0;
            discountAmount = round(price * qty * (discountInput / 100), 2);
        }

        form.setFieldsValue({
            productPrice: price,
            discountAmount
        });
    }, [productPriceWithTax, isProductPriceIncludeTax, taxPercent, qty, discountType]);

    const {
        totalAmountBeforeDiscount,
        subTaxAmount,
        subTotalAmount,
    } = useMemo(() => {
        const price = CalculatorCurrencyUtil.calculatePriceFromPriceWithTax(productPriceWithTax, taxPercent, isProductPriceIncludeTax);

        const totalAmountAfterDiscount = CalculatorCurrencyUtil.calculateTotalAmountAfterDiscount(price, qty, discountAmount);
        const subTaxAmount = CalculatorCurrencyUtil.calculateSubTaxAmount(price, qty, discountAmount, taxPercent);

        return {
            totalAmountBeforeDiscount: CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(price, qty),
            subTaxAmount: subTaxAmount,
            subTotalAmount: CalculatorCurrencyUtil.calculateSubTotalAmount(totalAmountAfterDiscount, subTaxAmount),
        };
    }, [productPrice, productPriceWithTax, isProductPriceIncludeTax, qty, discountAmount, taxPercent]);

    //Lấy bảng giá chi tiết của sản phẩm kèm đơn vị để khi thay đổi đơn vị sản phẩm
    // thì giá sản phẩm sẽ thay đổi theo bảng giá
    const getPriceListUnitPrice = (product: IProductOrderListItem) => {
        //Nếu là bản giá chung thì trong product không có priceList nên lấy priceListId ở combobox
        const priceListIdConvert = getPriceListId(product);
        if (priceListIdConvert && product?.productId) {
            SaleInvoiceService.getProductPriceListDetail({
                body: {
                    productId: product?.productId as any,
                    priceListId: priceListIdConvert,
                }
            }).then(res => {
                if (res.isSuccessful) {
                    priceListDetailsRef.current = res.data!;
                } else {
                    priceListDetailsRef.current = [];
                }
            }).catch(ex => {
                console.error('getProductPriceListDetail: ', ex);
            })
        }
    }

    const getPriceListId = (product: IProductOrderListItem) => {
        return product?.priceListId || orderFilterStore.priceListId;
    }

    useImperativeHandle(ref, () => ({
        showModal
    }));

    const showModal = (product: IProductOrderListItem) => {
        setIsOpen(true);

        getPriceListUnitPrice(product);

        setProductUnits({
            data: product.units?.map(it => ({
                value: it.value,
                label: (<span>{it.displayName}</span>),
                fts: Utils.toLowerCaseNonAccentVietnamese(it.displayName || ''),
                data: it.data
            } as IOrdSelectOption)) || [],
            isPending: false
        });

        const values = {
            priceListId: getPriceListId(product),
            productName: product.productName,
            productUnitId: product.productUnitId,
            productId: product.productId,
            qty: product.qty,
            productPrice: product.productPrice,
            productPriceWithTax: product.productPriceWithTax,
            isProductPriceIncludeTax: product.isProductPriceIncludeTax,
            taxPercent: product.taxPercent,
            taxCode: product.taxCode,
            discountType: product.discountType,
            discountAmount: product.discountAmount,
            discountInput: product.discountType == DiscountTypeEnum.Percent ? product.discountPercent : product.discountAmount,
            productUnitName: product.units?.find(x => x.value === product.productUnitId)?.data.unitName,
            convertRate: product.convertRate || 1,
            notes: product.notes
        }

        form.setFieldsValue(values);
    };

    return (
        <Modal
            title={t('productOrderForm')}
            open={isOpen}
            onOk={form.submit}
            maskClosable={false}
            width={600}
            onCancel={() => setIsOpen(false)}
            footer={<FooterCrudModal onOk={form.submit} onCancel={() => setIsOpen(false)}/>}>
            <div>
                <Form form={form} onFinish={onFinish} autoComplete="off">
                    <div>
                        <FloatLabel label={t('priceList')}>
                            <Form.Item name="priceListId">
                                <OrdSelect defaultValue={orderFilterStore.priceListId}
                                           datasource={useSelectProductPriceList()}
                                           disabled={true}/>
                            </Form.Item>
                        </FloatLabel>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-3">
                            <FloatLabel label={t('productName')}>
                                <Form.Item name="productName">
                                    <Input disabled/>
                                </Form.Item>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                            <FloatLabel label={t('qty')}>
                                <Form.Item name="qty">
                                    <PriceNumberInput step={1} min={1}/>
                                </Form.Item>
                            </FloatLabel>
                        </div>
                        <div className="col-span-1">
                            <FloatLabel label={t('productUnitName')}>
                                <Form.Item name="productUnitId">
                                    <OrdSelect datasource={productUnits}
                                               allowClear={false}
                                               onChange={(value, option: IOrdSelectOption) => changeUnit(value, option)}
                                    ></OrdSelect>
                                </Form.Item>
                            </FloatLabel>
                            <Form.Item name="productUnitName" hidden><Input/></Form.Item>
                            <Form.Item name="convertRate" hidden><Input/></Form.Item>
                        </div>
                        <div className="col-span-1">
                            <Form.Item
                                noStyle
                                name="isProductPriceIncludeTax"
                                valuePropName="checked"
                            >
                                <Checkbox>{t("isProductPriceIncludeTax")}</Checkbox>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <FloatLabel label={isProductPriceIncludeTax ? t("ProductPriceIncludeTax") : t("ProductPrice")}>
                            <Form.Item name="productPriceWithTax">
                                <PriceNumberInput step={1000} min={0}/>
                            </Form.Item>
                        </FloatLabel>
                        <div hidden={!isProductPriceIncludeTax}>
                            <FloatLabel label={t("productPrice")}>
                                <Form.Item name="productPrice">
                                    <PriceNumberInput disabled step={1000} min={0}/>
                                </Form.Item>
                            </FloatLabel>
                        </div>
                        <FloatLabel label={t("TaxPercentInclude")}>
                            <Form.Item name="taxCode" initialValue={TaxCodeNotUse}>
                                <OrdSelect allowClear={false}
                                           onChange={(data, option: IOrdSelectOption) => {
                                               form.setFieldValue("taxPercent", option.data?.taxPercent);
                                           }}
                                           datasource={useSelectTaxCode()}/>
                            </Form.Item>
                            <Form.Item hidden noStyle name="taxPercent" initialValue={0}></Form.Item>
                            <Form.Item hidden noStyle name="isProductPriceIncludeTax"></Form.Item>
                        </FloatLabel>
                    </div>
                    <Divider className='mt-0'/>
                    <div className="grid-cols-3 grid gap-3">
                        <div className='col-span-1'>
                            <FloatLabel label={t('discountPriceType')}>
                                <Form.Item className="text-left" name="discountType">
                                    <OrdSelect onChange={(val) => {
                                        discountChange();
                                    }} datasource={useSelectDiscountType()}/>
                                </Form.Item>
                            </FloatLabel>
                        </div>
                        <div className={discountType != DiscountTypeEnum.Percent ? 'hidden' : 'col-span-1'}>
                            <FloatLabel label={t('discountAmount')}>
                                <Form.Item name="discountInput">
                                    <PriceNumberInput onChange={discountChange}
                                                      step={discountType == DiscountTypeEnum.Percent ? 1 : 1000} min={0}
                                                      max={discountType == DiscountTypeEnum.Percent ? 100 : totalAmountBeforeDiscount}/>
                                </Form.Item>
                                <Form.Item name="discountPercent" hidden>
                                    <Input/>
                                </Form.Item>
                            </FloatLabel>
                        </div>
                        <div className={discountType != DiscountTypeEnum.Percent ? 'col-span-2' : 'col-span-1'}>
                            <FloatLabel label={t('totalDiscountAmount2')}>
                                <Form.Item name="discountAmount">
                                    <PriceNumberInput disabled={discountType === DiscountTypeEnum.Percent} step={1}
                                                      min={0}
                                                      max={totalAmountBeforeDiscount}
                                    />
                                </Form.Item>
                            </FloatLabel>
                        </div>
                    </div>
                    <Divider className='mt-0'/>
                    <div className="flex justify-between font-semibold h-[33px]">
                        <span>Tiền thuế</span>
                        <span>
                            {Utils.formatterNumber(subTaxAmount, 2)} {currencyDefault}
                        </span>
                    </div>
                    <div className="flex justify-between font-semibold text-[17px]">
                        <span>{t('totalAmount')}</span>
                        <span>{<NumericFormat value={subTotalAmount} displayType={'text'}
                                              thousandSeparator={true}/>} {currencyDefault}</span>
                    </div>

                    <div hidden>
                        <Form.Item name='notes'/>
                        <Form.Item name='productId'/>
                    </div>
                </Form>
            </div>
        </Modal>
    );
});

export default observer(ProductOrderDetailModal);