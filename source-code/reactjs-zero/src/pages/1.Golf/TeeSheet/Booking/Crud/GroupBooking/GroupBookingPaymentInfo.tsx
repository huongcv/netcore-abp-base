import React from 'react';
import {Card, Form, Row} from "antd";
import OrdRadio from "@ord-components/forms/select/OrdRadio";
import {usePaymentMode} from "@ord-components/forms/select/selectDataSource/golf/usePaymentMode";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import './PaymentInfo.scss'
import {PaymentMethodEnum} from "@pages/SalesInvoice/Form/paymentMethodForm";
import {observer} from "mobx-react-lite";
import withPricePaymentInfo from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/withPricePaymentInfo";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PaymentModeEnum} from "@pages/1.Golf/TeeSheet/Booking/enum/paymentModeEnum";

const GroupBookingPaymentInfo = (props: {}) => {
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
    const paymentMethods = useSelectPaymentMethod({
        hiddenCentralBilling: true
    });
    return (
        <>

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

                    {paymentMode_w ===PaymentModeEnum.PayBefore && <ColSpanResponsive span={24}>
                        <FloatLabel label={t('paymentMethod')} required>
                            <Form.Item name='paymentMethod' initialValue={PaymentMethodEnum.TIEN_MAT} rules={[ValidateUtils.required]}>
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


export default observer(GroupBookingPaymentInfo);
