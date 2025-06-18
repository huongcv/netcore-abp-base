import {Checkbox, Col, Form, Input} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import React from "react";
import {useTranslation} from "react-i18next";
import OrdDateInput from "@ord-components/forms/OrdDateInput";

const InvoiceInput = () => {
    const [t] = useTranslation('stock');
    const form = Form.useFormInstance();
    const hasInvoice_w = Form.useWatch('hasInvoice', form);
    return (
        <>
            <Col span={10} className='pt-[10px]'>
                <Form.Item name='hasInvoice' valuePropName="checked"
                           style={{marginTop: -12}}
                           initialValue={false}>
                    <Checkbox>{t('hasInvoice')}</Checkbox>
                </Form.Item>
            </Col>

            {
                hasInvoice_w &&
                <>
                    <Col span={12}>
                        <FloatLabel label={t('InvoiceCode')}>
                            <Form.Item name={'invoiceCode'}>
                                <Input/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={t('InvoiceDate')}>
                            <Form.Item name={'invoiceDate'}>
                                <OrdDateInput/>
                            </Form.Item>
                        </FloatLabel>

                    </Col>

                </>
            }

        </>
    );
}
export default InvoiceInput;
