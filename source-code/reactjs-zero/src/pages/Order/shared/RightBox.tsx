import FloatLabel from "@ord-components/forms/FloatLabel";
import validateUtils from "@ord-core/utils/validate.utils";
import { Col, Form, Input, InputNumber, Row, Space } from "antd";
import { observer } from "mobx-react-lite/src/observer";
import { useTranslation } from "react-i18next";
import { NoteInput } from "./NoteInput";
import { OrderDateAndOrderCode } from "./OrderDateAndOrderCode";
import { SaveBtnGroup } from "./SaveBtnGroup";
import TotalAmountBox from "./TotalAmountBox";
import { CustomerSelectForm } from "@pages/SalesInvoice/Form/CustomerSelectForm";
import CollapsibleSection from "./CollapsibleSection";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectTransportUnit } from "@ord-components/forms/select/selectDataSource/useSelectTransportUnit";

const RightBox = () => {
    const [t] = useTranslation("order");

    const form = Form.useFormInstance();

    return (
        <>
            <CollapsibleSection title={t('information')}>
                <OrderDateAndOrderCode />
                <Col span={24}>
                    <FloatLabel label={t('partnerCustomer')}>
                        <Form.Item name={"partnerId"} >
                            <Input />
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </CollapsibleSection>

            <CollapsibleSection title={t('deliveryInfo')}>
                <>
                    <Col span={24}>
                        <FloatLabel label={t('expectedDelivery')}>
                            <Form.Item name={"partnerId"} >
                                <OrdDateInput />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t('receiverName')}>
                            <Form.Item name={"partnerId"} >
                                <Input />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t('receiverPhone')}>
                            <Form.Item name={"partnerId"} >
                                <Input />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t('receiverAddress')}>
                            <Form.Item name={"partnerId"} >
                                <Input />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </>
            </CollapsibleSection>

            <CollapsibleSection title={t('transport')}>
                <>
                    <Col span={24}>
                        <FloatLabel label={t('shippingSupplier')}>
                            <Form.Item name={"partnerId"} >
                                <OrdSelect datasource={useSelectTransportUnit()} />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t('size')}>
                            <Form.Item
                                name="size"

                            >
                                <Space.Compact>
                                    <Form.Item name={['size', 'length']} noStyle>
                                        <InputNumber
                                            style={{ width: '33%' }}
                                            placeholder={t('length')}
                                            min={0}
                                            addonAfter="cm"
                                        />
                                    </Form.Item>
                                    <Form.Item name={['size', 'width']} noStyle>
                                        <InputNumber
                                            style={{ width: '33%' }}
                                            placeholder={t('width')}
                                            min={0}
                                            addonAfter="cm"
                                        />
                                    </Form.Item>
                                    <Form.Item name={['size', 'height']} noStyle>
                                        <InputNumber
                                            style={{ width: '34%' }}
                                            placeholder={t('height')}
                                            min={0}
                                            addonAfter="cm"
                                        />
                                    </Form.Item>
                                </Space.Compact>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </>
            </CollapsibleSection>
            <CollapsibleSection title={t('paymentInfo')}>
                <TotalAmountBox></TotalAmountBox>
                <NoteInput />
            </CollapsibleSection>
            <SaveBtnGroup />
            
        </>
    );
};
export default observer(RightBox);
