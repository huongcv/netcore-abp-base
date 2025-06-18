import React from 'react';
import {Button, Card, Form, Radio, Row} from "antd";
import OrdRadio from "@ord-components/forms/select/OrdRadio";
import {usePaymentMode} from "@ord-components/forms/select/selectDataSource/golf/usePaymentMode";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import DiscountMove from "@pages/StockManagement/Shared/Upsert/right/forms/DiscountMove";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import './PaymentInfo.scss'
import {PaymentMethodEnum} from "@pages/SalesInvoice/Form/paymentMethodForm";
import {observer} from "mobx-react-lite";
import withPricePaymentInfo from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/withPricePaymentInfo";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PaymentModeEnum} from "@pages/1.Golf/TeeSheet/Booking/enum/paymentModeEnum";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const PaymentInfo = (props: {}) => {
    const {
        golfBookingStore: mainStore,
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const form = Form.useFormInstance();
    const totalAmountRound_w = Form.useWatch("totalAmountRound", form);
    const debtAmount_w = Form.useWatch("debtAmount", form);
    const paymentMode_w = Form.useWatch("paymentMode", form);
    const onSetPaymentFull = () => {
        form.setFieldValue("paymentAmount", totalAmountRound_w);
    };
    const onChangeDiscountType = () => {
        form.setFieldValue("discountValue", 0);
    };
    const paymentMethods = useSelectPaymentMethod();
    return (
        <>
            {/*<Card title={t('paymentModeInfo')} className='mb-4'*/}
            {/*      styles={*/}
            {/*          {*/}
            {/*              header: {*/}
            {/*                  borderBottom: "none",*/}
            {/*                  marginTop: "10px"*/}
            {/*              },*/}
            {/*          }*/}
            {/*      }>*/}
            {/*   */}
            {/*</Card>*/}

            <Card title={t('paymentInfo')}
                  styles={
                      {
                          header: {
                              borderBottom: "none",
                              marginTop: "10px"
                          },
                      }
                  }>
                <Row gutter={[16, 8]}>
                    <ColSpanResponsive span={24}>
                        <FloatLabel label={t('paymentModeInfo')} required>
                            <Form.Item
                                name="paymentMode"
                                rules={[{required: true, message: 'Vui lòng chọn cách thanh toán'}]}
                            >
                                <OrdRadio
                                    // style={{
                                    //     display: 'flex',
                                    //     flexDirection: 'column',
                                    //     gap: 8,
                                    // }}
                                    datasource={usePaymentMode()}/>

                            </Form.Item>
                        </FloatLabel>
                    </ColSpanResponsive>

                    <div className='hidden'>
                        {/*tam an*/}
                        <ColSpanResponsive span={24}>
                            <FloatLabel label={t('totalAmountBeforeDiscount')}>
                                <Form.Item name='totalAmountBeforeDiscount' className='text-right'>
                                    <PriceNumberInput disabled></PriceNumberInput>
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>
                        <ColSpanResponsive span={24}>
                            <FloatLabel label={t('discountAmount')}>
                                <div className='relative stock-discount-amount'>
                                    <Form.Item name='discountType' initialValue={DiscountTypeEnum.Percent}
                                               className='absolute z-10 left-[1px] top-[7px]'>
                                        <Radio.Group
                                            className='!pt-0 radio-wrapper' size="small"
                                            onChange={() => onChangeDiscountType()}
                                        >
                                            <Radio.Button className='!h-7 !w-11 radio-custom'
                                                          value={DiscountTypeEnum.Percent}>%</Radio.Button>
                                            <Radio.Button className='!h-7 !w-11 radio-custom'
                                                          value={DiscountTypeEnum.Value}>VNĐ</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <DiscountMove/>
                                </div>
                            </FloatLabel>
                        </ColSpanResponsive>
                        <ColSpanResponsive span={24}>
                            <FloatLabel label={t('taxDiscountPercent')}>
                                <Form.Item name='taxDiscountCode'>
                                    <OrdSelect allowClear={false} datasource={useSelectTaxCode()}
                                               onChange={(data, option: IOrdSelectOption) => {
                                                   form.setFieldValue("taxDiscountPercent", option.data?.taxPercent);
                                               }}/>
                                </Form.Item>
                                <Form.Item hidden name='taxDiscountPercent'/>
                            </FloatLabel>
                        </ColSpanResponsive>
                        <ColSpanResponsive span={24}>
                            <FloatLabel label={t('taxAmount')}>
                                <Form.Item name='taxAmount' className='text-right'>
                                    <PriceNumberInput disabled></PriceNumberInput>
                                </Form.Item>
                            </FloatLabel>
                        </ColSpanResponsive>
                    </div>


                    <ColSpanResponsive span={24}>
                        <FloatLabel label={t('totalAmount')}>
                            <Form.Item name='totalAmountRound' className='text-right'>
                                <PriceNumberInput disabled></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                        <Form.Item noStyle name='totalAmount'/>
                    </ColSpanResponsive>
                    <ColSpanResponsive span={24} className={paymentMode_w == 1 ? 'hidden' : ''}>
                        <FloatLabel label={paymentMode_w == 2 ? t('paymentAmount') : t('depositAmount')}>
                            <Form.Item name='paymentAmount' initialValue={totalAmountRound_w}>
                                <PriceNumberInput max={totalAmountRound_w} min={0}
                                                  integerLimit={17}
                                                  decimalLimit={0}
                                                  isOnlyNumberInput
                                                  step={1000}
                                                  className='not-handler-wrap text-right'></PriceNumberInput>

                            </Form.Item>
                            <div className='flex justify-end'>
                                {debtAmount_w > 0 &&
                                    <Button size={'small'}
                                            onClick={() => onSetPaymentFull()}>{t('paymentFull')}</Button>}
                                {/*<Button size={'small'}*/}
                                {/*        onClick={() => onSetPaymentFull()}>{t('paymentFull')}</Button>*/}
                            </div>
                        </FloatLabel>
                    </ColSpanResponsive>
                    <ColSpanResponsive span={24} className={paymentMode_w == 1 ? 'hidden' : ''}>
                        <FloatLabel label={t('debtAmount')}>
                            <Form.Item name='debtAmount' className='text-right'>
                                <PriceNumberInput disabled></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                    </ColSpanResponsive>
                    {paymentMode_w === PaymentModeEnum.PayBefore && <ColSpanResponsive span={24}>
                        <FloatLabel label={t('paymentMethod')} required>
                            <Form.Item name='paymentMethod' initialValue={PaymentMethodEnum.TIEN_MAT}
                                       rules={[ValidateUtils.required]}>
                                <OrdSelect allowClear={false}
                                           datasource={paymentMethods}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </ColSpanResponsive>}
                </Row>
            </Card>
        </>
    );
};

PaymentInfo.propTypes = {};

export default observer(withPricePaymentInfo(PaymentInfo));
