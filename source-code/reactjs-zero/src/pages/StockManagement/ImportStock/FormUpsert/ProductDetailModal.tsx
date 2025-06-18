import React, {memo, useEffect, useMemo, useState} from 'react';
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import {Col, Divider, Form, Input, Modal, Row} from "antd";
import {useForm} from "antd/lib/form/Form";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {currencyDefault, TaxCodeNotUse} from "@ord-core/AppConst";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import LotProductDetailItem from "@pages/StockManagement/ImportStock/FormUpsert/LotProductDetailItem";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDiscountType} from "@pages/SalesInvoice/Sell/productOrderForm";
import {StockProductSelectUnitDto} from "@api/index.defs";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";
import Utils from "@ord-core/utils/utils";
import {NumericFormat} from "react-number-format";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const ProductDetailModal = () => {
    const {importStockUpsertStore: mainStore} = useStore();
    const {productDetail} = mainStore;

    const [isOpen, setIsOpen] = useState(false);
    const taxList = useSelectTaxCode();
    const [units, setUnits] = useState<SelectDataSource>({
        data: [],
        isPending: true
    })
    const {formMoveTicket} = useUpsertStockMove()
    const [form] = useForm();
    const {
        price = 0,
        taxPercent = 0,
        qty = 0,
        discountType,
        discountAmount = 0,
    } = Form.useWatch([], form) || {};

    const onFinish = (values: any) => {
        var index = mainStore.productItems.findIndex(x => x.uuid === productDetail.uuid);
        if (index != -1) {
            mainStore.productItems[index] = {
                ...productDetail,
                ...values
            }

            const moveValueForm = formMoveTicket.getFieldsValue();
            const {
                products,
                move
            } = UpsertFormUtil.calculatorAllProduct(mainStore.productItems, moveValueForm);
            mainStore.productItems = [...products];
            formMoveTicket.setFieldsValue({
                ...moveValueForm,
                ...move
            });
        }

        onCancel();
    }

    const discountChange = () => {
        const discountInput = form.getFieldValue("discountInput") || 0;
        const discountType = form.getFieldValue("discountType");

        const totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(price, qty);

        const discountAmount = discountType === DiscountTypeEnum.Value ? discountInput : 0;
        const discountPercent = discountType === DiscountTypeEnum.Percent ? discountInput : 0;
        const calculateDiscount =
            CalculatorCurrencyUtil.calculateDiscount(discountType, discountPercent, discountAmount, totalAmountBeforeDiscount);

        form.setFieldsValue({
            discountAmount: calculateDiscount.discountAmount,
            discountPercent: calculateDiscount.discountPercent,
        });
    }

    const onChangeUnit = (v: any, item: any) => {
        const data = item.data;
        if (data) {
            form.setFieldValue('convertRate', data.convertRate);
            form.setFieldValue('unitName', data.unitName);
            form.setFieldValue('price', (data.latestImportPrice || 0));
        }
    }

    const {
        totalAmountBeforeDiscount,
        totalAmountAfterDiscount,
        subTaxAmount,
        // subTotalAmount,
    } = useMemo(() => {
        const totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(price, qty);
        const totalAmountAfterDiscount = CalculatorCurrencyUtil.calculateTotalAmountAfterDiscount(price, qty, discountAmount);
        const subTaxAmount = CalculatorCurrencyUtil.calculateSubTaxAmount(price, qty, discountAmount, taxPercent);
        return {
            totalAmountBeforeDiscount: totalAmountBeforeDiscount,
            totalAmountAfterDiscount: totalAmountAfterDiscount,
            subTaxAmount: subTaxAmount,
            // subTotalAmount: CurrencyCalculatorUtil.getSubTotalAmount(totalAmountAfterDiscount, subTaxAmount),
        };
    }, [price, price, qty, discountAmount, taxPercent]);

    const onOk = () => {
        form.submit();
    }

    const onCancel = () => {
        setIsOpen(false);
        form.setFieldsValue({});
        mainStore.productDetail = {};
    }

    useEffect(() => {
        if (productDetail?.productId) {
            setIsOpen(true);
            form.setFieldsValue({});

            const unitCombo = {
                data: productDetail?.units?.map((item: StockProductSelectUnitDto) => ({
                    label: item.unitName,
                    value: item.productUnitId,
                    data: item
                })) || [],
                isPending: false
            };

            setUnits(unitCombo);
            form.setFieldsValue(productDetail);
        }
    }, [productDetail]);

    return (
        <Modal
            title={'Chi tiết sản phẩm'}
            open={isOpen}
            onOk={onOk}
            destroyOnHidden={true}
            width={600}
            onCancel={onCancel}
            footer={<FooterCrudModal onOk={onOk} onCancel={onCancel}/>}>
            <Form form={form} onFinish={onFinish} autoComplete="off">
                <Row gutter={[16, 0]}>
                    <Col span={24}>
                        <FloatLabel label={'Tên sản phẩm'}>
                            <Form.Item name="productName">
                                <Input disabled/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={12}>
                        <FloatLabel label={'Số lượng'}>
                            <Form.Item name="qty">
                                <PriceNumberInput decimalLimit={0} integerLimit={10} step={1} min={1}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={'Đơn vị tính'}>
                            <Form.Item name="productUnitId">
                                <OrdSelect datasource={units} onChange={onChangeUnit}
                                           allowClear={false}
                                ></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={'Giá nhập'}>
                            <Form.Item name="price">
                                <PriceNumberInput step={1000} min={0}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={'Thuế'}>
                            <Form.Item name="taxCode" initialValue={TaxCodeNotUse}>
                                <OrdSelect allowClear={false}
                                           onChange={(data, option: IOrdSelectOption) => {
                                               form.setFieldValue("taxPercent", option.data?.taxPercent);
                                           }}
                                           datasource={taxList}/>
                            </Form.Item>
                            <Form.Item hidden noStyle name="taxPercent" initialValue={0}> </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        {
                            productDetail?.isProductUseLotNumber &&
                            <FloatLabel label={'Chọn số lô'}>
                                <LotProductDetailItem
                                    product={productDetail}
                                    lotNumbers={productDetail?.lotNumbers || []}
                                    enableAddNewEntity={true}
                                />
                            </FloatLabel>
                        }
                    </Col>

                    <Divider className='mt-0'/>

                    <Col span={8}>
                        <FloatLabel label={'Kiểu giảm giá'}>
                            <Form.Item className="text-left" name="discountType">
                                <OrdSelect onChange={(val) => {
                                    discountChange();
                                }} datasource={useSelectDiscountType()}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={discountType != DiscountTypeEnum.Percent ? 0 : 8}>
                        <FloatLabel label={'Giá trị'}>
                            <Form.Item name="discountInput">
                                <PriceNumberInput onChange={discountChange}
                                                  step={discountType == DiscountTypeEnum.Percent ? 1 : 1000} min={0}
                                                  max={discountType == DiscountTypeEnum.Percent ? 100 : totalAmountBeforeDiscount}/>
                            </Form.Item>

                        </FloatLabel>
                    </Col>
                    <Col span={discountType != DiscountTypeEnum.Percent ? 16 : 8}>
                        <FloatLabel label={'Tiền giảm giá'}>
                            <Form.Item name="discountAmount">
                                <PriceNumberInput disabled={discountType === DiscountTypeEnum.Percent} step={1} min={0}
                                                  max={totalAmountBeforeDiscount}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Divider className='mt-0'/>

                    <Col span={24} className="flex justify-between font-semibold h-[33px]">
                        <span>Tiền thuế</span>
                        <span>
                            {Utils.formatterNumber(subTaxAmount, 2)} {currencyDefault}
                        </span>
                    </Col>
                    <Col span={24} className="flex justify-between font-semibold text-[17px]">
                        <span>{'Thành tiền'}</span>
                        <span>{<NumericFormat value={totalAmountAfterDiscount} displayType={'text'}
                                              thousandSeparator={true}/>} {currencyDefault}</span>
                    </Col>
                </Row>

                <div hidden>
                    <Form.Item name="unitName"/>
                    <Form.Item name="convertRate"/>
                    <Form.Item name="discountPercent"/>
                    <Form.Item name="uuid"/>
                </div>
            </Form>
        </Modal>
    );
};

export default memo(observer((ProductDetailModal)));