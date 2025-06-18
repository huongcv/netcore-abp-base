import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import {PaymentMethodEnum} from "@pages/SalesInvoice/Form/paymentMethodForm";
import {Button, Form, Radio} from "antd";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import "./../index.scss";
import DiscountMove from "./DiscountMove";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const TotalAmountBox = (props: { isHiddenPaymentInformation?: boolean }) => {
    const [t] = useTranslation("order");
    const form = Form.useFormInstance();
    const totalAmountRound_w = Form.useWatch("totalAmountRound", form);
    const debtAmount_w = Form.useWatch("debtAmount", form);

    const onSetPaymentFull = () => {
        form.setFieldValue("paymentAmount", totalAmountRound_w);
    };
    const onChangeDiscountType = () => {
        form.setFieldValue("discountValue", 0);
    };
    const paymentMethods = useSelectPaymentMethod();

    return (<>
        <ColSpanResponsive span={24}>
            <FloatLabel label={t('priceBoxMove.totalAmountBeforeDiscount')}>
                <Form.Item name='totalAmountBeforeDiscount' className='text-right'>
                    <PriceNumberInput disabled></PriceNumberInput>
                </Form.Item>
            </FloatLabel>
        </ColSpanResponsive>
        <ColSpanResponsive span={24}>
            <FloatLabel label={t('priceBoxMove.discountAmount')}>
                <div className='relative order-discount-amount'>
                    <Form.Item name='discountType' initialValue={DiscountTypeEnum.Percent}
                               className='absolute z-10 left-[1px] top-[7px]'>
                        <Radio.Group
                            className='!pt-0 radio-wrapper' size="small"
                            onChange={() => onChangeDiscountType()}>
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
                    <OrdSelect allowClear={false}
                               onChange={(data, option: IOrdSelectOption) => {
                                   form.setFieldValue("taxDiscountPercent", option.data?.taxPercent);
                               }}
                               datasource={useSelectTaxCode()}
                    />
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
        <ColSpanResponsive span={24}>
            <FloatLabel label={t('totalAmount')}>
                <Form.Item name='totalAmountRound' className='text-right'>
                    <PriceNumberInput disabled></PriceNumberInput>
                </Form.Item>
            </FloatLabel>
            <Form.Item noStyle name='totalAmount'/>
        </ColSpanResponsive>
        <ColSpanResponsive span={24}>
            <FloatLabel label={t('Thanh toán')}>
                <Form.Item name='paymentAmount' initialValue={totalAmountRound_w}>
                    <PriceNumberInput max={totalAmountRound_w} min={0}
                                      integerLimit={17}
                                      decimalLimit={0}
                                      isOnlyNumberInput
                                      step={1000}
                                      className='not-handler-wrap text-right'></PriceNumberInput>
                </Form.Item>
                {debtAmount_w > 0 &&

                    <Button size={'small'} className='float-right mb-2'
                            onClick={() => onSetPaymentFull()}>{t('paymentFull')}</Button>}
            </FloatLabel>
        </ColSpanResponsive>
        <ColSpanResponsive span={24}>
            <FloatLabel label={t('priceBoxMove.debtAmount')}>
                <Form.Item name='debtAmount' className='text-right'>
                    <PriceNumberInput disabled></PriceNumberInput>
                </Form.Item>
            </FloatLabel>
        </ColSpanResponsive>
        <ColSpanResponsive span={24}>
            <FloatLabel label={t('Phương thức thanh toán')}>
                <Form.Item name='paymentMethod' initialValue={PaymentMethodEnum.TIEN_MAT}>
                    <OrdSelect allowClear={false}
                               datasource={paymentMethods}></OrdSelect>
                </Form.Item>
            </FloatLabel>
        </ColSpanResponsive>
    </>);
};
export default observer(TotalAmountBox);
