import {SaleInvoiceService} from "@api/SaleInvoiceService";
import {ProductPriceListDetailDto, ProductUnitDto, SaleInvoiceDetailDto} from "@api/index.defs";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectProductPriceList} from "@ord-components/forms/select/selectDataSource/useSelectProductPriceList";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import {currencyDefault, TaxCodeNotUse} from "@ord-core/AppConst";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import {LotProductInput} from "@pages/SalesInvoice/Form/lotProductInput";
import {SellContext} from "@pages/SalesInvoice/Sell/index";
import {Checkbox, Divider, Form, Input, Modal} from "antd";
import {debounce, round} from "lodash";
import {forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {NumericFormat} from "react-number-format";
// @ts-ignore
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";

export const useSelectDiscountType = (): SelectDataSource => {
    const {t} = useTranslation('sale-invoice');
    const key = 'SelectDiscountType';

    return useSelectDataSource(key, async () => {
        return [{
            value: DiscountTypeEnum.Value,
            label: t('discountWithValue'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('discountWithValue'))
        }, {
            value: DiscountTypeEnum.Percent,
            label: t('discountWithPercentage'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('discountWithPercentage'))
        }];
    });
};

export const ProductOrderForm = forwardRef((props: {
    products: any,
    refreshProductHandler: Function,
    disabled?: boolean
}, ref) => {
    const form = Form.useFormInstance();
    const [formProduct] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [product, setProduct] = useState<any>({});
    const [productUnits, setProductUnits] = useState<SelectDataSource>({
        data: [],
        isPending: true
    })
    const priceListDetailsRef = useRef<ProductPriceListDetailDto[]>([])

    const [open, setOpen] = useState(false);
    const {t} = useTranslation('sale-invoice');
    const {t: tPriceList} = useTranslation('price-list');
    // @ts-ignore
    const {formSearch} = useContext(SellContext);
    const inventoryId_w = Form.useWatch('inventoryId', form);
    const priceListId_w = Form.useWatch('priceListId', formProduct);

    const {
        priceWithTax = 0,
        isPriceIncludeTax = false,
        taxPercent = 0,
        qty = 0,
        discountType,
        discountAmount = 0,
        price = 0,
    } = Form.useWatch([], formProduct) || {};

    // Tính toán basePrice khi có thay đổi các field liên quan
    useEffect(() => {
        const handler = debounce(() => {
            const basePrice = CalculatorCurrencyUtil.calculatePriceFromPriceWithTax(
                priceWithTax, taxPercent, isPriceIncludeTax);
            const totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(
                basePrice, qty)
            const discountPercent = formProduct.getFieldValue("discountInput");
            const calculateDiscount = CalculatorCurrencyUtil.calculateDiscount(
                discountType, discountPercent, discountAmount, totalAmountBeforeDiscount);

            formProduct.setFieldsValue({
                discountAmount: calculateDiscount.discountAmount,
                discountPercent: calculateDiscount.discountPercent,
                price: basePrice
            })
        }, 300);

        handler();
        return () => handler.cancel();
    }, [priceWithTax, isPriceIncludeTax, taxPercent, qty, discountType]);

    const {
        productAmount,
        totalAmountAfterDiscount,
        subTaxAmount,
        subTotalAmount,
    } = useMemo(() => {
        const basePrice = CalculatorCurrencyUtil.calculatePriceFromPriceWithTax(
            priceWithTax, taxPercent, isPriceIncludeTax);

        const totalAmountBeforeDiscount = CalculatorCurrencyUtil
            .calculateTotalAmountBeforeDiscount(basePrice, qty);

        const totalAmountAfterDiscount = CalculatorCurrencyUtil
            .calculateTotalAmountAfterDiscount(basePrice, qty, discountAmount);
        const subTaxAmount = CalculatorCurrencyUtil
            .calculateSubTaxAmount(basePrice, qty, discountAmount, taxPercent);

        const subTotalAmount = CalculatorCurrencyUtil
            .calculateSubTotalAmount(basePrice, qty, discountAmount, taxPercent);

        return {
            productAmount: totalAmountBeforeDiscount,
            totalAmountAfterDiscount: totalAmountAfterDiscount,
            subTaxAmount: subTaxAmount,
            subTotalAmount: subTotalAmount
        };
    }, [price, priceWithTax, isPriceIncludeTax, qty, discountAmount, taxPercent]);

    const discountChange = () => {
        const basePrice = CalculatorCurrencyUtil.calculatePriceFromPriceWithTax(
            priceWithTax, taxPercent, isPriceIncludeTax);

        const productQty = formProduct.getFieldValue("qty") || 0;
        const discountInput = formProduct.getFieldValue("discountInput");
        const discountType = formProduct.getFieldValue("discountType");
        const discountPercent = discountType === DiscountTypeEnum.Percent ? discountInput : 0;
        const discountAmount = discountType === DiscountTypeEnum.Value ? discountInput : 0;

        const totalAmountBeforeDiscount = CalculatorCurrencyUtil
            .calculateTotalAmountBeforeDiscount(basePrice, productQty);

        const calculateDiscount = CalculatorCurrencyUtil.calculateDiscount(
            discountType, discountPercent, discountAmount, totalAmountBeforeDiscount);

        formProduct.setFieldsValue({
            discountAmount: calculateDiscount.discountAmount,
            discountPercent: calculateDiscount.discountPercent
        });
    }

    /// Check lại type chỗ này trường hợp trả hàng purchasedQty
    const onFinish = (values: any) => {
        let p = props.products.find((x: any) => x.productId === product.productId);

        if (p) {
            p.productName = values.productName;
            p.qty = values.qty;
            p.price = values.price;
            p.priceWithTax = values.priceWithTax;
            p.subTotalAmount = subTotalAmount;
            p.subTaxAmount = subTaxAmount;
            p.totalAmountAfterDiscount = totalAmountAfterDiscount;
            p.taxCode = values.taxCode;
            p.taxPercent = values.taxPercent;
            p.isPriceIncludeTax = values.isPriceIncludeTax;

            p.discountType = values.discountType;
            p.discountPercent = values.discountPercent;
            p.discountAmount = values.discountAmount;
            p.productUnitId = values.productUnitId;
            p.basicUnitName = values.basicUnitName;
            p.convertRate = values.convertRate;
            p.lotNumber = values.lotNumber;
            p.lotExpiryDate = values.lotExpiryDate;
            p.lotNumberId = values.lotNumberId;
            // p.listOfLotNumbers = values.listOfLotNumbers;
        }

        if (p.purchasedQty) {
            const errorTitle = "Số lượng trả vượt quá số lượng đã mua";
            if (values.convertRate > p.qtyConvert) {
                UiUtils.showError(errorTitle);
                setConfirmLoading(false);
                return;
            }
            const newPurchasedQty = Math.floor((p.qtyConvert || 0) / values.convertRate);

            if (values.productQty > newPurchasedQty) {
                UiUtils.showError(errorTitle);
                setConfirmLoading(false);
                return;
            }
            p.purchasedQty = newPurchasedQty;
            p.qtyByUnit = newPurchasedQty;
        }

        props.refreshProductHandler();
        setConfirmLoading(false);
        handleCancel();
    }

    const showModal = (productCur: SaleInvoiceDetailDto) => {
        setOpen(true);
        const priceListId = formSearch.getFieldValue('priceListId');

        SaleInvoiceService.getDetailInPriceList({
            idHash: productCur.idHash,
            priceLisId: priceListId,
        }).then(p => {
            setProductUnits({
                data: p.listProductUnit ? p.listProductUnit.map((it: ProductUnitDto) => {
                    return {
                        value: it.id,
                        label: (<span>{it.unitName}</span>),
                        fts: Utils.toLowerCaseNonAccentVietnamese(it.unitName || ''),
                        data: {...it, price: it.price}
                    } as IOrdSelectOption
                }) : [],
                isPending: false
            });

            productCur.isProductUseLotNumber = p.productDto?.isProductUseLotNumber;
            setProduct(productCur);

            const basicUnit = p.listProductUnit?.find(x => x.isBasicUnit);
            const basicUnitId = basicUnit?.id;

            const productUnitIdValue = basicUnit?.unitName !== null ? (productCur.productUnitId || basicUnitId) : null;
            formProduct.setFieldsValue({
                priceListId: priceListId,
                productName: productCur.productName,
                productUnitId: productUnitIdValue,
                qty: productCur.qty,

                price: productCur.price,
                priceWithTax: productCur.priceWithTax,
                isPriceIncludeTax: productCur.isPriceIncludeTax,

                taxPercent: productCur.taxPercent,
                taxCode: productCur.taxCode,

                lotNumber: productCur.lotNumber,
                lotNumberId: productCur.lotNumberId,

                discountType: productCur.discountType || DiscountTypeEnum.Percent,
                discountAmount: productCur.discountAmount,
                discountInput: productCur.discountType == DiscountTypeEnum.Value ? productCur.discountAmount : productCur.discountPercent,

                basicUnitName: productCur.basicUnitName,
                convertRate: productCur.convertRate || 1,

                // productPriceBeforeTax: productCur.productPriceWithTax,
                lotExpiryDate: productCur.lotExpiryDate,
            });
        })
    };

    const handleOk = () => {
        setConfirmLoading(true);
        formProduct.submit();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    useImperativeHandle(ref, () => ({
        showModal
    }));

    //Lấy bảng giá chi tiết của sản phẩm kèm đơn vị để khi thay đổi đơn vị sản phẩm thì giá sản phẩm sẽ thay đổi theo bảng giá
    useEffect(() => {
        if (priceListId_w) {
            SaleInvoiceService.getProductPriceListDetail({
                body: {
                    productId: product.productId,
                    priceListId: priceListId_w
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
    }, [priceListId_w]);

    return (<>
        <Modal
            title={t('productOrderForm')}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            width={600}
            onCancel={handleCancel}
            footer={<FooterCrudModal onOk={handleOk} onCancel={handleCancel}/>}>
            <div>
                <Form form={formProduct} onFinish={onFinish} autoComplete="off">
                    <div>
                        <FloatLabel label={tPriceList('priceList')}>
                            <Form.Item name="priceListId">
                                <OrdSelect datasource={useSelectProductPriceList()} disabled={true}/>
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
                            <FloatLabel label={t('productQty')}>
                                <Form.Item name="qty">
                                    <PriceNumberInput step={1} min={1}/>
                                </Form.Item>
                            </FloatLabel>
                        </div>
                        <div className="col-span-1">
                            <FloatLabel label={t('productUnit')}>
                                <Form.Item name="productUnitId">
                                    <OrdSelect datasource={productUnits}
                                               allowClear={false}
                                               disabled={props.disabled}
                                               onChange={(data, option: IOrdSelectOption) => {
                                                   const unit = priceListDetailsRef.current?.find(x => x.productUnitId == data);
                                                   const dataOp = option.data as ProductUnitDto;
                                                   const price = unit?.productPrice || dataOp.price || 0;
                                                   const priceWithTax = CalculatorCurrencyUtil.calculatePriceWithTax(
                                                       price, taxPercent, isPriceIncludeTax);

                                                   formProduct.setFieldsValue({
                                                       basicUnitName: dataOp.unitName,
                                                       convertRate: dataOp.convertRate,
                                                       price: price,
                                                       priceWithTax: priceWithTax
                                                   });
                                               }}
                                    ></OrdSelect>
                                </Form.Item>
                            </FloatLabel>
                            <Form.Item name="basicUnitName" hidden><Input/></Form.Item>
                            <Form.Item name="convertRate" hidden><Input/></Form.Item>
                        </div>
                        <div className="col-span-1">
                            <Form.Item
                                noStyle
                                name="isPriceIncludeTax"
                                valuePropName="checked"
                            >
                                <Checkbox disabled={props.disabled}>{t("isPriceIncludeTax")}</Checkbox>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <FloatLabel label={isPriceIncludeTax ? t("priceWithTax") : t("price")}>
                            <Form.Item name="priceWithTax">
                                <PriceNumberInput step={1000} min={0} disabled={props.disabled}/>
                            </Form.Item>
                        </FloatLabel>
                        <div hidden={!isPriceIncludeTax}>
                            <FloatLabel label={t("price")}>
                                <Form.Item name="price">
                                    <PriceNumberInput disabled step={1000} min={0}/>
                                </Form.Item>
                            </FloatLabel>
                        </div>
                        <FloatLabel label={t("TaxPercent")}>
                            <Form.Item name="taxCode" initialValue={TaxCodeNotUse}>
                                <OrdSelect allowClear={false}
                                           onChange={(data, option: IOrdSelectOption) => {
                                               formProduct.setFieldValue("taxPercent", option.data?.taxPercent);
                                           }}
                                           disabled={props.disabled}
                                           datasource={useSelectTaxCode()}/>
                            </Form.Item>
                            <Form.Item hidden noStyle name="taxPercent" initialValue={0}>

                            </Form.Item>
                            <Form.Item hidden noStyle name="isPriceIncludeTax">

                            </Form.Item>
                        </FloatLabel>
                    </div>
                    <div>
                        {product.isProductUseLotNumber && <FloatLabel label={t('sellWithLotNumber')}>
                            <LotProductInput product={product} inventoryId={inventoryId_w} form={formProduct}/>
                        </FloatLabel>}
                    </div>
                    {/*<div className="flex justify-between font-semibold text-[16px]">*/}
                    {/*    <span>{t('productAmount')}</span>*/}
                    {/*    /!*<span>{<NumericFormat value={productAmount} displayType={'text'}*!/*/}
                    {/*    /!*                      thousandSeparator={true}/>} {currencyDefault}</span>*!/*/}
                    {/*</div>*/}
                    <Divider className='mt-0'/>
                    <div className="grid-cols-3 grid gap-3">
                        <div className='col-span-1'>
                            <FloatLabel label={t('discountPriceType')}>
                                <Form.Item className="text-left" name="discountType">
                                    <OrdSelect onChange={(val) => {
                                        discountChange();
                                    }} disabled={props.disabled}
                                               datasource={useSelectDiscountType()}/>
                                </Form.Item>
                            </FloatLabel>
                        </div>
                        <div className={discountType != 2 ? 'hidden' : 'col-span-1'}>
                            <FloatLabel label={t('discountAmount')}>
                                <Form.Item name="discountInput">
                                    <PriceNumberInput onChange={discountChange}
                                                      disabled={props.disabled}
                                                      step={discountType === DiscountTypeEnum.Percent ? 1 : 1000}
                                                      min={0}
                                                      max={discountType === DiscountTypeEnum.Percent ? 100 : productAmount}/>
                                </Form.Item>
                                <Form.Item name="discountPercent" hidden>
                                    <Input/>
                                </Form.Item>
                            </FloatLabel>
                        </div>
                        <div className={discountType != 2 ? 'col-span-2' : 'col-span-1'}>
                            <FloatLabel label={t('totalDiscountAmount')}>
                                <Form.Item name="discountAmount">
                                    <PriceNumberInput
                                        disabled={discountType == DiscountTypeEnum.Percent || props.disabled} step={1}
                                        min={0}
                                        max={productAmount}
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
                </Form>
            </div>
        </Modal>
    </>)
})
