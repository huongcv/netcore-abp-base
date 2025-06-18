import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import { currencyDefault } from "@ord-core/AppConst";
import utils from "@ord-core/utils/utils";
import { Col, Flex, Form, Input, Row } from "antd";
import { observer } from "mobx-react-lite/src/observer";
import { useTranslation } from "react-i18next";
import "@pages/2.Restaurant/CentralBilling/index.scss"
import { PaymentMethodForm } from "./PaymentMethod";
import FloatLabel from "@ord-components/forms/FloatLabel";
import validateUtils from "@ord-core/utils/validate.utils";
import withTotalPriceBox from "./WithTotalPriceBox";
import { useEffect, useMemo } from "react";
import { round } from "lodash";
import { DiscountForm } from "./DiscountForm";
import {SaleInvoiceService} from "@api/SaleInvoiceService";

const { TextArea } = Input;
const RightBox = (props: {
    partnerId: number
}) => {
    const [t] = useTranslation("checkout");
    const form = Form.useFormInstance();

    const totalAmount_w = Form.useWatch('totalAmount', form);
    const paymentAmount_w = Form.useWatch('paymentAmount', form);

    const debtAmount = useMemo(() => {
        return round((totalAmount_w || 0) - (paymentAmount_w || 0), 2);
    }, [paymentAmount_w, totalAmount_w]);
    useEffect(() => {
        if(props.partnerId){
            SaleInvoiceService.getDiscountByCustomerGroup({
                listPartnerId: [props.partnerId],
            }).then(res=>{
                if(res && res[0]){

                }
            })
        }
    }, [props.partnerId]);

    return (
        <>
            <h3 className={'font-bold text-xl'}>{t('Thông tin chung')}</h3>
            <Col span={24} className="mt-2">
                <Row justify="space-between" className="text-md items-center">
                    <Col>Khách hàng</Col>
                    <Col>
                        <strong>{form.getFieldValue('partnerName')}</strong>
                    </Col>
                </Row>
            </Col>
            <Col span={24} className="mt-2">
                <DiscountForm />
            </Col>

            <Col span={24} className="mt-2">
                <Row justify="space-between" className="text-md items-center">
                    <Col>
                        <strong>{t("totalAmount")}</strong>
                    </Col>
                    <Col>
                        <strong>{utils.formatterNumber(totalAmount_w, 0)} {currencyDefault}</strong>
                    </Col>
                </Row>
            </Col>

            <Col span={24} className="mt-2">
                <Row justify="space-between" align="middle" className="mb-2">
                    <Col>Khách trả</Col>
                    <Flex className="items-center cs-input">
                        <Form.Item name="paymentAmount" style={{ width: 120 }}>
                            <PriceNumberInput
                                className="border-none w-full font-semibold"
                                step={1000}
                                min={0}
                            />
                        </Form.Item>
                        &nbsp;<strong>{currencyDefault}</strong>
                    </Flex>
                </Row>
            </Col>

            {debtAmount > 0 && (
                <>   <Col span={24} className="mt-2">
                    <Row justify="space-between" className="text-md items-center">
                        <Col>
                            <strong>{t("Công nợ")}</strong>
                        </Col>
                        <Col>
                            <strong>{utils.formatterNumber(debtAmount, 0)} {currencyDefault}</strong>
                        </Col>
                    </Row>
                </Col>
                </>
            )
            }
            <Col span={24} className="mt-2">
               <PaymentMethodForm totalPayment={0} />
                
            </Col>
            <Col span={24} className="mt-2">
                <FloatLabel label={'Ghi chú'}>
                    <Form.Item name={"note"} rules={[validateUtils.maxLength(200)]}>
                        <TextArea
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            allowClear
                        />
                    </Form.Item>
                </FloatLabel>
            </Col>

            <div hidden>
                <Form.Item name='totalAmountBeforeDiscount' />
                <Form.Item name='totalAmountAfterDiscount' />
                <Form.Item name='subTotalAmount' />
                <Form.Item name='taxAmount' />
                <Form.Item name='totalAmount' />
                <Form.Item name='paymentAmount' />
                <Form.Item name="debtAmount" />
            </div>
        </>
    );
};
export default observer(withTotalPriceBox(RightBox));
